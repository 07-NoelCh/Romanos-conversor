function romanToArabic(roman) {
  if (!roman || typeof roman !== 'string') {
    throw new Error('Debe proporcionar un número romano válido');
  }

  const romanUpper = roman.toUpperCase().trim();
  
  if (!/^[IVXLCDM]+$/.test(romanUpper)) {
    throw new Error('El número romano contiene caracteres inválidos');
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

export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 'error',
      message: 'Método no permitido. Use GET'
    });
  }

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
}