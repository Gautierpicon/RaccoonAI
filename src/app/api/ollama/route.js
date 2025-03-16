export async function POST(request) {
    try {
      const { prompt } = await request.json();
      
      if (!prompt) {
        return new Response(JSON.stringify({ error: "Prompt requis" }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
  
      const ollamaResponse = await fetchOllamaResponse(prompt);
      
      return new Response(JSON.stringify({ response: ollamaResponse }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error("Erreur API:", error);
      return new Response(JSON.stringify({ error: "Erreur serveur" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  async function fetchOllamaResponse(prompt) {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama3.2:latest", prompt }),
    });
  
    if (!res.ok) {
      throw new Error(`Erreur API Ollama: ${res.status}`);
    }
  
    if (!res.body) {
      throw new Error("Pas de réponse de l'API.");
    }
  
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let finalText = "";
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
            finalText += data.response;
          }
        } catch (error) {
          console.error("Error parsing JSON:", line);
        }
      }
    }
  
    return finalText;
  }