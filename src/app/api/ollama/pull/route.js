import { Ollama } from 'ollama';

const ollama = new Ollama({
  host: 'http://localhost:11434'
});

export async function POST(request) {
  try {
    const { model } = await request.json();
    
    if (!model) {
      return new Response(JSON.stringify({ error: "Model name is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    pullModel(model, writer, encoder);
    
    return new Response(stream.readable, {
      headers: { 'Content-Type': 'text/event-stream' }
    });
  } catch (error) {
    console.error("Pull Error:", error);
    return new Response(JSON.stringify({ error: "Server error", message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function pullModel(model, writer, encoder) {
  try {
    const response = await ollama.pull({
      model,
      stream: true,
    });

    for await (const part of response) {
      await writer.write(
        encoder.encode(`data: ${JSON.stringify(part)}\n\n`)
      );
    }
  } catch (error) {
    console.error("Error pulling model:", error);
    await writer.write(
      encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`)
    );
  } finally {
    await writer.close();
  }
}