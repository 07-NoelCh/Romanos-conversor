const express = require('express');
const cors = require('cors');
const app = express();

// Configuración de CORS para permitir todas las solicitudes
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsear JSON
app.use(express.json());

/**
 * Función que convierte números arábigos a romanos.
 */
function arabicToRoman(num) {
    // Validación de rango
    if (num <= 0 || num > 3999) {
        throw new Error('El número debe estar entre 1 y 3999');
    }

    const tabla = [
        { val: 1000, rom: 'M' },
        { val: 900, rom: 'CM' },
        { val: 500, rom: 'D' },
        { val: 400, rom: 'CD' },
        { val: 100, rom: 'C' },
        { val: 90, rom: 'XC' },
        { val: 50, rom: 'L' },
        { val: 40, rom: 'XL' },
        { val: 10, rom: 'X' },
        { val: 9, rom: 'IX' },
        { val: 5, rom: 'V' },
        { val: 4, rom: 'IV' },
        { val: 1, rom: 'I' },
    ];

    let n = num;
    let res = '';
    for (const { val, rom } of tabla) {
        while (n >= val) {
            res += rom;
            n -= val;
        }
    }
    return res;
}

/**
 * Función que convierte números romanos a arábigos.
 */
function romanToArabic(romano) {
    const valores = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
    let total = 0;
    const s = romano.toUpperCase();
    
    // Validar que solo contenga caracteres romanos válidos
    if (!/^[IVXLCDM]+$/.test(s)) {
        throw new Error('El número romano contiene caracteres inválidos');
    }

    for (let i = 0; i < s.length; i++) {
        const actual = valores[s[i]];
        const siguiente = i + 1 < s.length ? valores[s[i+1]] : 0;
        if (actual < siguiente) {
            total += (siguiente - actual);
            i++;
        } else {
            total += actual;
        }
    }
    return total;
}

/**
 * 🔗 RUTA RAÍZ - Info de la API
 */
app.get('/', (req, res) => {
    res.status(200).json({
        message: "API de Conversión de Números Romanos y Arábigos",
        version: "1.0.0",
        status: "active",
        endpoints: {
            "Romano a Arábigo": "/r2a?roman=IV",
            "Arábigo a Romano": "/a2r?arabic=4"
        },
        ejemplos: [
            "GET /r2a?roman=MMXXIV → Convierte romano a arábigo",
            "GET /a2r?arabic=2025 → Convierte arábigo a romano"
        ]
    });
});

/**
 * 🔗 ENDPOINT 1: Romano a Arábigo (R2A)
 * Ejemplo: /r2a?roman=IV -> { "roman": "IV", "arabic": 4 }
 */
app.get('/r2a', (req, res) => {
    try {
        const roman = req.query.roman;
        
        // Validaciones
        if (!roman) {
            return res.status(400).json({
                error: "BadRequest",
                message: "El parámetro 'roman' es requerido"
            });
        }

        if (typeof roman !== 'string') {
            return res.status(400).json({
                error: "BadRequest",
                message: "El parámetro 'roman' debe ser una cadena de texto"
            });
        }

        const arabic = romanToArabic(roman);

        return res.status(200).json({
            roman: roman.toUpperCase(),
            arabic: arabic
        });
    } catch (error) {
        return res.status(400).json({
            error: "ConversionError",
            message: error.message || "Error al convertir número romano"
        });
    }
});

/**
 * 🔗 ENDPOINT 2: Arábigo a Romano (A2R)
 * Ejemplo: /a2r?arabic=4 -> { "arabic": 4, "roman": "IV" }
 */
app.get('/a2r', (req, res) => {
    try {
        const arabicParam = req.query.arabic;
        
        // Validaciones
        if (!arabicParam) {
            return res.status(400).json({
                error: "BadRequest",
                message: "El parámetro 'arabic' es requerido"
            });
        }

        const arabic = parseInt(arabicParam, 10);
        
        if (isNaN(arabic)) {
            return res.status(400).json({
                error: "BadRequest",
                message: "El parámetro 'arabic' debe ser un número válido"
            });
        }

        const roman = arabicToRoman(arabic);

        return res.status(200).json({
            arabic: arabic,
            roman: roman
        });
    } catch (error) {
        return res.status(400).json({
            error: "ConversionError",
            message: error.message || "Error al convertir número arábigo"
        });
    }
});

/**
 * Manejo de rutas no encontradas
 */
app.use((req, res) => {
    res.status(404).json({
        error: "NotFound",
        message: "Ruta no encontrada. Consulta los endpoints disponibles en la raíz (/)"
    });
});

/**
 * Middleware global para manejo de errores
 */
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: "InternalServerError",
        message: "Ocurrió un error inesperado en el servidor"
    });
});

/**
 * Solo para desarrollo local
 */
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`✅ Servidor activo en puerto ${PORT}`);
        console.log(`📍 http://localhost:${PORT}`);
    });
}

/**
 * Exportar app para Vercel
 */
module.exports = app;