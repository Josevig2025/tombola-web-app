document.getElementById('upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('file');
  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('https://tombola-backend.onrender.com/analyze', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  document.getElementById('frequent-combinations').innerHTML = 
    '<h3>Más frecuentes:</h3>' + data.frequent.map(c => `<div>${c.combo} - ${c.count}</div>`).join('');
  document.getElementById('delayed-combinations').innerHTML = 
    '<h3>Más atrasadas:</h3>' + data.delayed.map(c => `<div>${c.combo} - ${c.delay} sorteos</div>`).join('');
});
