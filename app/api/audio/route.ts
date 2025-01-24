import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const { audioData } = await request.json();
    
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert base64 to proper format for the API
    const result = await model.generateContent([
      "Tell me about this audio clip.",
      {
        inlineData: {
          data: audioData,
          mimeType: "audio/mp3"
        }
      }
    ]);

    const response = await result.response.text();
    return NextResponse.json({ response });

  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    );
  }
}
