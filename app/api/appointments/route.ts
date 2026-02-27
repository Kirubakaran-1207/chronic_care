import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AppointmentModel from "@/lib/models/Appointment";

/** GET /api/appointments — list all appointments sorted by date */
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const patientId = searchParams.get("patientId");
        const query = patientId ? { patientId } : {};
        const appointments = await AppointmentModel.find(query)
            .sort({ date: 1, time: 1 })
            .lean();
        return NextResponse.json(appointments, { headers: { "Cache-Control": "no-store" } });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

/** POST /api/appointments — create a new appointment */
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const { patientId, patientName, disease, riskLevel, date, time, type, doctor, notes } = body;
        if (!patientId || !patientName || !date || !time) {
            return NextResponse.json({ error: "Missing required fields: patientId, patientName, date, time" }, { status: 400 });
        }

        const appointmentId = `A-${Date.now()}`;
        const appt = await AppointmentModel.create({
            appointmentId,
            patientId,
            patientName,
            disease: disease || "",
            riskLevel: riskLevel || "Medium",
            date,
            time,
            type: type || "Routine Check",
            status: "Confirmed",
            doctor: doctor || "Dr. Priya Nair",
            notes: notes || "",
        });

        return NextResponse.json(appt, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
