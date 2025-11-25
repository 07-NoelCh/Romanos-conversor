const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// ==========================================
// MIDDLEWARES
// ==========================================

// CORS configurado correctamente
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parser de JSON para peticiones POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static('public'));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ==========================================
// FUNCIONES DE CONVERSIÓN
// ==========================================

/**
 * Convierte número romano a arábigo
 * @param {string} roman - Número romano (ej: "XIV")
 * @returns {number} - Número arábigo
 * @throws {Error} - Si el formato es inválido
 */
function romanToArabic(roman) {
  if (!roman || typeof roman !== 'string') {
    throw new Error('Debe proporcionar un número romano válido');
  }

  const romanUpper = roman.toUpperCase().trim();
  
  // Validar caracteres permitidos
  if (!/^[IVXLCDM]+$/.test(romanUpper)) {
    throw new Error('El número romano contiene caracteres inválidos');
  }

  const valores = {
    'I': 1,
    'V': 5,
    'X': 10,
    'L': 50,
    'C': 100,
    'D': 500,
    'M': 1000
  };

  let total = 0;
  
  for (let i = 0; i < romanUpper.length; i++) {
    const actual = valores[romanUpper[i]];
    const siguiente = valores[romanUpper[i + 1]];

    // Regla de resta: si el valor actual es menor al siguiente
    if (siguiente && actual < siguiente) {
      total -= actual;
    } else {
      total += actual;
    }
  }

  // Validar rango
  if (total < 1 || total > 3999) {
    throw new Error('El número romano debe estar entre I (1) y MMMCMXCIX (3999)');
  }

  return total;
}

/**
 * Convierte número arábigo a romano
 * @param {number} num - Número arábigo (1-3999)
 * @returns {string} - Número romano
 * @throws {Error} - Si el número está fuera de rango
 */
function arabicToRoman(num) {
  const numero = parseInt(num);

  if (isNaN(numero)) {
    throw new Error('Debe proporcionar un número válido');
  }

  if (numero < 1 || numero > 3999) {
    throw new Error('El número debe estar entre 1 y 3999');
  }

  const conversiones = [
    { valor: 1000, simbolo: 'M' },
    { valor: 900, simbolo: 'CM' },
    { valor: 500, simbolo: 'D' },
    { valor: 400, simbolo: 'CD' },
    { valor: 100, simbolo: 'C' },
    { valor: 90, simbolo: 'XC' },
    { valor: 50, simbolo: 'L' },
    { valor: 40, simbolo: 'XL' },
    { valor: 10, simbolo: 'X' },
    { valor: 9, simbolo: 'IX' },
    { valor: 5, simbolo: 'V' },
    { valor: 4, simbolo: 'IV' },
    { valor: 1, simbolo: 'I' }
  ];

  let resultado = '';
  let restante = numero;

  for (const { valor, simbolo } of conversiones) {
    while (restante >= valor) {
      resultado += simbolo;
      restante -= valor;
    }
  }

  return resultado;
}

// ==========================================
// RUTAS HTTP - GET
// ==========================================

/**
 * GET /api/r2a - Romano a Arábigo
 * Query params: ?roman=XIV
 * Response: { roman: "XIV", arabic: 14, status: "success" }
 */
app.get('/api/r2a', (req, res) => {
  try {
    const { roman } = req.query;

    if (!roman) {
      return res.status(400).json({
        status: 'error',
        message: 'Parámetro "roman" es requerido',
        example: '/api/r2a?roman=XIV'
      });
    }

    const arabicResult = romanToArabic(roman);

    res.status(200).json({
      status: 'success',
      input: roman.toUpperCase(),
      roman: roman.toUpperCase(),
      arabic: arabicResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
      input: req.query.roman
    });
  }
});

/**
 * GET /api/a2r - Arábigo a Romano
 * Query params: ?arabic=14
 * Response: { arabic: 14, roman: "XIV", status: "success" }
 */
app.get('/api/a2r', (req, res) => {
  try {
    const { arabic } = req.query;

    if (!arabic) {
      return res.status(400).json({
        status: 'error',
        message: 'Parámetro "arabic" es requerido',
        example: '/api/a2r?arabic=14'
      });
    }

    const romanResult = arabicToRoman(arabic);

    res.status(200).json({
      status: 'success',
      input: parseInt(arabic),
      arabic: parseInt(arabic),
      roman: romanResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
      input: req.query.arabic
    });
  }
});

// ==========================================
// RUTAS HTTP - POST
// ==========================================

/**
 * POST /api/convert
 * Body: { "value": "XIV" } o { "value": 14 }
 * Response: Conversión automática según el tipo
 */
app.post('/api/convert', (req, res) => {
  try {
    const { value } = req.body;

    if (value === undefined || value === null || value === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Campo "value" es requerido',
        example: { value: 'XIV' }
      });
    }

    // Detectar si es romano o arábigo
    const esRomano = typeof value === 'string' && /^[IVXLCDM]+$/i.test(value);

    if (esRomano) {
      const arabicResult = romanToArabic(value);
      return res.status(200).json({
        status: 'success',
        conversion: 'roman_to_arabic',
        input: value.toUpperCase(),
        roman: value.toUpperCase(),
        arabic: arabicResult,
        timestamp: new Date().toISOString()
      });
    } else {
      const romanResult = arabicToRoman(value);
      return res.status(200).json({
        status: 'success',
        conversion: 'arabic_to_roman',
        input: parseInt(value),
        arabic: parseInt(value),
        roman: romanResult,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
      input: req.body.value
    });
  }
});

/**
 * POST /api/batch
 * Body: { "values": ["XIV", 14, "IX", 100] }
 * Response: Array de conversiones
 */
app.post('/api/batch', (req, res) => {
  try {
    const { values } = req.body;

    if (!Array.isArray(values) || values.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Campo "values" debe ser un array no vacío',
        example: { values: ['XIV', 14, 'IX'] }
      });
    }

    const resultados = values.map(value => {
      try {
        const esRomano = typeof value === 'string' && /^[IVXLCDM]+$/i.test(value);
        
        if (esRomano) {
          const arabic = romanToArabic(value);
          return {
            status: 'success',
            input: value.toUpperCase(),
            roman: value.toUpperCase(),
            arabic
          };
        } else {
          const roman = arabicToRoman(value);
          return {
            status: 'success',
            input: parseInt(value),
            arabic: parseInt(value),
            roman
          };
        }
      } catch (error) {
        return {
          status: 'error',
          input: value,
          message: error.message
        };
      }
    });

    res.status(200).json({
      status: 'success',
      total: values.length,
      results: resultados,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// ==========================================
// RUTA DE DOCUMENTACIÓN
// ==========================================

app.get('/api', (req, res) => {
  res.status(200).json({
    name: 'API de Conversión Romano ↔ Arábigo',
    version: '2.0.0',
    endpoints: {
      'GET /api/r2a': {
        description: 'Convierte número romano a arábigo',
        params: { roman: 'Número romano (ej: XIV)' },
        example: '/api/r2a?roman=XIV'
      },
      'GET /api/a2r': {
        description: 'Convierte número arábigo a romano',
        params: { arabic: 'Número del 1 al 3999 (ej: 14)' },
        example: '/api/a2r?arabic=14'
      },
      'POST /api/convert': {
        description: 'Conversión automática según el tipo',
        body: { value: 'Número romano o arábigo' },
        example: { value: 'XIV' }
      },
      'POST /api/batch': {
        description: 'Conversión de múltiples valores',
        body: { values: 'Array de números' },
        example: { values: ['XIV', 14, 'IX', 100] }
      }
    },
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// MANEJO DE ERRORES 404
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint no encontrado',
    path: req.url,
    availableEndpoints: ['/api', '/api/r2a', '/api/a2r', '/api/convert', '/api/batch']
  });
});

// ==========================================
// EXPORTAR Y SERVIDOR
// ==========================================

// Exportar funciones para testing
module.exports = { app, romanToArabic, arabicToRoman };

// Servidor local
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('🚀 Servidor iniciado exitosamente');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📚 Documentación: http://localhost:${PORT}/api`);
    console.log(`\n🔗 Endpoints disponibles:`);
    console.log(`   GET  /api/r2a?roman=XIV`);
    console.log(`   GET  /api/a2r?arabic=14`);
    console.log(`   POST /api/convert`);
    console.log(`   POST /api/batch\n`);
  });
}