
# somting
console.log "loaded"

width = 1300
height = 700

scene = new THREE.Scene
ratio = width / height
camera = new THREE.PerspectiveCamera 45, ratio, 0.1, 800
camera.position.set 0, 0, 400
camera.lookAt (new THREE.Vector3 0, 0, 0)

renderer = new THREE.WebGLRenderer
renderer.setSize width, height
canvas = renderer.domElement
document.body.appendChild canvas

canvas.setAttribute "width", "#{width}px"
canvas.setAttribute "height", "#{height}px"

geometry = new THREE.Geometry

paint_point = (a) ->
  geometry.vertices.push (new THREE.Vector3 a.x, a.y, a.z)

test = require "./test.coffee"
polyline = test.test_line()
polyline.forEach paint_point

material = new THREE.LineBasicMaterial color: 0x000022, linewidth: 4
line = new THREE.Line geometry, material
scene.add line

delay = (t, f) -> setTimeout f, t

do render = ->
  delay 10, ->
    requestAnimationFrame render
  renderer.render scene, camera
  line.rotation.y += 0.007
  # line.rotation.z += 0.001