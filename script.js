
document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('product-list');
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const closeBtn = document.getElementById('close');

  fetch('all360.txt')
    .then(res => res.text())
    .then(text => {
      const lines = text.trim().split('\n');
      lines.forEach(line => {
        const [name, img] = line.split('|');
        const div = document.createElement('div');
        div.className = 'card';
        div.textContent = name;
        div.addEventListener('click', () => {
          modalImg.src = img;
          modal.style.display = 'flex';
        });
        listEl.appendChild(div);
      });
    });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target == modal) modal.style.display = 'none';
  });
});
