export async function GET() {
    try {
      const res = await fetch("http://localhost:11434/api/tags", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!res.ok) {
        throw new Error(`Erreur API Ollama: ${res.status}`);
      }
  
      const data = await res.json();
      
      return new Response(JSON.stringify({ models: data.models }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error("Erreur API:", error);
      return new Response(JSON.stringify({ error: "Erreur serveur", message: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }