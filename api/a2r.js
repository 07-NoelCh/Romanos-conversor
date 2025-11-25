export default function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { arabic } = req.query;

    if (!arabic || isNaN(arabic)) {
        return res.status(400).json({
            error: "Parámetro 'arabic' inválido"
        });
    }

    const num = parseInt(arabic);

    if (num <= 0 || num > 3999) {
        return res.status(400).json({
            error: "El número debe estar entre 1 y 3999"
        });
    }

    const tabla = [
        { v: 1000, r: "M" }, { v: 900, r: "CM" },
        { v: 500, r: "D" }, { v: 400, r: "CD" },
        { v: 100, r: "C" }, { v: 90, r: "XC" },
        { v: 50, r: "L" }, { v: 40, r: "XL" },
        { v: 10, r: "X" }, { v: 9, r: "IX" },
        { v: 5, r: "V" }, { v: 4, r: "IV" },
        { v: 1, r: "I" }
    ];

    let n = num;
    let resRoman = "";

    for (const e of tabla) {
        while (n >= e.v) {
            resRoman += e.r;
            n -= e.v;
        }
    }

    res.status(200).json({ 
        arabic: num,
        roman: resRoman 
    });
}