export async function POST(request) {
  try {
    const { prompt, model } = await request.json();
    
    if (!prompt || !model) {
      return new Response(JSON.stringify({ error: "Prompt and model are required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const ollamaResponse = await fetchOllamaResponse(prompt, model);
    
    return new Response(JSON.stringify({ response: ollamaResponse }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function fetchOllamaResponse(prompt, model) {
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