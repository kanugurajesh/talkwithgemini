import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { audio } = await request.json();

    if (!audio) {
      return NextResponse.json(
        { error: 'No audio data provided' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert base64 to binary
    const binaryAudio = Buffer.from(audio, 'base64');

    const result = await model.generateContent([
      "Transcribe this audio to English. Return only the transcribed text without any additional commentary or formatting.",
      {
        inlineData: {
          data: binaryAudio.toString('base64'),
          mimeType: "audio/mp3"
        },
      },
    ]);

    return NextResponse.json({ text: result.response.text() });
  } catch (error) {
    console.error('Error in transcribe API:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}
