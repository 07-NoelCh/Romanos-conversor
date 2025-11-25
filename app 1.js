const express = require('express');
const cors = require('cors');
const app = express();

// 🔒 Lista de dominios permitidos
const whitelist = ['https://tusitio.com', 'https://otraapp.com']; // ajustá con tus dominios reales
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};

// ✅ Activar CORS antes de las rutas
app.use(cors(corsOptions));

// 👉 Middleware para parsear JSON si lo necesitás
app.use(express.json());

// 🟢 Ruta Romano → Decimal
app.get('/r2a', (req, res) => {
  const roman = req.query.roman;
  if (!roman) {
    return res.status(400).json({ error: 'Falta parámetro roman' });
  }
  const result = romanToArabic(roman);
  res.json({ romano: roman, decimal: result });
});

// 🟣 Ruta Decimal → Romano
app.get('/a2r', (req, res) => {
  const arabic = parseInt(req.query.arabic, 10);
  if (isNaN(arabic)) {
    return res.status(400).json({ error: 'Falta parámetro arabic válido' });
  }
  const result = arabicToRoman(arabic);
  res.json({ decimal: arabic, romano: result });
});

// 🚀 Exportar para Vercel
module.exports = app;

// 🔧 Funciones de conversión
function romanToArabic(roman) {
  const map = {I:1, V:5, X:10, L:50, C:100, D:500, M:1000};
  let value = 0;
  for (let i = 0; i < roman.length; i++) {
    const current = map[roman[i]];
    const next = map[roman[i+1]];
    if (next && current < next) {
      value -= current;
    } else {
      value += current;
    }
  }
  return value;
}

function arabicToRoman(num) {
  const map = [
    { value: 1000, numeral: 'M' },
    { value: 900, numeral: 'CM' },
    { value: 500, numeral: 'D' },
    { value: 400, numeral: 'CD' },
    { value: 100, numeral: 'C' },
    { value: 90, numeral: 'XC' },
    { value: 50, numeral: 'L' },
    { value: 40, numeral: 'XL' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' }
  ];
  let result = '';
  for (const { value, numeral } of map) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result;
}
