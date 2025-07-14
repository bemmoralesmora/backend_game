// corsConfig.js
const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5501",
  "http://127.0.0.1:5502",
  "http://localhost:3000",
  "https://samuelsarazua.github.io",
  "https://samuelsarazua.github.io/Puzzle_Playground",
  "https://samuelsarazua.github.io/Puzzle_Playground/",
  "https://puzzle-playground.vercel.app",
  "https://puzzle-playground.vercel.app/",
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("🌐 Origin recibido:", origin);

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ Origin no permitido:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-User-Id"],
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = {
  allowedOrigins,
  corsOptions,
};
