

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
//     plugins: [
//       [PhotoSphereViewer.GyroscopePlugin, { absolutePosition: true }]
//     ]
//   });

//   requestGyroscopePermission();

//   document.getElementById('viewer').onclick = () => {
//     viewer.destroy();
//     document.getElementById('viewer').style.display = 'none';
//   };
// }

// function requestGyroscopePermission() {
//   if (typeof DeviceOrientationEvent !== 'undefined' &&
//       typeof DeviceOrientationEvent.requestPermission === 'function') {
//     DeviceOrientationEvent.requestPermission()
//       .then(permissionState => {
//         if (permissionState === 'granted') {
//           console.log('Gyroscope permission granted');
//         } else {
//           alert('Gyroscope permission denied. Tilt control will not work.');
//         }
//       })
//       .catch(console.error);
//   }
// }

// document.getElementById('enable-motion').addEventListener('click', () => {
//   if (typeof DeviceOrientationEvent !== 'undefined' &&
//       typeof DeviceOrientationEvent.requestPermission === 'function') {
//     DeviceOrientationEvent.requestPermission()
//       .then(state => {
//         if (state === 'granted') {
//           alert('Motion control enabled.');
//         } else {
//           alert('Motion control denied.');
//         }
//       })
//       .catch(console.error);
//   }
// });

let viewer;
let motionGranted = false;
let currentImage = '';

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

function handleProductClick(image) {
  currentImage = image;

  if (motionGranted) {
    openViewer(currentImage);
  } else if (
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof DeviceOrientationEvent.requestPermission === 'function'
  ) {
    document.getElementById('enable-motion').style.display = 'block';
    alert('Please enable motion control before viewing.');
  } else {
    // If no permission API (e.g., Android or older iOS)
    openViewer(currentImage);
  }
}

document.getElementById('enable-motion').addEventListener('click', () => {
  DeviceOrientationEvent.requestPermission()
    .then(state => {
      if (state === 'granted') {
        motionGranted = true;
        document.getElementById('enable-motion').style.display = 'none';
        openViewer(currentImage);
      } else {
        alert('Motion control denied.');
      }
    })
    .catch(console.error);
});

function openViewer(image) {
  document.getElementById('viewer').style.display = 'block';

  viewer = new PhotoSphereViewer.Viewer({
  container: document.getElementById('viewer'),
  panorama: image,
  navbar: 'zoom move fullscreen',
  plugins: [
    [PhotoSphereViewer.GyroscopePlugin, {
      touchmove: true,             // allow touch + gyro
      absolutePosition: false     // usually false for smooth behaviour
    }]
  ]
});

  document.getElementById('viewer').onclick = () => {
    viewer.destroy();
    document.getElementById('viewer').style.display = 'none';
  };
}
 const gyroscope = viewer.getPlugin(PhotoSphereViewer.GyroscopePlugin);
  gyroscope.start();  // 👈 activate it!

  document.getElementById('viewer').onclick = () => {
    gyroscope.stop(); // 👈 optional: stop it when closing
    viewer.destroy();
    document.getElementById('viewer').style.display = 'none';
  };
}