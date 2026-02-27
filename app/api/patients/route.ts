import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PatientModel from "@/lib/models/Patient";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "patients.json");
const VALID_STATUSES = new Set(["normal", "warning", "critical"]);
const VALID_TRENDS = new Set(["up", "down", "stable"]);

function normalizeMetric(m: any) {
    const label = m.label ?? m.name ?? m.metric ?? m.metric_name ?? m.parameter ?? m.test_name ?? "Metric";
    const value = m.value ?? m.val ?? m.reading ?? m.result ?? "—";
    const unit = m.unit ?? m.units ?? "";
    const rawTrend = String(m.trend ?? "stable").toLowerCase();
    const rawStatus = String(m.status ?? "normal").toLowerCase();
    return {
        label: String(label),
        value: String(value),
        unit: String(unit),
        trend: VALID_TRENDS.has(rawTrend) ? rawTrend : "stable",
        status: VALID_STATUSES.has(rawStatus) ? rawStatus : "normal",
    };
}

function normalizeMongo(p: any) {
    return {
        ...p,
        id: p.patientId ?? p.id,
        patientId: p.patientId ?? p.id,
        clinicalMetrics: Array.isArray(p.clinicalMetrics)
            ? p.clinicalMetrics.map(normalizeMetric)
            : [],
    };
}

/** GET /api/patients
 *  Tries MongoDB first; falls back to patients.json if DB not connected or empty.
 */
export async function GET() {
    try {
        await connectDB();
        const docs = await PatientModel.find({}).lean();
        if (docs.length > 0) {
            return NextResponse.json(docs.map(normalizeMongo), {
                headers: { "Cache-Control": "no-store" },
            });
        }
    } catch {
        // MongoDB unavailable — fall through to JSON fallback
    }

    // Fallback: read from JSON file
    try {
        const raw = await fs.readFile(DATA_FILE, "utf-8");
        const patients = JSON.parse(raw) as any[];
        return NextResponse.json(
            patients.map(p => ({
                ...p,
                patientId: p.id,
                clinicalMetrics: Array.isArray(p.clinicalMetrics)
                    ? p.clinicalMetrics.map(normalizeMetric)
                    : [],
            })),
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
