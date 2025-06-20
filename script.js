window.addEventListener('load', async () => {
  const status = document.getElementById('status');
  status.textContent = "Cargando archivo desde GitHub Pages...";

  const githubODS = "https://josevig2025.github.io/tombola-web-app/gpt_tombola.ods";

  try {
    const response = await fetch(githubODS);
    if (!response.ok) throw new Error("No se pudo descargar el archivo desde GitHub Pages");

    const blob = await response.blob();
    const formData = new FormData();
    formData.append('file', blob, 'gpt_tombola.ods');

    status.textContent = "Enviando archivo al servidor...";

    const res = await fetch('https://tombola-backend-rvah.onrender.com/analyze', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error("Error en la respuesta del servidor");

    const data = await res.json();
    status.textContent = "Archivo procesado correctamente ✅";

    const frecuentes = data["5"].frequent;
    const atrasadas = data["5"].delayed;

    document.getElementById('frequent-combinations').innerHTML = 
      '<h3>Más frecuentes (5 números):</h3>' + frecuentes.map(c => `<div>${c.combo.join(", ")} - ${c.count}</div>`).join('');

    document.getElementById('delayed-combinations').innerHTML = 
      '<h3>Más atrasadas (5 números):</h3>' + atrasadas.map(c => `<div>${c.combo.join(", ")} - ${c.delay} sorteos</div>`).join('');

  } catch (error) {
    status.textContent = "⚠️ Error: " + error.message;
    console.error("Error:", error);
  }
});
