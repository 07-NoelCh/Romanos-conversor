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
        let endpoint = esRomano(valor)
            ? `/api/r2a?roman=${encodeURIComponent(valor)}`
            : `/api/a2r?arabic=${encodeURIComponent(valor)}`;

        const res = await fetch(endpoint);
        const data = await res.json();

        if (!res.ok || data.error) {
            throw new Error(data.error || 'Error en la conversión');
        }

        // Mostrar resultado basado en el tipo de conversión
        if (esRomano(valor)) {
            resultado.textContent = `${data.roman} = ${data.arabic}`;
        } else {
            resultado.textContent = `${data.arabic} = ${data.roman}`;
        }
    } catch (e) {
        error.textContent = e.message;
        error.classList.add("show");
    }

    loading.classList.remove("show");
}