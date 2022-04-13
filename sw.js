var cacheName = 'phaser-v1';
var filesToCache = [
  '/',
  '/index.html',
  '/game.js',
  '/phaser.min.js',
  '/settings.js',
  '/rounds.js',


  '/scenes/endGame.js',
  '/scenes/preload.js',
  '/scenes/selectGame.js',
  '/scenes/UI.js',
  '/scenes/startGame.js',

  '/assets/fonts/lato.png',
  '/assets/fonts/lato.xml',

  '/assets/particle.png',
  '/assets/particles.png',


  '/assets/sprites/blank.png',
  '/assets/sprites/blank_2.png',
  '/assets/sprites/ball.png',
  '/assets/sprites/block.png',
  '/assets/sprites/gems.png',
  '/assets/sprites/icons.png',
  '/assets/sprites/panel.png',
  '/assets/sprites/rover.png',
  '/assets/sprites/trajectory_2.png',
  '/assets/sprites/trajectory.png',


  //'https://cdn.jsdelivr.net/gh/photonstorm/phaser@3.10.1/dist/phaser.min.js'
];
self.addEventListener('install', function (event) {
  console.log('sw install');
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('sw caching files');
      return cache.addAll(filesToCache);
    }).catch(function (err) {
      console.log(err);
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('sw fetch');
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }).catch(function (error) {
      console.log(error);
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('sw activate');
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('sw removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});