import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Patient from "@/lib/models/Patient";
import fs from "fs";
import path from "path";

/** DELETE /api/patients/[id] — remove patient from MongoDB and patients.json */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectDB();

        // Remove from MongoDB (match by patientId field or _id)
        const deleted = await Patient.findOneAndDelete({ patientId: id });

        // Also remove from the static JSON fallback so UI stays consistent
        const jsonPath = path.join(process.cwd(), "data", "patients.json");
        if (fs.existsSync(jsonPath)) {
            const raw = fs.readFileSync(jsonPath, "utf8");
            const arr = JSON.parse(raw);
            const filtered = arr.filter((p: any) => p.id !== id && p.patientId !== id);
            fs.writeFileSync(jsonPath, JSON.stringify(filtered, null, 2));
        }

        if (!deleted) {
            // Patient might only be in JSON; still return success since we cleaned JSON
            return NextResponse.json({ message: "Removed from local records" });
        }

        return NextResponse.json({ message: "Patient deleted", id });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
