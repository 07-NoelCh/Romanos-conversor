export default function handler(req, res) {
    const { roman } = req.query;

    if (!roman || !/^[IVXLCDM]+$/i.test(roman)) {
        return res.status(400).json({
            error: "Parámetro 'roman' inválido"
        });
    }

    const val = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
    const s = roman.toUpperCase();
    let total = 0;

    for (let i = 0; i < s.length; i++) {
        const actual = val[s[i]];
        const siguiente = val[s[i + 1]] || 0;

        if (actual < siguiente) {
            total += siguiente - actual;
            i++;
        } else {
            total += actual;
        }
    }

    res.status(200).json({ arabic: total });
}
