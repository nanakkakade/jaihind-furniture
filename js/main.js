
// fetch('all360.txt')
//   .then(response => response.text())
//   .then(data => {
//     const list = document.getElementById('product-list');
//     data.trim().split('\n').forEach(line => {
//       const [name, img] = line.split('|');
//       const li = document.createElement('li');
//       li.textContent = name;
//       li.onclick = () => openViewer(img);
//       list.appendChild(li);
//     });
//   });

// let viewer;
// function openViewer(image) {
//   document.getElementById('viewer').style.display = 'block';
//   viewer = new PhotoSphereViewer.Viewer({
//     container: document.getElementById('viewer'),
//     panorama: image,
//     navbar: 'zoom move fullscreen',
//     defaultLong: Math.PI,
//     useXmpData: false,
//     touchmoveTwoFingers: false,
//     mousewheel: false,
//     plugins: [PhotoSphereViewer.GyroscopePlugin]
//   });
//   document.getElementById('viewer').onclick = () => {
//     viewer.destroy();
//     document.getElementById('viewer').style.display = 'none';
//   };
// }


fetch('all360.txt')
  .then(response => response.text())
  .then(data => {
    const list = document.getElementById('product-list');
    data.trim().split('\n').forEach(line => {
      const [name, img] = line.split('|');
      const li = document.createElement('li');
      li.textContent = name;
      li.onclick = () => openViewer(img);
      list.appendChild(li);
    });
  });

let viewer;

function openViewer(image) {
  document.getElementById('viewer').style.display = 'block';

  viewer = new PhotoSphereViewer.Viewer({
    container: document.getElementById('viewer'),
    panorama: image,
    navbar: 'zoom move fullscreen',
    defaultLong: Math.PI,
    useXmpData: false,
    touchmoveTwoFingers: false,
    mousewheel: false,
    plugins: [
      [PhotoSphereViewer.GyroscopePlugin, { absolutePosition: true }]
    ]
  });

  requestGyroscopePermission();

  document.getElementById('viewer').onclick = () => {
    viewer.destroy();
    document.getElementById('viewer').style.display = 'none';
  };
}

function requestGyroscopePermission() {
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          console.log('Gyroscope permission granted');
        } else {
          alert('Gyroscope permission denied. Tilt control will not work.');
        }
      })
      .catch(console.error);
  }
}
