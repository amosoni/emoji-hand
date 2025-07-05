import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import fetch from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';

export const emojiRouter = createTRPCRouter({
  translate: publicProcedure
    .input(z.object({ text: z.string(), mode: z.enum(["normal", "savage", "genz"]) }))
    .mutation(async ({ input }) => {
      let prompt = "";
      if (input.mode === "normal") {
        prompt = `Take the following sentence and add relevant emojis to make it expressive and friendly. Keep the meaning clear and suitable for all audiences. Output both the emoji version and a short, friendly English phrase.\nSentence: "${input.text}"`;
      } else if (input.mode === "savage") {
        prompt = `Translate the following sentence into a bold, savage, and witty emoji message. Use emojis and a short English phrase that are direct, sassy, and a bit mocking or edgy. Don't be afraid to roast, tease, or add attitude. Output both the emoji version and a short, savage English phrase.\nSentence: "${input.text}"`;
      } else if (input.mode === "genz") {
        prompt = `Translate the following sentence into a GenZ-style emoji message. Use trendy emojis, internet slang, abbreviations, and memes popular with GenZ. The English phrase should sound like something from TikTok or group chats—full of energy, humor, and current internet culture. Output both the emoji version and a short GenZ English phrase.\nSentence: "${input.text}"`;
      }
      const agent = process.env.HTTP_PROXY ? new HttpsProxyAgent(process.env.HTTP_PROXY) : undefined;
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        }),
        agent,
      });
      const data = await res.json();
      return { result: data.choices?.[0]?.message?.content?.trim() ?? "" };
    }),
});
