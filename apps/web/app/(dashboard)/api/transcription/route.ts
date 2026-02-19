import { elevenlabs } from '@ai-sdk/elevenlabs';
import { experimental_transcribe as transcribe } from "ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const audioFile = formData.get("audio") as File | null;

        if (!audioFile) {
            return NextResponse.json(
                { error: "No audio file provided" },
                { status: 400 },
            );
        }
        const arrayBuffer = await audioFile.arrayBuffer();
        const audioBuffer = Buffer.from(arrayBuffer);
        const result = await transcribe({
            model: elevenlabs.transcription('scribe_v2'),
            audio: audioBuffer,
            providerOptions: { elevenlabs: { languageCode: 'en' } },
        });

        return NextResponse.json({
            transcription: result.text,
        });
    } catch (error) {
        console.error("Transcription error:", error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Transcription failed",
            },
            { status: 500 },
        );
    }
}