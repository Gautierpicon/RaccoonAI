export async function POST(request) {
  try {
    const { prompt, model } = await request.json();
    
    if (!prompt || !model) {
      return new Response(JSON.stringify({ error: "Prompt and model are required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Utiliser le streaming pour la réponse
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // Lancer le traitement de la réponse d'Ollama en arrière-plan
    fetchOllamaResponseStreaming(prompt, model, writer, encoder);
    
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

async function fetchOllamaResponseStreaming(prompt, model, writer, encoder) {
  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt }),
    });
    
    if (!res.ok) {
      throw new Error(`Ollama API Error: ${res.status}`);
    }
    
    if (!res.body) {
      throw new Error("No response from API");
    }
    
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let responseBuffer = "";
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      responseBuffer += decoder.decode(value);
      
      const lines = responseBuffer.split("\n");
      responseBuffer = lines.pop() || "";
      
      for (const line of lines) {
        if (line.trim() === "") continue;
        
        try {
          const data = JSON.parse(line);
          if (data.response) {
            // Envoyer chaque token au client
            await writer.write(encoder.encode(`data: ${JSON.stringify({ token: data.response })}\n\n`));
          }
          // Si c'est la fin de la réponse
          if (data.done) {
            await writer.write(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          }
        } catch (error) {
          console.error("Error parsing JSON:", line);
        }
      }
    }
  } catch (error) {
    console.error("Error in streaming:", error);
    await writer.write(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`));
  } finally {
    await writer.close();
  }
}