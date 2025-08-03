const WebSocket = require('ws');
require('dotenv').config();

const wss = new WebSocket.Server({ port: 3001 });

console.log("🚀 WebSocket server running on port 3001");

wss.on('connection', (ws) => {
  console.log("✅ WebSocket connection established");
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log("📨 Received message:", data);
      
      if (data.type === "translate") {
        // Forward the translation request to OpenAI
        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: `You are an emoji translation assistant. Translate the user's text into emoji expressions based on the mode:
                  - Normal: Add relevant emojis naturally to enhance the text
                  - Savage: Translate into sarcastic, witty emoji expressions with attitude
                  - GenZ: Convert to GenZ slang with trendy emojis and modern language
                  - TikTok: Convert to TikTok-style expressions using Douyin platform-specific custom emoji shortcodes like [smile], [happy], [loveface], [cry], [angry], [surprised], [cool], [excited], [proud], [lovely], [greedy], [wow], [joyful], [hehe], [slap], [tears], [stun], [cute], [blink], [disdain], [astonish], [rage], [smileface], [evil], [angel], [laugh], [pride], [nap], [awkward], [shock]. These are Douyin platform-specific custom emoji symbols, not traditional Unicode emojis. Use exaggerated, fun, and engaging emoji combinations that mimic TikTok creator expression styles.
                  
                  Current mode: ${data.mode}
                  
                  Always respond with the translated text only, no explanations.`
              },
              {
                role: "user", 
                content: data.content
              }
            ],
            stream: true,
            temperature: 0.7
          })
        });

        if (!openaiResponse.ok) {
          const errorText = await openaiResponse.text();
          console.error("❌ OpenAI API error:", errorText);
          ws.send(JSON.stringify({
            type: "error",
            message: "Failed to get translation from OpenAI"
          }));
          return;
        }

        const reader = openaiResponse.body?.getReader();
        if (!reader) {
          ws.send(JSON.stringify({
            type: "error", 
            message: "No response body from OpenAI"
          }));
          return;
        }

        let fullResponse = "";
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                // Send final response
                console.log("✅ Translation complete:", fullResponse);
                ws.send(JSON.stringify({
                  type: "translation",
                  content: fullResponse
                }));
                return;
              }
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  fullResponse += content;
                  // Send partial response for streaming
                  ws.send(JSON.stringify({
                    type: "translation_partial",
                    content: content
                  }));
                }
              } catch (e) {
                // Ignore parsing errors for incomplete JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("❌ WebSocket message error:", error);
      ws.send(JSON.stringify({
        type: "error",
        message: "Internal server error"
      }));
    }
  });

  ws.on('close', () => {
    console.log("🔌 WebSocket connection closed");
  });

  ws.on('error', (error) => {
    console.error("❌ WebSocket error:", error);
  });
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
  console.log("\n🛑 Shutting down WebSocket server...");
  wss.close(() => {
    console.log("✅ WebSocket server closed");
    process.exit(0);
  });
}); 