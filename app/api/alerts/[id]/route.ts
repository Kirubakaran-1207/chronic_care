import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AlertModel from "@/lib/models/Alert";

/** PATCH /api/alerts/[id] — update alert status (Acknowledged / Resolved / Active) */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();
        const { status } = body;

        const update: Record<string, unknown> = { status };
        if (status === "Resolved") update.resolvedAt = new Date();

        const alert = await AlertModel.findOneAndUpdate(
            { alertId: id },
            { $set: update },
            { new: true }
        );

        if (!alert) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(alert);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
