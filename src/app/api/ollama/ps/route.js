import { Ollama } from 'ollama';

const ollama = new Ollama({
  host: 'http://localhost:11434'
});

export async function GET() {
  try {
    const response = await ollama.ps();
    
    return new Response(JSON.stringify({ models: response.models || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("PS Error:", error);
    return new Response(
      JSON.stringify({ 
        models: [],
        error: "Server error", 
        message: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}