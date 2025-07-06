// corsConfig.js
const allowedOrigins = [
  "http://127.0.0.1:5501",
  "http://localhost:3000",
  "https://tu-frontend-en-render.com",
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
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200, // Para navegadores antiguos
};
