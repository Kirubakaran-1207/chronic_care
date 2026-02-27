import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AppointmentModel from "@/lib/models/Appointment";

/** PATCH /api/appointments/[id] — update appointment status */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const { status, notes } = await req.json();

        const update: Record<string, string> = {};
        if (status) update.status = status;
        if (notes !== undefined) update.notes = notes;

        const appt = await AppointmentModel.findOneAndUpdate(
            { appointmentId: id },
            { $set: update },
            { new: true }
        );

        if (!appt) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(appt);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

/** DELETE /api/appointments/[id] — cancel an appointment */
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        await AppointmentModel.findOneAndUpdate(
            { appointmentId: id },
            { $set: { status: "Cancelled" } }
        );
        return NextResponse.json({ ok: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
