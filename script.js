window.addEventListener('load', async () => {
  const status = document.getElementById('status');
  status.textContent = "📥 Cargando archivo planilla-tombola.csv desde GitHub...";

  const githubCSV = "https://raw.githubusercontent.com/Josevig2025/tombola-web-app/main/planilla-tombola.csv";

  try {
    const response = await fetch(githubCSV);
    if (!response.ok) throw new Error("❌ No se pudo descargar el archivo desde GitHub");

    const blob = await response.blob();
    const formData = new FormData();
    formData.append('file', blob, 'planilla-tombola.csv');

    status.textContent = "📡 Enviando archivo al servidor...";

    const res = await fetch('https://tombola-backend-rvah.onrender.com/analyze', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error("❌ Error en la respuesta del servidor");

    const data = await res.json();
    status.textContent = "✅ Archivo procesado correctamente";

    // Mostrar resultados (3, 4 y 5 números)
    ['3', '4', '5'].forEach(n => {
      if (data[n]) {
        const section = document.createElement('section');
        section.innerHTML = `
          <h3>🔢 Combinaciones de ${n} números:</h3>
          <strong>Más frecuentes:</strong>
          ${data[n].frequent.map(c => `<div>${c.combo.join(', ')} → ${c.count} veces</div>`).join('')}
          <br><strong>Más atrasadas:</strong>
          ${data[n].delayed.map(c => `<div>${c.combo.join(', ')} → ${c.delay} sorteos</div>`).join('')}
        `;
        document.getElementById('results').appendChild(section);
      }
    });

  } catch (error) {
    status.textContent = "⚠️ Error: " + error.message;
    console.error("Error:", error);
  }
});
