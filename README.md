# Raccoon.ai [![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

![Raccoon.ai Logo](/public/logo.svg)

## Description
Raccoon.ai is a web user interface for Ollama that allows you to leverage locally-run artificial intelligence models. This application offers an intuitive user experience for interacting with Large Language Models (LLMs) running on your own machine via Ollama.

### Why 'Raccoon'?
Because raccoons are cuts aren't they?

<img
   src="https://cdn.futura-sciences.com/cdn-cgi/image/width=1024,quality=50,format=auto/sources/images/alexander-raton-laveur.jpeg"
   alt="A cute raccoon"
   width="400px"
/>
<img
   src="https://img.lovepik.com/photo/60161/1744.jpg_wh860.jpg"
   alt="A cute raccoon"
   width="400px"
/>

## features (non-exhaustive list)

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

### Future Plans
#### v1.0.0-beta
- 📝 Support for Markdown rendering from different AI models
- 🌗 Light, Dark, and System color modes
#### v1.0.0
- 💾 Saving past conversations and navigating through them via a scrollable menu
- 📋 Possibility of copying and pasting ia answers and having them regenerated if the answer was not conclusive.
#### v1.1.0
- 📥 Choosing how to use Raccoon.ai
   - 📍 Solution 1 (current)
      Download the project locally using GitHub (see "installation" section)
   - 🛜 Solution 2 (future) (simpler solution but needs internet)
      Using the hosted website (no data leaves your computer)
- 🔄 Ability to import and export conversations to, for example, store them on a USB drive and use them on different devices. Ideal for data security.
- 📂 Import files in conversations like images or pdf (only for multimodal models like [Gemma 3](https://ollama.com/library/gemma3))
#### v1.2.0
- 📱 Optimization of the interface for mobile use
- Maybe
   - 🔗 APIs integration for closed models

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