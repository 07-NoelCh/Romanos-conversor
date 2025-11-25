const express = require('express');
const cors = require('cors');
const app = express();

// Configuración de CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

/**
 * ================================
 *   FUNCIÓN: Arábigo → Romano
 * ================================
 */
function arabicToRoman(num) {
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
        { val: 1, rom: 'I' }
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
 * ================================
 *   FUNCIÓN: Romano → Arábigo
 * ================================
 */
function romanToArabic(romano) {
    const valores = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
    const s = romano.toUpperCase();
    let total = 0;

    if (!/^[IVXLCDM]+$/.test(s)) {
        throw new Error('El número romano contiene caracteres inválidos');
    }

    for (let i = 0; i < s.length; i++) {
        const actual = valores[s[i]];
        const siguiente = i + 1 < s.length ? valores[s[i + 1]] : 0;

        if (actual < siguiente) {
            total += siguiente - actual;
            i++;
        } else {
            total += actual;
        }
    }

    return total;
}

/**
 * ================================
 *        RUTA PRINCIPAL
 * ================================
 */
app.get('/', (req, res) => {
    res.status(200).json({
        message: "API de Conversión de Números Romanos y Arábigos",
        version: "1.0.0",
        status: "active",
        endpoints: {
            "Romano a Arábigo": "/r2a?roman=IV",
            "Arábigo a Romano": "/a2r?arabic=4"
        }
    });
});

/**
 * ================================
 *  ENDPOINT: Romano → Arábigo
 * ================================
 */
app.get('/r2a', (req, res) => {
    try {
        const roman = req.query.roman;

        if (!roman) {
            return res.status(400).json({
                error: "BadRequest",
                message: "El parámetro 'roman' es requerido"
            });
        }

        const arabic = romanToArabic(roman);

        return res.status(200).json({
            roman: roman.toUpperCase(),
            arabic
        });

    } catch (error) {
        return res.status(400).json({
            error: "ConversionError",
            message: error.message
        });
    }
});

/**
 * ================================
 *  ENDPOINT: Arábigo → Romano
 * ================================
 */
app.get('/a2r', (req, res) => {
    try {
        const arabicParam = req.query.arabic;

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
            arabic,
            roman
        });

    } catch (error) {
        return res.status(400).json({
            error: "ConversionError",
            message: error.message
        });
    }
});

/**
 * ================================
 *        404 Not Found
 * ================================
 */
app.use((req, res) => {
    res.status(404).json({
        error: "NotFound",
        message: "Ruta no encontrada"
    });
});

/**
 * ================================
 *  Middleware global de errores
 * ================================
 */
app.use((err, req, res, next) => {
    console.error('Error interno:', err);
    res.status(500).json({
        error: "InternalServerError",
        message: "Ocurrió un error inesperado"
    });
});

/**
 * ================================
 *   Servidor local (solo desarrollo)
 * ================================
 */
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor activo en http://localhost:${PORT}`);
    });
}

/**
 * ================================
 *   EXPORTS PARA JEST (IMPORTANTE)
 * ================================
 */
module.exports.romanToArabic = romanToArabic;
module.exports.arabicToRoman = arabicToRoman;

/**
 * Exportar la app para Vercel
 */
module.exports = app;