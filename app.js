const form = document.querySelector('#prompt-form');
const output = document.querySelector('#output');
const statusEl = document.querySelector('#status');
const copyBtn = document.querySelector('#copy-btn');

const HF_MODEL = 'HuggingFaceTB/SmolLM3-3B';

const getPrompt = ({ product, audience, goal, tone, channel, cta, context }) => `
Eres un SDR senior experto en comunicación Gen Z para servicios B2B tecnológicos.
Escribe exactamente 3 mensajes en español listos para enviar por ${channel}.

Datos:
- Oferta: ${product}
- Perfil del lead: ${audience}
- Objetivo: ${goal}
- Tono: ${tone}
- CTA preferido: ${cta || 'Invitar a una llamada breve'}
- Contexto de negocio: ${context || 'No provisto'}

Reglas:
1) Máximo 75 palabras por mensaje.
2) Sonar humano, directo y no agresivo.
3) Enfatizar valor tangible: entender negocio, optimizar costos y ejecutar soluciones viables.
4) Evitar emojis excesivos (máximo 1 por mensaje).
5) Entregar en formato:
Versión 1:\n...\n\nVersión 2:\n...\n\nVersión 3:\n...
`;

const localFallback = ({ product, audience, goal, tone, channel, cta }) => {
  const opener = {
    cercano: 'Te escribo rápido porque creo que hay un fit real',
    consultivo: 'Viendo tu contexto, detecté una oportunidad concreta',
    directo: 'Voy directo: hay una forma de mejorar tus resultados',
  }[tone];

  return `Versión 1:\n${opener} en ${channel}. Ayudamos a equipos como ${audience} a mejorar ${product} con foco en eficiencia y costo total. Si te sirve, te comparto un mini diagnóstico de 10 minutos sin compromiso. ${cta || '¿Te va mejor martes o jueves?'}\n\nVersión 2:\nHola, vi que en roles como ${audience} suele haber fricción entre velocidad y calidad. Nosotros trabajamos con enfoque práctico: entendemos el proceso actual, priorizamos quick wins y ejecutamos mejoras medibles en ${product}. ¿Abrimos una llamada corta para validar si aplica a tu caso?\n\nVersión 3:\nTe propongo algo simple: en una charla breve revisamos tu objetivo (${goal}) y te muestro 2-3 acciones viables para acelerar resultados en ${product}. Si no ves valor, no avanzamos. ${cta || '¿Te funciona esta semana?'} `;
};

const generateWithHuggingFace = async (token, prompt) => {
  const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 420,
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Hugging Face respondió ${response.status}`);
  }

  const data = await response.json();
  if (Array.isArray(data) && data[0]?.generated_text) {
    const fullText = data[0].generated_text;
    return fullText.slice(prompt.length).trim() || fullText.trim();
  }

  throw new Error('No se pudo parsear respuesta del modelo.');
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  statusEl.textContent = 'Generando mensajes...';
  output.textContent = '';

  const values = Object.fromEntries(new FormData(form).entries());
  const prompt = getPrompt(values);

  try {
    if (values.hfToken?.trim()) {
      localStorage.setItem('hf_token', values.hfToken.trim());
      const text = await generateWithHuggingFace(values.hfToken.trim(), prompt);
      output.textContent = text;
      statusEl.textContent = 'Listo. Resultado generado con LLM gratuito (Hugging Face).';
      return;
    }

    output.textContent = localFallback(values);
    statusEl.textContent = 'Listo. Resultado generado con modo local (sin API).';
  } catch (error) {
    output.textContent = localFallback(values);
    statusEl.textContent = `No se pudo usar el LLM (${error.message}). Se mostró un fallback local.`;
  }
});

copyBtn.addEventListener('click', async () => {
  if (!output.textContent.trim()) {
    statusEl.textContent = 'No hay texto para copiar todavía.';
    return;
  }

  await navigator.clipboard.writeText(output.textContent);
  statusEl.textContent = 'Resultado copiado al portapapeles.';
});

window.addEventListener('DOMContentLoaded', () => {
  const rememberedToken = localStorage.getItem('hf_token');
  if (rememberedToken) {
    form.elements.hfToken.value = rememberedToken;
  }
});
