window.addEventListener('load', async () => {
  const googleDriveUrl = "https://drive.google.com/uc?export=download&id=1Q3Q8DynraA8_0cFDLbhe5h5l6lrHS1llQ9R1q1eyl3M";

  try {
    const response = await fetch(googleDriveUrl);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append('file', blob, 'gpt_tombola.ods');

    const res = await fetch('https://tombola-backend.onrender.com/analyze', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();

    document.getElementById('frequent-combinations').innerHTML = 
      '<h3>Más frecuentes:</h3>' + data.frequent.map(c => `<div>${c.combo} - ${c.count}</div>`).join('');

    document.getElementById('delayed-combinations').innerHTML = 
      '<h3>Más atrasadas:</h3>' + data.delayed.map(c => `<div>${c.combo} - ${c.delay} sorteos</div>`).join('');

  } catch (error) {
    console.error("Error al cargar el archivo desde Google Drive:", error);
  }
});
