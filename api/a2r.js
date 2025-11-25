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
}