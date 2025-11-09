import { Ollama } from "ollama";

const ollama = new Ollama({
  host: "http://localhost:11434",
});

export async function DELETE(request) {
  try {
    const { model } = await request.json();

    if (!model) {
      return new Response(
        JSON.stringify({ success: false, error: "Model name is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await ollama.delete({ model });

    return new Response(
      JSON.stringify({
        success: true,
        message: `Model ${model} deleted successfully`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Delete Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to delete model",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
