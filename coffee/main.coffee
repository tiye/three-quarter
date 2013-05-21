
scene = new THREE.Scene
ratio = window.innerWidth / window.innerHeight
camera = new THREE.PerspectiveCamera 75, ratio, 0.1, 1000

renderer = new THREE.WebGLRenderer
renderer.setSize window.innerWidth, window.innerHeight
document.body.appendChild renderer.domElement

geometry = new THREE.CubeGeometry 1, 1, 1
material = new THREE.MeshBasicMaterial color: 0x00ff00
cube = new THREE.Mesh geometry, material
scene.add cube

camera.position.z = 5

do render = ->
  requestAnimationFrame render
  renderer.render scene, camera
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01