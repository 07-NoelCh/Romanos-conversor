const { romanToArabic, arabicToRoman } = require('./server');

describe('🔄 Tests de Conversión Romano → Arábigo', () => {
  
  describe('✅ Casos de éxito', () => {
    test('Debe convertir números romanos básicos', () => {
      expect(romanToArabic('I')).toBe(1);
      expect(romanToArabic('V')).toBe(5);
      expect(romanToArabic('X')).toBe(10);
      expect(romanToArabic('L')).toBe(50);
      expect(romanToArabic('C')).toBe(100);
      expect(romanToArabic('D')).toBe(500);
      expect(romanToArabic('M')).toBe(1000);
    });

    test('Debe manejar números romanos compuestos', () => {
      expect(romanToArabic('II')).toBe(2);
      expect(romanToArabic('III')).toBe(3);
      expect(romanToArabic('VI')).toBe(6);
      expect(romanToArabic('VIII')).toBe(8);
      expect(romanToArabic('XI')).toBe(11);
      expect(romanToArabic('XV')).toBe(15);
      expect(romanToArabic('XX')).toBe(20);
    });

    test('Debe aplicar correctamente la regla de resta', () => {
      expect(romanToArabic('IV')).toBe(4);
      expect(romanToArabic('IX')).toBe(9);
      expect(romanToArabic('XL')).toBe(40);
      expect(romanToArabic('XC')).toBe(90);
      expect(romanToArabic('CD')).toBe(400);
      expect(romanToArabic('CM')).toBe(900);
    });

    test('Debe convertir números romanos complejos', () => {
      expect(romanToArabic('XIV')).toBe(14);
      expect(romanToArabic('XIX')).toBe(19);
      expect(romanToArabic('XLIV')).toBe(44);
      expect(romanToArabic('XCIX')).toBe(99);
      expect(romanToArabic('CDXLIV')).toBe(444);
      expect(romanToArabic('MCMXCIV')).toBe(1994);
      expect(romanToArabic('MMXXIV')).toBe(2024);
    });

    test('Debe manejar minúsculas', () => {
      expect(romanToArabic('xiv')).toBe(14);
      expect(romanToArabic('mcmxciv')).toBe(1994);
      expect(romanToArabic('MmXxIi')).toBe(2022);
    });

    test('Debe manejar espacios', () => {
      expect(romanToArabic('  XIV  ')).toBe(14);
      expect(romanToArabic(' MMXXIV ')).toBe(2024);
    });

    test('Debe convertir el número máximo', () => {
      expect(romanToArabic('MMMCMXCIX')).toBe(3999);
    });
  });

  describe('❌ Casos de error', () => {
    test('Debe rechazar caracteres inválidos', () => {
      expect(() => romanToArabic('ABC')).toThrow('caracteres inválidos');
      expect(() => romanToArabic('XII3')).toThrow('caracteres inválidos');
      expect(() => romanToArabic('X Y')).toThrow('caracteres inválidos');
    });

    test('Debe rechazar entrada vacía', () => {
      expect(() => romanToArabic('')).toThrow('romano válido');
      expect(() => romanToArabic('   ')).toThrow('caracteres inválidos');
    });

    test('Debe rechazar valores null/undefined', () => {
      expect(() => romanToArabic(null)).toThrow('romano válido');
      expect(() => romanToArabic(undefined)).toThrow('romano válido');
    });

    test('Debe rechazar tipos incorrectos', () => {
      expect(() => romanToArabic(123)).toThrow('romano válido');
      expect(() => romanToArabic({})).toThrow('romano válido');
      expect(() => romanToArabic([])).toThrow('romano válido');
    });
  });
});

describe('🔄 Tests de Conversión Arábigo → Romano', () => {
  
  describe('✅ Casos de éxito', () => {
    test('Debe convertir números básicos', () => {
      expect(arabicToRoman(1)).toBe('I');
      expect(arabicToRoman(5)).toBe('V');
      expect(arabicToRoman(10)).toBe('X');
      expect(arabicToRoman(50)).toBe('L');
      expect(arabicToRoman(100)).toBe('C');
      expect(arabicToRoman(500)).toBe('D');
      expect(arabicToRoman(1000)).toBe('M');
    });

    test('Debe convertir números compuestos', () => {
      expect(arabicToRoman(2)).toBe('II');
      expect(arabicToRoman(3)).toBe('III');
      expect(arabicToRoman(6)).toBe('VI');
      expect(arabicToRoman(8)).toBe('VIII');
      expect(arabicToRoman(11)).toBe('XI');
      expect(arabicToRoman(15)).toBe('XV');
      expect(arabicToRoman(20)).toBe('XX');
    });

    test('Debe aplicar correctamente la regla de resta', () => {
      expect(arabicToRoman(4)).toBe('IV');
      expect(arabicToRoman(9)).toBe('IX');
      expect(arabicToRoman(40)).toBe('XL');
      expect(arabicToRoman(90)).toBe('XC');
      expect(arabicToRoman(400)).toBe('CD');
      expect(arabicToRoman(900)).toBe('CM');
    });

    test('Debe convertir números complejos', () => {
      expect(arabicToRoman(14)).toBe('XIV');
      expect(arabicToRoman(19)).toBe('XIX');
      expect(arabicToRoman(44)).toBe('XLIV');
      expect(arabicToRoman(99)).toBe('XCIX');
      expect(arabicToRoman(444)).toBe('CDXLIV');
      expect(arabicToRoman(1994)).toBe('MCMXCIV');
      expect(arabicToRoman(2024)).toBe('MMXXIV');
    });

    test('Debe convertir el número máximo', () => {
      expect(arabicToRoman(3999)).toBe('MMMCMXCIX');
    });

    test('Debe aceptar strings numéricos', () => {
      expect(arabicToRoman('14')).toBe('XIV');
      expect(arabicToRoman('2024')).toBe('MMXXIV');
    });
  });

  describe('❌ Casos de error', () => {
    test('Debe rechazar números fuera de rango', () => {
      expect(() => arabicToRoman(0)).toThrow('entre 1 y 3999');
      expect(() => arabicToRoman(-5)).toThrow('entre 1 y 3999');
      expect(() => arabicToRoman(4000)).toThrow('entre 1 y 3999');
      expect(() => arabicToRoman(10000)).toThrow('entre 1 y 3999');
    });

    test('Debe rechazar valores no numéricos', () => {
      expect(() => arabicToRoman('abc')).toThrow('número válido');
      expect(() => arabicToRoman('XIV')).toThrow('número válido');
    });

    test('Debe rechazar valores null/undefined', () => {
      expect(() => arabicToRoman(null)).toThrow('número válido');
      expect(() => arabicToRoman(undefined)).toThrow('número válido');
    });

    test('Debe rechazar tipos incorrectos', () => {
      expect(() => arabicToRoman({})).toThrow('número válido');
      expect(() => arabicToRoman([])).toThrow('número válido');
    });

    test('Debe rechazar decimales', () => {
      expect(() => arabicToRoman(14.5)).toThrow();
    });
  });
});

describe('🔄 Tests de Conversión Bidireccional', () => {
  test('Debe ser reversible: romano → arábigo → romano', () => {
    const testCases = ['XIV', 'MCMXCIV', 'XLIV', 'XCIX', 'MMXXIV'];
    
    testCases.forEach(roman => {
      const arabic = romanToArabic(roman);
      const backToRoman = arabicToRoman(arabic);
      expect(backToRoman).toBe(roman.toUpperCase());
    });
  });

  test('Debe ser reversible: arábigo → romano → arábigo', () => {
    const testCases = [14, 1994, 44, 99, 2024, 3999];
    
    testCases.forEach(arabic => {
      const roman = arabicToRoman(arabic);
      const backToArabic = romanToArabic(roman);
      expect(backToArabic).toBe(arabic);
    });
  });
});

describe('📊 Tests de Performance', () => {
  test('Debe convertir rápidamente muchos números romanos', () => {
    const start = Date.now();
    
    for (let i = 0; i < 1000; i++) {
      romanToArabic('MCMXCIV');
    }
    
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(100); // menos de 100ms
  });

  test('Debe convertir rápidamente muchos números arábigos', () => {
    const start = Date.now();
    
    for (let i = 1; i <= 1000; i++) {
      arabicToRoman(i);
    }
    
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(200); // menos de 200ms
  });
});

describe('🎯 Tests de Casos Especiales', () => {
  test('Debe manejar el número 1 correctamente', () => {
    expect(arabicToRoman(1)).toBe('I');
    expect(romanToArabic('I')).toBe(1);
  });

  test('Debe manejar números consecutivos', () => {
    for (let i = 1; i <= 100; i++) {
      const roman = arabicToRoman(i);
      expect(romanToArabic(roman)).toBe(i);
    }
  });

  test('Debe manejar números con múltiples Ms', () => {
    expect(arabicToRoman(3000)).toBe('MMM');
    expect(romanToArabic('MMM')).toBe(3000);
  });

  test('Debe manejar años comunes', () => {
    expect(arabicToRoman(2023)).toBe('MMXXIII');
    expect(arabicToRoman(2024)).toBe('MMXXIV');
    expect(arabicToRoman(2025)).toBe('MMXXV');
    expect(romanToArabic('MMXXIII')).toBe(2023);
    expect(romanToArabic('MMXXIV')).toBe(2024);
    expect(romanToArabic('MMXXV')).toBe(2025);
  });

  test('Debe manejar números con todas las reglas de resta', () => {
    expect(arabicToRoman(1444)).toBe('MCDXLIV');
    expect(romanToArabic('MCDXLIV')).toBe(1444);
  });

  test('Debe manejar el número más complejo', () => {
    expect(arabicToRoman(3888)).toBe('MMMDCCCLXXXVIII');
    expect(romanToArabic('MMMDCCCLXXXVIII')).toBe(3888);
  });
});

describe('🔍 Tests de Validación de Entrada', () => {
  test('Debe validar caracteres romanos correctamente', () => {
    // Válidos
    expect(() => romanToArabic('I')).not.toThrow();
    expect(() => romanToArabic('IVXLCDM')).not.toThrow();
    
    // Inválidos
    expect(() => romanToArabic('ABCD')).toThrow();
    expect(() => romanToArabic('123')).toThrow();
    expect(() => romanToArabic('I2V')).toThrow();
  });

  test('Debe validar rangos numéricos correctamente', () => {
    // Válidos
    expect(() => arabicToRoman(1)).not.toThrow();
    expect(() => arabicToRoman(3999)).not.toThrow();
    
    // Inválidos
    expect(() => arabicToRoman(0)).toThrow();
    expect(() => arabicToRoman(4000)).toThrow();
    expect(() => arabicToRoman(-1)).toThrow();
  });
});