let viewer;
let motionGranted = false;
let currentImage = '';

// Fetch and build product list
fetch('all360.txt')
  .then(response => response.text())
  .then(data => {
    const list = document.getElementById('product-list');
    data.trim().split('\n').forEach(line => {
      const [name, img] = line.split('|');
      const li = document.createElement('li');
      li.textContent = name;
      li.onclick = () => handleProductClick(img);
      list.appendChild(li);
    });
  });

// Handle product click
function handleProductClick(image) {
  currentImage = image;

  if (motionGranted) {
    openViewer(currentImage);
  } else if (
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof DeviceOrientationEvent.requestPermission === 'function'
  ) {
    DeviceOrientationEvent.requestPermission()
      .then(state => {
        if (state === 'granted') {
          motionGranted = true;
          openViewer(currentImage);
        } else {
          alert('Motion control denied.');
        }
      })
      .catch(console.error);
  } else {
    // If no permission API (e.g., Android or older iOS)
    openViewer(currentImage);
  }
}

// Open the 360 viewer
function openViewer(image) {
  document.getElementById('viewer').style.display = 'block';

  viewer = new PhotoSphereViewer.Viewer({
    container: document.getElementById('viewer'),
    panorama: image,
    navbar: 'zoom move fullscreen',
    plugins: [
      [PhotoSphereViewer.GyroscopePlugin, {
        touchmove: true
      }]
    ]
  });

  viewer.once('ready', () => {
    viewer.rotate({ longitude: 0, latitude: 0 });
    viewer.zoom(90);

    const gyro = viewer.getPlugin(PhotoSphereViewer.GyroscopePlugin);
    if (gyro) {
      gyro.start();
      console.log('Gyroscope started');

      // Restart gyro after zoom events
      viewer.on('zoom-updated', () => {
        gyro.stop();
        gyro.start();
        console.log('Gyroscope restarted after zoom');
      });
    } else {
      console.error('GyroscopePlugin not found!');
    }
  });

  // Close viewer on click
  document.getElementById('viewer').onclick = () => {
    const gyro = viewer.getPlugin(PhotoSphereViewer.GyroscopePlugin);
    if (gyro) gyro.stop();

    viewer.destroy();
    document.getElementById('viewer').style.display = 'none';
  };
}
