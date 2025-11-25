# 🔥 API REST para Transformación de Números Romanos y Arábigos

## 📖 Descripción del Proyecto
Este proyecto consiste en una **API RESTful** desarrollada con **Node.js** y **Express** que permite la conversión entre:

- 🔁 **Números Romanos → Decimales (Arábigos)**
- 🔁 **Decimales (Arábigos) → Números Romanos**

El proyecto cumple con todos los requerimientos solicitados en la actividad académica, incluyendo:

- ✔ Traducción confiable entre ambos sistemas
- ✔ API con rutas claras y validadas
- ✔ **Protocolos HTTP (GET y POST)** ← NUEVO
- ✔ **Validación robusta con códigos de estado HTTP** ← NUEVO
- ✔ Pruebas unitarias con **Jest**
- ✔ **Frontend interactivo incluido** ← NUEVO
- ✔ Preparación para despliegue en **Vercel**

---

## ✅ Requisitos de la Actividad Alcanzados

| Requisito | Estado |
|-----------|--------|
| Crear un traductor de Romano a Decimal | ✅ Implementado (`romanToArabic`) |
| Crear un traductor de Decimal a Romano | ✅ Implementado (`arabicToRoman`) |
| API compatible con el formato del profesor | ✅ Rutas `/api/r2a` y `/api/a2r` |
| Protocolo HTTP GET | ✅ Implementado con query params |
| Protocolo HTTP POST | ✅ Implementado con JSON body |
| Incluir Pruebas Unitarias | ✅ Probado con **Jest** (40+ tests) |
| Publicación en Vercel | 🚀 Preparado para deploy |

---

## 💻 Tecnologías Utilizadas

- 🟢 **Node.js** v14+
- 🌀 **Express** v4.19
- 🧪 **Jest** v29.7 (Testing)
- ▲ **Vercel** (Hosting Serverless)
- 🎨 **HTML5/CSS3/JavaScript** (Frontend)

---

## 🔗 Rutas de la API

### 1️⃣ Romano → Decimal (R2A)

**Método GET:**
- **Ruta:** `/api/r2a?roman=VALOR_ROMANO`
- **Ejemplo:** `/api/r2a?roman=XIV`
- **Respuesta:**
```json