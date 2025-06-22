window.addEventListener('load', async () => {
  const status = document.getElementById('status');
  status.textContent = "Cargando CSV desde GitHub Pages...";

  const githubCSV = "https://josevig2025.github.io/tombola-web-app/planilla-tombola.csv";

  try {
    const response = await fetch(githubCSV);
    if (!response.ok) throw new Error("No se pudo descargar el archivo desde GitHub Pages");

    const text = await response.text();
    const lines = text.trim().split("\n");
    const data = lines.map(line =>
      line.split(",").map(s => s.trim()).filter(x => x.length).map(Number)
    );

    status.textContent = "Enviando CSV al servidor...";

    const formData = new FormData();
    const blob = new Blob([text], { type: "text/csv" });
    formData.append('file', blob, 'planilla-tombola.csv');

    const res = await fetch('https://tombola-backend-rvah.onrender.com/analyze', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error("Error en la respuesta del servidor");

    const resp = await res.json();
    status.textContent = "Archivo procesado correctamente ✅";

    const frecuentes = resp["5"].frequent;
    const atrasadas = resp["5"].delayed;

    document.getElementById('frequent-combinations').innerHTML = 
      '<h3>Más frecuentes (5 números):</h3>' + frecuentes.map(c => `<div>${c.combo.join(", ")} - ${c.count}</div>`).join('');

    document.getElementById('delayed-combinations').innerHTML = 
      '<h3>Más atrasadas (5 números):</h3>' + atrasadas.map(c => `<div>${c.combo.join(", ")} - ${c.delay} sorteos</div>`).join('');

  } catch (error) {
    status.textContent = "⚠️ Error: " + error.message;
    console.error("Error:", error);
  }
});
