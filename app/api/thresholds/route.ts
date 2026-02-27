import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ThresholdSettings from "@/lib/models/ThresholdSettings";

const DEFAULT_DOCTOR = "dr-priya-nair";

/** GET /api/thresholds — fetch current threshold settings for the doctor */
export async function GET() {
    try {
        await connectDB();
        const found = await ThresholdSettings.findOne({ doctorId: DEFAULT_DOCTOR }).lean();
        const doc = found ?? { doctorId: DEFAULT_DOCTOR, heartRate: 90, systolicBP: 140, spo2: 95, glucose: 180 };
        return NextResponse.json(doc, { headers: { "Cache-Control": "no-store" } });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

/** PUT /api/thresholds — save updated thresholds */
export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { heartRate, systolicBP, spo2, glucose } = body;

        const doc = await ThresholdSettings.findOneAndUpdate(
            { doctorId: DEFAULT_DOCTOR },
            { heartRate, systolicBP, spo2, glucose, updatedAt: new Date() },
            { upsert: true, new: true }
        );
        return NextResponse.json(doc);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
