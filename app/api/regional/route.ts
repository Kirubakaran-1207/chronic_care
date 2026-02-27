import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import RegionalPatient from "@/lib/models/RegionalPatient";

/**
 * GET /api/regional
 * Query params: state, city, disease, riskLevel
 * Returns:
 *  - summary: { total, byDisease, byRisk, byState (top 10) }
 *  - rows: raw paginated patient rows (max 200)
 *  - filters: { states[], cities[], diseases[], riskLevels[] }
 */
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);

        const state = searchParams.get("state") || "";
        const city = searchParams.get("city") || "";
        const disease = searchParams.get("disease") || "";
        const riskLevel = searchParams.get("riskLevel") || "";

        // Build match filter
        const match: Record<string, string | RegExp> = {};
        if (state) match.state = state;
        if (city) match.city = city;
        if (disease) match.disease = disease;
        if (riskLevel) match.riskLevel = riskLevel;

        const [summary, rows, allStates, allCities] = await Promise.all([
            // Aggregation: by disease, by risk, by state
            RegionalPatient.aggregate([
                { $match: match },
                {
                    $facet: {
                        total: [{ $count: "count" }],
                        byDisease: [{ $group: { _id: "$disease", count: { $sum: 1 } } }, { $sort: { count: -1 } }],
                        byRisk: [{ $group: { _id: "$riskLevel", count: { $sum: 1 } } }],
                        byState: [{ $group: { _id: "$state", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 15 }],
                        byCity: [{ $group: { _id: "$city", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 20 }],
                        avgMetrics: [{
                            $group: {
                                _id: null,
                                avgHR: { $avg: "$heartRate" },
                                avgSBP: { $avg: "$systolicBP" },
                                avgDBP: { $avg: "$diastolicBP" },
                                avgChol: { $avg: "$cholesterol" },
                                avgHba1c: { $avg: "$hba1c" },
                                avgBMI: { $avg: "$bmi" },
                            }
                        }],
                        // Gender split
                        byGender: [{ $group: { _id: "$gender", count: { $sum: 1 } } }],
                        // Age distribution buckets
                        ageGroups: [{
                            $bucket: {
                                groupBy: "$age",
                                boundaries: [0, 18, 35, 50, 65, 80, 120],
                                default: "Other",
                                output: { count: { $sum: 1 } }
                            }
                        }],
                        // Disease × Risk cross-tab
                        diseaseRisk: [{
                            $group: {
                                _id: { disease: "$disease", risk: "$riskLevel" },
                                count: { $sum: 1 }
                            }
                        }],
                    },
                },
            ]),

            // Raw rows for table view
            RegionalPatient.find(match).select("-_id -__v").limit(200).lean(),

            // All unique states (for filter dropdown)
            RegionalPatient.distinct("state"),

            // Cities filtered by current state selection
            state
                ? RegionalPatient.distinct("city", { state })
                : RegionalPatient.distinct("city"),
        ]);

        const s = summary[0];
        return NextResponse.json({
            total: s.total[0]?.count ?? 0,
            byDisease: s.byDisease,
            byRisk: s.byRisk,
            byState: s.byState,
            byCity: s.byCity,
            avgMetrics: s.avgMetrics[0] ?? {},
            byGender: s.byGender,
            ageGroups: s.ageGroups,
            diseaseRisk: s.diseaseRisk,
            rows,
            filters: {
                states: allStates.sort(),
                cities: allCities.sort(),
                diseases: ["Heart", "BP", "Sugar", "Stress"],
                riskLevels: ["High", "Medium", "Low"],
            },
        }, { headers: { "Cache-Control": "no-store" } });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
