import { Ollama } from 'ollama';

const ollama = new Ollama({
  host: 'http://localhost:11434'
});

export async function POST(request) {
  try {
    const { prompt, model, conversation } = await request.json();
    
    if (!prompt || !model) {
      return new Response(JSON.stringify({ error: "Prompt and model are required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    streamOllamaResponse(prompt, model, conversation, writer, encoder);
    
    return new Response(stream.readable, {
      headers: { 'Content-Type': 'text/event-stream' }
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function streamOllamaResponse(prompt, model, conversation, writer, encoder) {
  try {
    const messages = conversation 
      ? conversation.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      : [{ role: "user", content: prompt }];

    const response = await ollama.chat({
      model,
      messages,
      stream: true,
    });

    for await (const part of response) {
      if (part.message?.content) {
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ token: part.message.content })}\n\n`)
        );
      }
      
      if (part.done) {
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
        );
      }
    }
  } catch (error) {
    console.error("Error in streaming:", error);
    await writer.write(
      encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`)
    );
  } finally {
    await writer.close();
  }
}