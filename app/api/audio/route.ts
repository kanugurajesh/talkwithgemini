import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { audioData, text } = body;

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt = "";
    if (text) {
      // If text is provided, use it directly
      prompt = text;
    } else if (audioData) {
      // If audio data is provided, we need to handle speech-to-text
      // For now, return an error message
      return NextResponse.json(
        { error: "Speech-to-text functionality is not implemented yet." },
        { status: 501 }
      );
    } else {
      return NextResponse.json({ error: "No input provided" }, { status: 400 });
    }

    // Generate response using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
