# RaccoonAI

![RaccoonAI Logo](/public/logo.svg)

## Description
RaccoonAI is a web user interface for Ollama that allows you to leverage locally-run artificial intelligence models. This application offers an intuitive user experience for interacting with Large Language Models (LLMs) running on your own machine via Ollama.

### Why 'Raccoon'?
Because raccoons are cuts aren't they?

<img
   src="https://cdn.futura-sciences.com/cdn-cgi/image/width=1024,quality=50,format=auto/sources/images/alexander-raton-laveur.jpeg"
   alt="A cute raccoon"
   width="400px"
/>
<img
   src="https://img.lovepik.com/photo/60161/1744.jpg_wh860.jpg"
   alt="Another cute raccoon"
   width="400px"
/>

## features

### All Ollama features
- 🚀 Local execution
- 🔒 All data remains local, preventing sensitive information from leaking out
- 🤖 Supports various models such as LLaMA, Mistral, Gemma etc.
- 💻 Multi-platform compatibility: Works on Windows, Mac and Linux
- 🎛️ Resource optimisation: Efficient use of CPU and GPU for improved performance

### Currently present
- 🔄 Streaming support for real-time responses
- 📋 Persistent conversation history
- 🧠 Manage models :
   - Select the model you wish to use
   - Download an AI model 
   - Delete an AI model
   - View running Models

## Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Ollama](https://ollamaAI/) installed

## Installation
1. Start the Ollama server
   ```bash
   ollama serve
   ```

2. Clone the repository
   ```bash
   git clone https://github.com/Gautierpicon/RaccoonAI.git
   cd RaccoonAI
   ```

3. Install dependencies
   ```bash
   npm install
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open your browser at [http://localhost:3000](http://localhost:3000)

## API Architecture
### Ollama JavaScript Library Integration
RaccoonAI uses the official [Ollama JavaScript library](https://github.com/ollama/ollama-js) for seamless communication with your local Ollama instance.

   ```javascript
   import { Ollama } from 'ollama';

   const ollama = new Ollama({
   host: 'http://localhost:11434'
   });
   ```
### API Endpoints

1. `/api/ollama/models` Retrieves the list of available models

- Method: `GET`
- Uses: `ollama.list()`
- Response: List of models available in your Ollama installation

```javascript
const response = await ollama.list();
   // Returns: { models: [...] }
```

2. `/api/ollama` Sends requests to models and receives responses

- Method: `POST`
- Uses: `ollama.chat()`
- Request body:

```json
{
   "prompt": "Your message",
   "model": "model-name",
   "conversation": [
      { "role": "user", "content": "Previous message" },
      { "role": "assistant", "content": "Previous response" }
   ]
}
```

3. `/api/ollama/pull` Downloads a new model

- Method: `POST`
- Uses: `ollama.pull()`
- Response: List of models available in your Ollama installation

```json
{
   "model": "llama3.1"
}
```

4. `/api/ollama/ps` Lists currently running models

- Method: `GET`
- Uses: `ollama.ps()`
- Response: List of models currently loaded in memory

5. `/api/ollama/delete` Deletes an installed model

- Method: `DELETE`
- Uses: `ollama.delete()`
- Request body:

```json
{
   "model": "model-name"
}
```

### Streaming Implementation
Response streaming is enabled by setting `stream: true`, modifying function calls to return an AsyncGenerator where each part is an object in the stream.

```javascript
// Excerpt from src/app/api/ollama/route.js
const stream = new TransformStream();
const writer = stream.writable.getWriter();
const encoder = new TextEncoder();

// Use Ollama library with streaming
const response = await ollama.chat({
  model,
  messages,
  stream: true,
});

// Process the stream
for await (const part of response) {
  if (part.message?.content) {
    await writer.write(
      encoder.encode(`data: ${JSON.stringify({ token: part.message.content })}\n\n`)
    );
  }
}

// Returns a response stream
return new Response(stream.readable, {
  headers: { 'Content-Type': 'text/event-stream' }
});
```

## Technologies Used
- **Next.js 15** - React framework
- **React 19** - UI library
- **Tailwind CSS** - Utility-first CSS framework

## Troubleshooting
### Ollama Not Detected
Make sure Ollama is running on `http://localhost:11434`. You can verify by visiting this URL in your browser.

### Models Not Available
If no models appear in the selector, download one via RaccoonAI or [Ollama](https://ollama.com/search):

Example:
```bash
ollama run llama3.2:1b
```

### Streaming Issues
If responses don't appear in real-time:
1. Check the console logs for errors
2. Make sure your browser supports Fetch API and Streams
3. Verify that the firewall isn't blocking communication with Ollama

## Contribution
Contributions are welcome! Feel free to open an [issue](https://github.com/Gautierpicon/RaccoonAI/issues) or a [pull request](https://github.com/Gautierpicon/RaccoonAI/pulls) on the GitHub repository.
