import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

// Set the runtime to edge for best performance
export const config = {
    runtime: "edge",
};

export default async function handler(request, response) {
    const { question } = await request.json();

    // Fetch the response from the OpenAI API
    const openai = new OpenAI({
        apiKey: "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",
    });

    const responseFromOpenAI = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0,
        top_p: 1,
        messages: [{ role: "user", content: question }],
        stream: true,
    })

    try {
        // Convert the response into a friendly text-stream
        const stream = OpenAIStream(responseFromOpenAI);
        // Respond with the stream
        return new StreamingTextResponse(stream);
      } catch (error) {
        return response.send(400).send(error);
      }
}