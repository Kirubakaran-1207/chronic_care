import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Prescription from "@/lib/models/Prescription";

/** PATCH /api/prescriptions/[id] — update status (Dispensed / Cancelled) */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const { status } = await req.json();

        const doc = await Prescription.findOneAndUpdate(
            { prescriptionId: id },
            { $set: { status } },
            { new: true }
        );

        if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(doc);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
