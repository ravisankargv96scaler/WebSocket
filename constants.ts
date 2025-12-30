import { QuizQuestion } from './types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Which HTTP status code is used for the WebSocket handshake?",
    options: ["200 OK", "101 Switching Protocols", "404 Not Found", "301 Moved Permanently"],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "Is WebSocket communication Half-duplex or Full-duplex?",
    options: ["Half-duplex (One at a time)", "Full-duplex (Simultaneous)", "Simplex (One way only)", "It depends on the browser"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "Does the WebSocket connection close after one message?",
    options: ["Yes, to save bandwidth", "No, it remains persistent", "Only if the server gets tired", "Yes, unless you pay extra"],
    correctAnswer: 1,
  },
];

export const SAMPLE_CODE = `const WebSocket = require('ws');

// Create a server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  console.log('Client connected');

  // Listen for messages
  ws.on('message', msg => {
    // Echo back to client
    ws.send(\`Echo: \${msg}\`);
  });
});`;