import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "patients.json");

const VALID_STATUSES = new Set(["normal", "warning", "critical"]);
const VALID_TRENDS = new Set(["up", "down", "stable"]);

/** Normalise a single metric object regardless of which field names Groq used */
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

/** GET /api/patients — read all patients from disk, normalising metrics on the way out */
export async function GET() {
    try {
        const raw = await fs.readFile(DATA_FILE, "utf-8");
        const patients = JSON.parse(raw) as any[];

        const normalised = patients.map((p) => ({
            ...p,
            clinicalMetrics: Array.isArray(p.clinicalMetrics)
                ? p.clinicalMetrics.map(normalizeMetric)
                : [],
        }));

        return NextResponse.json(normalised, {
            headers: { "Cache-Control": "no-store" },
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
