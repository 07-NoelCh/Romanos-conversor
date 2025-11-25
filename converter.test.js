const { romanToArabic, arabicToRoman } = require('./index'); // O './converter'

describe('romanToArabic (R2A) Tests', () => {

    // 1. Casos de éxito
    test('Debe convertir números romanos simples correctamente', () => {
        expect(romanToArabic('I')).toBe(1);
        expect(romanToArabic('V')).toBe(5);
        expect(romanToArabic('X')).toBe(10);
    });

    test('Debe manejar lógica de resta correctamente', () => {
        expect(romanToArabic('IV')).toBe(4);
        expect(romanToArabic('IX')).toBe(9);
        expect(romanToArabic('XIX')).toBe(19);
        expect(romanToArabic('MCMXCIV')).toBe(1994);
    });

    test('Debe funcionar con minúsculas', () => {
        expect(romanToArabic('xiv')).toBe(14);
    });

    // 2. Casos de error según tu backend
    test('Debe lanzar Error si la entrada contiene símbolos inválidos', () => {
        expect(() => romanToArabic('IIA')).toThrow('El número romano contiene caracteres inválidos');
    });

    test('Debe lanzar Error si la cadena está vacía', () => {
        expect(() => romanToArabic('')).toThrow('El número romano contiene caracteres inválidos');
    });
});

describe('arabicToRoman (A2R) Tests', () => {

    // 1. Casos de éxito
    test('Debe convertir números arábigos simples correctamente', () => {
        expect(arabicToRoman(1)).toBe('I');
        expect(arabicToRoman(10)).toBe('X');
        expect(arabicToRoman(100))
