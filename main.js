import * as THREE from 'three';
import { getAverageHex, generateRandomIntBetween } from './utils';
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// scale canvas to fit screen
renderer.domElement.style.position = "absolute"
renderer.domElement.style.top = 0
renderer.domElement.style.bottom = 0
renderer.domElement.style.right = 0
renderer.domElement.style.left = 0

// make scene where objects will be added
var scene = new THREE.Scene();


// setup cam
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
camera.position.z = 10;


// make badge obj with its properties
function Badge(r1, r2, h, imageURL, themeColor) {
  let geometry = new THREE.CylinderGeometry(r1, r2, h, 6);
  var textureLoader = new THREE.TextureLoader();
  var materials = [
    new THREE.MeshBasicMaterial({
      color: themeColor,
      wireframe: true,
    }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(imageURL) }),
    new THREE.MeshBasicMaterial({ color: themeColor }),
  ];

  var cylinder = new THREE.Mesh(geometry, materials);
  cylinder.rotationDirection = Math.round(Math.random()) * 2 - 1
  cylinder.rotationSpeed=(Math.random()*4/1000)+0.001
  return cylinder
}


// make stars
const stars = []
for (let i = 0; i < 200; i++) {
  let sphereGeom = new THREE.SphereGeometry(0.05)
  let material = new THREE.MeshBasicMaterial({ color: 0xfcfc4e })
  let sphere = new THREE.Mesh(sphereGeom, material)
  stars.push(sphere)
  scene.add(sphere)
  sphere.position.setX(generateRandomIntBetween(20))
  sphere.position.setY(generateRandomIntBetween(10))
  sphere.position.setZ(-Math.random() * 40)
}


// make list of bagdes
const badges = []
for (let i = 1; i < 20; i++) {
  getAverageHex(`logos/${i}.jpg`).then((hx) => {
    console.log(hx)
    let cylinder = new Badge(1, 1.25, 0.25, `logos/${i}.jpg`, parseInt(hx, 16))
    cylinder.position.setX(generateRandomIntBetween(15))
    cylinder.position.setY(generateRandomIntBetween(9))
    cylinder.position.setZ(Math.random() * -40)
    cylinder.rotation.x=90

    scene.add(cylinder);
    badges.push(cylinder)
  })
}


// move in 3d space made by changing cam position
addEventListener("keydown", (e) => {
  if (e.key == "w") {
  camera.position.z-=0.2;
  } else if (e.key == "s") {
    camera.position.z+=0.2;
  } 
  // else if (e.key == "ArrowUp") {
  // } else if (e.key == "ArrowDown") {
  // } else if (e.key == "ArrowRight") {
  // } else if (e.key == "ArrowLeft") { }
})



// kinda like game loop
renderer.setAnimationLoop((time) => {
  if (badges.length == 0) { return }

  for (const badge of badges) {
    badge.rotation.x += badge.rotationSpeed * badge.rotationDirection;
    badge.rotation.y += badge.rotationSpeed * badge.rotationDirection;
  }


  let multiplier = 1
  stars.forEach(star => {
    star.position.setX(star.position.x + Math.random() * 0.002 * multiplier)
    star.position.setY(star.position.y + Math.random() * 0.003 * multiplier)
    if (Math.abs(star.position.x) > 25 || Math.abs(star.position.y) > 15) {
      multiplier = -multiplier
    }
  })
  renderer.render(scene, camera);
});