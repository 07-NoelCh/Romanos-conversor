function romanToArabic(roman) {
  if (!roman || typeof roman !== 'string') {
    throw new Error('Debe proporcionar un número romano válido');
  }

  const romanUpper = roman.toUpperCase().trim();
  
  // Validar caracteres permitidos
  if (!/^[IVXLCDM]+$/.test(romanUpper)) {
    throw new Error('El número romano contiene caracteres inválidos');
  }

  // Validación estricta: verificar que sea un número romano válido
  // Reglas de formación correcta de números romanos
  const validPattern = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
  
  if (!validPattern.test(romanUpper)) {
    throw new Error('El número romano tiene un formato inválido (orden o combinación incorrecta)');
  }

  const valores = {
    'I': 1, 'V': 5, 'X': 10, 'L': 50,
    'C': 100, 'D': 500, 'M': 1000
  };

  let total = 0;
  
  for (let i = 0; i < romanUpper.length; i++) {
    const actual = valores[romanUpper[i]];
    const siguiente = valores[romanUpper[i + 1]];

    if (siguiente && actual < siguiente) {
      total -= actual;
    } else {
      total += actual;
    }
  }

  if (total < 1 || total > 3999) {
    throw new Error('El número romano debe estar entre I (1) y MMMCMXCIX (3999)');
  }

  return total;
}
function arabicToRoman(num) {
  // Validar que sea un string numérico o número
  const numStr = String(num).trim();
  
  // Verificar que solo contenga dígitos
  if (!/^\d+$/.test(numStr)) {
    throw new Error('Debe proporcionar un número válido (solo dígitos)');
  }

  const numero = parseInt(numStr, 10);

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

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      status: 'error',
      message: 'Método no permitido. Use POST'
    });
  }

  try {
    const { value } = req.body;

    if (value === undefined || value === null || value === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Campo "value" es requerido',
        example: { value: 'XIV' }
      });
    }

    const esRomano = typeof value === 'string' && /^[IVXLCDM]+$/i.test(value);

    let result;
    if (esRomano) {
      const arabic = romanToArabic(value);
      result = {
        status: 'success',
        conversion: 'roman_to_arabic',
        input: value.toUpperCase(),
        roman: value.toUpperCase(),
        arabic
      };
    } else {
      const roman = arabicToRoman(value);
      result = {
        status: 'success',
        conversion: 'arabic_to_roman',
        input: parseInt(value),
        arabic: parseInt(value),
        roman
      };
    }

    result.timestamp = new Date().toISOString();
    res.status(200).json(result);

  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
      input: req.body.value
    });
  }
}