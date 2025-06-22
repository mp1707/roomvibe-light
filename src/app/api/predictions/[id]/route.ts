import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: "Das REPLICATE_API_TOKEN ist nicht konfiguriert." },
      { status: 500 }
    );
  }

  try {
    const { id } = await params;

    const prediction = await replicate.predictions.get(id);

    if (prediction?.error) {
      return NextResponse.json({ detail: prediction.error }, { status: 500 });
    }

    return NextResponse.json(prediction);
  } catch (error) {
    console.error("Fehler beim Abrufen der Prediction:", error);
    return NextResponse.json(
      { error: "Prediction konnte nicht abgerufen werden." },
      { status: 500 }
    );
  }
}
