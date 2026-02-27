import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Prescription from "@/lib/models/Prescription";

/** GET /api/prescriptions?patientId=... */
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const patientId = searchParams.get("patientId");
        const query = patientId ? { patientId } : {};
        const prescriptions = await Prescription.find(query)
            .sort({ createdAt: -1 })
            .lean();
        return NextResponse.json(prescriptions, { headers: { "Cache-Control": "no-store" } });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

/** POST /api/prescriptions — create a new prescription & simulate sharing with pharmacy */
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { patientId, patientName, disease, doctorName, items, diagnosis, notes } = body;

        if (!patientId || !items?.length) {
            return NextResponse.json({ error: "patientId and at least one medicine item are required" }, { status: 400 });
        }

        const prescriptionId = `RX-${Date.now()}`;

        // Simulate sharing with pharmacy (POST to external pharmacy API)
        // In production, replace this URL with the real pharmacy service endpoint
        let pharmacyShared = false;
        let sharedAt: Date | undefined;
        try {
            // Simulated successful pharmacy share (static / no real call)
            pharmacyShared = true;
            sharedAt = new Date();
            // Uncomment in production:
            // await fetch("https://pharmacy.example.com/api/prescriptions", { method: "POST", ... });
        } catch {
            pharmacyShared = false;
        }

        const prescription = await Prescription.create({
            prescriptionId,
            patientId,
            patientName: patientName || "",
            disease: disease || "",
            doctorId: "dr-priya-nair",
            doctorName: doctorName || "Dr. Priya Nair",
            items,
            diagnosis: diagnosis || "",
            notes: notes || "",
            status: "Pending",
            pharmacyShared,
            sharedAt,
        });

        return NextResponse.json(prescription, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
