
# somting
console.log "loaded"

width = 1200
height = 640

scene = new THREE.Scene
ratio = width / height
camera = new THREE.PerspectiveCamera 45, ratio, 0.1, 500
camera.position.set 0, 0, 200
camera.lookAt (new THREE.Vector3 0, 0, 0)

renderer = new THREE.WebGLRenderer
renderer.setSize width, height
canvas = renderer.domElement
document.body.appendChild canvas

canvas.setAttribute "width", "#{width}px"
canvas.setAttribute "height", "#{height}px"

geometry = new THREE.CubeGeometry

paint_point = (a) ->
  geometry.vertices.push (new THREE.Vector3 a.x, a.y, a.z)

test = require "./test"
polyline = test.test()
polyline.forEach paint_point

material = new THREE.LineBasicMaterial color: 0x8888ff, linewidth: 2
line = new THREE.Line geometry, material
scene.add line

do render = ->
  requestAnimationFrame render
  # setTimeout render, 100
  renderer.render scene, camera
  # camera.rotation.x += 0.01
  line.rotation.y += 0.01
  # console.log "render"