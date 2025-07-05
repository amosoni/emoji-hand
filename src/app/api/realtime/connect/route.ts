import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { offer, mode } = await req.json();

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Initialize OpenAI Realtime API connection
    const response = await fetch("https://api.openai.com/v1/realtime/connections", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "realtime=v1"
      },
      body: JSON.stringify({
        offer: offer,
        model: "gpt-4o-realtime",
        tools: [
          {
            type: "function",
            function: {
              name: "translate_to_emoji",
              description: "Translate text to emoji expression based on the specified mode",
              parameters: {
                type: "object",
                properties: {
                  text: {
                    type: "string",
                    description: "The text to translate to emoji"
                  },
                  mode: {
                    type: "string",
                    enum: ["normal", "savage", "genz"],
                    description: "Translation mode: normal (add emojis), savage (sarcastic), genz (GenZ slang)"
                  }
                },
                required: ["text", "mode"]
              }
            }
          }
        ],
        system_message: `You are an emoji translation assistant. You help users translate their text into expressive emoji versions based on the mode they choose:

- Normal mode: Add relevant emojis to enhance the text naturally
- Savage mode: Translate into sarcastic, witty emoji expressions
- GenZ mode: Convert to GenZ slang with trendy emojis

Always respond with the translated text using the translate_to_emoji function. Current mode: ${mode}`
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI Realtime API error:", errorData);
      return NextResponse.json(
        { error: "Failed to connect to OpenAI Realtime API" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      answer: data.answer,
      connection_id: data.connection_id
    });

  } catch (error) {
    console.error("WebRTC connection error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 