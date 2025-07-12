// corsConfig.js
const allowedOrigins = [
  "*",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5501",
  "http://127.0.0.1:5502",
  "http://localhost:3000",
  "https://samuelsarazua.github.io",
  "https://samuelsarazua.github.io/Puzzle_Playground/",
];

module.exports = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como apps móviles o curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-User-Id"],
  credentials: true,
  optionsSuccessStatus: 200, // Para navegadores antiguos
};
