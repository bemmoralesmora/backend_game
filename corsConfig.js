// corsConfig.js
const allowedOrigins = [
  "http://127.0.0.1:5501",
  "http://127.0.0.1:5502",
  "http://localhost:5500",
  "",
  "",
];

const corsConfig = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};

module.exports = corsConfig;
