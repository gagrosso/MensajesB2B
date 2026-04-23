# GenZ Sales Text Studio

Landing + herramienta para generar mensajes comerciales estilo Gen Z, lista para publicar en **GitHub Pages**.

## ¿Qué incluye?

- UI responsive inspirada en una app moderna de generación de textos.
- Formulario para definir oferta, audiencia, objetivo, canal y tono.
- Integración opcional con un **LLM gratuito** vía Hugging Face Inference API.
- Fallback local (sin API) para no bloquear el flujo comercial.
- Framework de propuesta de valor inspirado en TGV / TeGeVe:
  - diagnóstico de negocio,
  - soluciones viables,
  - optimización de costos,
  - ejecución con foco en resultados.

## Ejecutar local

Solo abre `index.html` con Live Server o cualquier servidor estático.

Ejemplo con Python:

```bash
python3 -m http.server 8080
```

Luego entra en `http://localhost:8080`.

## Publicar en GitHub Pages

1. Sube este repositorio a GitHub.
2. Ve a **Settings → Pages**.
3. En **Build and deployment**, selecciona:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (root)
4. Guarda y espera la URL pública.

## Personalización para tu cliente

- Reemplaza textos en `index.html` según tu investigación profunda.
- Ajusta reglas de prompt en `app.js` (`getPrompt`).
- Si quieres otro modelo gratuito, cambia `HF_MODEL`.

## Nota de reverse engineering

Se replicó el enfoque y experiencia de una one-page app de generación de texto:
- hero + propuesta de valor,
- panel de configuración,
- salida inmediata con CTA de copia,
- look & feel moderno para venta digital.

