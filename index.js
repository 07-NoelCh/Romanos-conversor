// Importa las funciones desde app 1.js
const { romanToArabic, arabicToRoman } = require('./app 1.js');

// Exporta SOLO las funciones para Jest
module.exports = {
    romanToArabic,
    arabicToRoman
};