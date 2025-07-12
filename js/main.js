

// let viewer;
// let motionGranted = false;
// let currentImage = '';

// fetch('all360.txt')
//   .then(response => response.text())
//   .then(data => {
//     const list = document.getElementById('product-list');
//     data.trim().split('\n').forEach(line => {
//       const [name, img] = line.split('|');
//       const li = document.createElement('li');
//       li.textContent = name;
//       li.onclick = () => handleProductClick(img);
//       list.appendChild(li);
//     });
//   });

// function handleProductClick(image) {
//   currentImage = image;

//   if (motionGranted) {
//     openViewer(currentImage);
//   } else if (
//     typeof DeviceOrientationEvent !== 'undefined' &&
//     typeof DeviceOrientationEvent.requestPermission === 'function'
//   ) {
//     document.getElementById('enable-motion').style.display = 'block';
//     alert('Please enable motion control before viewing.');
//   } else {
//     // If no permission API (e.g., Android or older iOS)
//     openViewer(currentImage);
//   }
// }

// document.getElementById('enable-motion').addEventListener('click', () => {
//   DeviceOrientationEvent.requestPermission()
//     .then(state => {
//       if (state === 'granted') {
//         motionGranted = true;
//         document.getElementById('enable-motion').style.display = 'none';
//         openViewer(currentImage);
//       } else {
//         alert('Motion control denied.');
//       }
//     })
//     .catch(console.error);
// });

// function openViewer(image) {
//   document.getElementById('viewer').style.display = 'block';

//   viewer = new PhotoSphereViewer.Viewer({
//     container: document.getElementById('viewer'),
//     panorama: image,
//     navbar: 'zoom move fullscreen',
//     plugins: [
//       [PhotoSphereViewer.GyroscopePlugin, {
//         touchmove: true
//       }]
//     ]
//   });

//   viewer.once('ready', () => {
//     const gyro = viewer.getPlugin(PhotoSphereViewer.GyroscopePlugin);
//     if (gyro) {
//       gyro.start();
//       console.log('Gyroscope started');
//     } else {
//       console.error('GyroscopePlugin not found!');
//     }
//   });

//   document.getElementById('viewer').onclick = () => {
//     const gyro = viewer.getPlugin(PhotoSphereViewer.GyroscopePlugin);
//     if (gyro) gyro.stop();
//     viewer.destroy();
//     document.getElementById('viewer').style.display = 'none';
//   };
// }


// window.addEventListener('deviceorientation', e => {
//   if (viewer) {
//     const lon = e.alpha || 0;
//     const lat = e.beta || 0;
//     viewer.rotate({
//       longitude: THREE.MathUtils.degToRad(lon),
//       latitude: THREE.MathUtils.degToRad(lat)
//     });
//   }
// });



//2.0


let marzipanoViewer = null;
let currentScene = null;

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

function openViewer(image) {
  document.getElementById('viewer').style.display = 'block';

  if (!marzipanoViewer) {
    marzipanoViewer = new Marzipano.Viewer(document.getElementById('viewer'));
  }

  // Clean up old scene
  if (currentScene) {
    currentScene.destroy();
  }

  const source = Marzipano.ImageUrlSource.fromString(image);
  const geometry = new Marzipano.EquirectGeometry([{ width: 4096 }]);
  const limiter = Marzipano.RectilinearView.limit.traditional(1024, 120 * Math.PI / 180);
  const view = new Marzipano.RectilinearView(null, limiter);

  currentScene = marzipanoViewer.createScene({
    source: source,
    geometry: geometry,
    view: view,
  });

  currentScene.switchTo();

  // Enable gyroscope
  view.enableMovement();
}