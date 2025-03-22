# Raccoon.ai
![Raccoon.ai Logo](/public/logo.svg)

## Description
Raccoon.ai is a web user interface for Ollama that allows you to leverage locally-run artificial intelligence models. This application offers an intuitive user experience for interacting with Large Language Models (LLMs) running on your own machine via Ollama.

### Why 'Raccoon'?
Because raccoons are cuts aren't they?

<img
    src="https://imgs.search.brave.com/HvotVyktUOzyZutGF2h9r4CyvWTTGCk2fLdKSJSrLc4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy84/LzhiL1Byb2N5b25f/bG90b3JfKHJhY2Nv/b24pLmpwZw"
    alt="A cute raccoon"
    width="250px"
/>

## Features

### All Ollama features
- 🚀 Local execution
- 🔒 All data remains local, preventing sensitive information from leaking out
- 🤖 Supports various models such as LLaMA, Mistral, Gemma etc.
- 💻 Multi-platform compatibility: Works on Windows, Mac and Linux
- 🎛️ Resource optimisation: Efficient use of CPU and GPU for improved performance

### Currently present
- 🔄 Streaming support for real-time responses
- 📋 Persistent conversation history
- 🧠 Model selection from those available in your Ollama installation

### Future Plans:
- 📝 Support for Markdown rendering from different AI models
- 🌗 Light, Dark, and System color modes
- 💾 Saving past conversations and navigating through them via a scrollable menu
- 🔄📂 Ability to import and export conversations to, for example, store them on a USB drive and use them on different devices. Ideal for data security.

## Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Ollama](https://ollama.ai/) installed

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
### Communication with Ollama
Raccoon.ai communicates with Ollama via two main API endpoints:

1. **`/api/ollama/models`** - Retrieves the list of available models
   - Method: `GET`
   - Ollama endpoint used: `http://localhost:11434/api/tags`
   - Response: List of models available in your Ollama installation

2. **`/api/ollama`** - Sends requests to models and receives responses
   - Method: `POST`
   - Ollama endpoint used: `http://localhost:11434/api/chat`
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
   - Streaming: Uses Server-Sent Events (SSE) to stream the response in real-time

### Streaming Implementation
The project uses Next.js and browser streaming APIs to provide a real-time experience:

1. The API creates a `TransformStream` on the server side
2. The Ollama response is read progressively in chunks
3. Each fragment is encoded and sent to the client via SSE (Server-Sent Events)
4. The client decodes the events and updates the user interface in real-time

```javascript
// Excerpt from src/app/api/ollama/route.js
const stream = new TransformStream();
const writer = stream.writable.getWriter();
// Background processing
fetchOllamaResponseStreaming(prompt, model, conversation, writer, encoder);
// Returns a response stream
return new Response(stream.readable, {
  headers: { 'Content-Type': 'text/event-stream' }
});
```

## Technologies Used
- **Next.js 15** - React framework
- **React 19** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animations
- **Server-Sent Events** - For response streaming

## Troubleshooting
### Ollama Not Detected
Make sure Ollama is running on `http://localhost:11434`. You can verify by visiting this URL in your browser.

### Models Not Available
If no models appear in the selector, download one via [Ollama](https://ollama.com/search):

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