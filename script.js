window.addEventListener('load', async () => {
  const status = document.getElementById('status');
  status.textContent = "Cargando archivo desde GitHub...";

  const githubODS = "https://raw.githubusercontent.com/Josevig2025/tombola-web-app/main/gpt_tombola.ods";

  try {
    const response = await fetch(githubODS);
    if (!response.ok) throw new Error("No se pudo descargar el archivo desde GitHub");

    const blob = await response.blob();
    const formData = new FormData();
    formData.append('file', blob, 'gpt_tombola.ods');

    status.textContent = "Enviando archivo al servidor...";

    const res = await fetch('https://tombola-backend.onrender.com/analyze', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error("Error en la respuesta del servidor");

    const data = await res.json();
    status.textContent = "Archivo procesado correctamente ✅";

    document.getElementById('frequent-combinations').innerHTML = 
      '<h3>Más frecuentes:</h3>' + data.frequent.map(c => `<div>${c.combo} - ${c.count}</div>`).join('');

    document.getElementById('delayed-combinations').innerHTML = 
      '<h3>Más atrasadas:</h3>' + data.delayed.map(c => `<div>${c.combo} - ${c.delay} sorteos</div>`).join('');

  } catch (error) {
    status.textContent = "⚠️ Error: " + error.message;
    console.error("Error:", error);
  }
});
