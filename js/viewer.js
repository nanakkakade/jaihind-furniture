let viewer;

export function openViewer(image) {
  document.getElementById('viewer').style.display = 'block';

  viewer = new PhotoSphereViewer.Viewer({
    container: document.getElementById('viewer'),
    panorama: image,
    navbar: 'zoom move fullscreen',
    plugins: [
      [PhotoSphereViewer.GyroscopePlugin, { touchmove: true }]
    ]
  });

  viewer.once('ready', () => {
    viewer.rotate({ longitude: 0, latitude: 0 });
    viewer.zoom(90);

    const gyro = viewer.getPlugin(PhotoSphereViewer.GyroscopePlugin);
    if (gyro) {
      gyro.start();
      viewer.on('zoom-updated', () => {
        gyro.stop();
        gyro.start();
      });
    }
  });

  document.getElementById('viewer').onclick = closeViewer;
}

export function closeViewer() {
  if (viewer) {
    const gyro = viewer.getPlugin(PhotoSphereViewer.GyroscopePlugin);
    if (gyro) gyro.stop();
    viewer.destroy();
    document.getElementById('viewer').style.display = 'none';
  }
}
