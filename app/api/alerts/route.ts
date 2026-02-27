import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AlertModel from "@/lib/models/Alert";

/** GET /api/alerts — list alerts; optionally filter by status or severity */
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const severity = searchParams.get("severity");

        const query: Record<string, string> = {};
        if (status) query.status = status;
        if (severity) query.severity = severity;

        const alerts = await AlertModel.find(query)
            .sort({ createdAt: -1 })
            .lean();
        return NextResponse.json(alerts, { headers: { "Cache-Control": "no-store" } });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

/** POST /api/alerts — create a new alert (e.g. threshold-triggered) */
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const alertId = `ALT-${Date.now()}`;
        const alert = await AlertModel.create({ alertId, ...body, status: "Active" });
        return NextResponse.json(alert, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
