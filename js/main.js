import { openViewer } from './viewer.js';

let motionGranted = false;

// build product list
fetch('all360.txt')
  .then(response => response.text())
  .then(data => {
    const list = document.getElementById('product-list');
    const products = data.trim().split('\n').map(line => {
      const [name, img] = line.split('|');
      return { name, img };
    });

    products.forEach(({ name, img }) => {
      const li = document.createElement('li');
      li.textContent = name;
      li.onclick = () => selectProduct(img);
      list.appendChild(li);
    });

    // check URL param
    const urlParams = new URLSearchParams(window.location.search);
    const selectedImage = urlParams.get('image');
    if (selectedImage) {
      openWithPermission(selectedImage);
    }
  });

function selectProduct(image) {
  const url = new URL(window.location);
  url.searchParams.set('image', image);
  window.history.pushState({}, '', url);

  openWithPermission(image);
}

function openWithPermission(image) {
  if (motionGranted) {
    openViewer(image);
  } else if (
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof DeviceOrientationEvent.requestPermission === 'function'
  ) {
    DeviceOrientationEvent.requestPermission()
      .then(state => {
        if (state === 'granted') {
          motionGranted = true;
          openViewer(image);
        } else {
          alert('Motion control denied.');
        }
      })
      .catch(console.error);
  } else {
    openViewer(image);
  }
}

// optional: handle browser back/forward
window.addEventListener('popstate', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedImage = urlParams.get('image');
  if (selectedImage) {
    openWithPermission(selectedImage);
  } else {
    // close viewer if no image param
    document.getElementById('viewer').style.display = 'none';
  }
});
