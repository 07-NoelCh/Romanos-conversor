export default function handler(req, res) {
    try {
        const roman = req.query.roman.toUpperCase();

        if (!/^[MDCLXVI]+$/.test(roman))
            throw new Error("Número romano inválido");

        const val = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
        let total = 0;

        for (let i = 0; i < roman.length; i++) {
            let curr = val[roman[i]];
            let next = val[roman[i + 1]] || 0;

            if (curr < next) {
                total += next - curr;
                i++;
            } else {
                total += curr;
            }
        }

        res.status(200).json({ roman, arabic: total });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
