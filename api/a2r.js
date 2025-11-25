export default function handler(req, res) {
    try {
        const num = parseInt(req.query.arabic);

        if (isNaN(num) || num <= 0 || num > 3999)
            throw new Error("Debe ser un número entre 1 y 3999");

        const table = [
            { v: 1000, r: "M" }, { v: 900, r: "CM" },
            { v: 500, r: "D" }, { v: 400, r: "CD" },
            { v: 100, r: "C" }, { v: 90, r: "XC" },
            { v: 50, r: "L" }, { v: 40, r: "XL" },
            { v: 10, r: "X" }, { v: 9, r: "IX" },
            { v: 5, r: "V" }, { v: 4, r: "IV" },
            { v: 1, r: "I" }
        ];

        let n = num, roman = "";
        for (const t of table) {
            while (n >= t.v) {
                roman += t.r;
                n -= t.v;
            }
        }

        res.status(200).json({ arabic: num, roman });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
