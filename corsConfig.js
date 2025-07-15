const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5501",
  "http://127.0.0.1:5502",
  "http://localhost:3000",
  "https://puzzle-playground.vercel.app",
  "https://puzzle-playground.vercel.app/",
  "https://bemmoralesmora.github.io/Puzzle_Playground",
  "https://bemmoralesmora.github.io/Puzzle_Playground/",
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-User-Id"],
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
