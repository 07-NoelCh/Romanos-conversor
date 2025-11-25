const API_URL = "";

// Detectar si es romano
function esRomano(txt) {
    return /^[MDCLXVI]+$/i.test(txt);
}

async function convertir() {
    const valor = document.getElementById("valor").value.trim();
    const resultado = document.getElementById("resultado");
    const error = document.getElementById("error");
    const loading = document.getElementById("loading");

    error.classList.remove("show");
    resultado.textContent = "";

    if (!valor) {
        error.textContent = "Ingrese un valor";
        error.classList.add("show");
        return;
    }

    loading.classList.add("show");

    try {
        let endpoint =
            esRomano(valor)
                ? `/api/r2a?roman=${valor}`
                : `/api/a2r?arabic=${valor}`;

        const res = await fetch(endpoint);
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        resultado.textContent = esRomano(valor)
            ? `${data.roman} = ${data.arabic}`
            : `${data.arabic} = ${data.roman}`;
    } catch (e) {
        error.textContent = e.message;
        error.classList.add("show");
    }

    loading.classList.remove("show");
}
