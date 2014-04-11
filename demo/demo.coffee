
container = undefined
stats = undefined
camera = undefined
controls = undefined
scene = undefined
renderer = undefined
objects = []
plane = undefined

mouse = new THREE.Vector2()
offset = new THREE.Vector3()
INTERSECTED = undefined
SELECTED = undefined

init()
animate()

init = ->

  container = document.createElement 'div'
  document.body.appendChild container

  camera = new THREE.PerspectiveCamera 70, window.innerWidth / window.innerHeight, 1, 10000
  camera.position.z = 1000

  controls = new THREE.TrackballControls camera
  controls.rotateSpeed = 1.0
  controls.zoomSpeed = 1.2
  controls.panSpeed = 0.8
  controls.noZoom = false
  controls.noPan = false
  controls.staticMoving = true
  controls.dynamicDampingFactor = 0.3

  scene = new THREE.Scene
  
  scene.add (new THREE.AmbientLight 0x505050 )

  light = new THREE.SpotLight 0xffffff, 1.5
  light.position.set 0, 500, 2000
  scene.add light

  geometry = new THREE.BoxGeometry 40, 40, 40

  for i in [0...6]

    object = new THREE.Mesh geometry,
      new THREE.MeshLambertMaterial color: (Math.random() * 0xffffff)

    object.material.ambient = object.material.color

    object.position.x = Math.random() * 1000 - 500
    object.position.y = Math.random() * 600 - 300
    object.position.z = Math.random() * 800 - 400

    object.rotation.x = Math.random() * 2 * Math.PI
    object.rotation.y = Math.random() * 2 * Math.PI
    object.rotation.z = Math.random() * 2 * Math.PI

    object.scale.x = Math.random() * 2 + 1
    object.scale.y = Math.random() * 2 + 1
    object.scale.z = Math.random() * 2 + 1

    object.castShadow = true
    object.receiveShadow = true

    scene.add object

    objects.push object

  plane = new THREE.Mesh
    new THREE.PlaneGeometry 2000, 2000, 8, 8
    new THREE.MeshBasicMaterial color: 0x000000, opacity: 0.25, transparent: true, wireframe: true
  plane.visible = false
  scene.add plane


  renderer = new THREE.WebGLRenderer antialias: true
  renderer.setClearColor 0xf0f0f0
  renderer.setSize window.innerWidth, window.innerHeight
  renderer.sortObjects = false

  renderer.shadowMapEnabled = true
  renderer.shadowMapType = THREE.PCFShadowMap

  container.appendChild renderer.domElement

  renderer.domElement.addEventListener 'mousemove', onDocumentMouseMove, false
  renderer.domElement.addEventListener 'mousedown', onDocumentMouseDown, false
  renderer.domElement.addEventListener 'mouseup', onDocumentMouseUp, false

  window.addEventListener 'resize', onWindowResize, false

onWindowResize = ->

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize window.innerWidth, window.innerHeight

onDocumentMouseMove = (event) ->

  event.preventDefault();

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  vector = new THREE.Vector3 mouse.x, mouse.y, 0.5

  raycaster = new THREE.Raycaster camera.position, vector.sub(camera.position).normalize()


  if SELECTED?
    intersects = raycaster.intersectObject plane
    SELECTED.position.copy intersects[0].point.sub(offset)
    return

  intersects = raycaster.intersectObjects objects

  if intersects.length > 0
    if INTERSECTED != intersects[0].object

      if INTERSECTED? then INTERSECTED.material.color.setHex INTERSECTED.currentHex

      INTERSECTED = intersects[0].object
      INTERSECTED.currentHex = INTERSECTED.material.color.getHex()

      plane.position.copy INTERSECTED.position
      plane.lookAt camera.position

    container.style.cursor = 'pointer'
  else
    if INTERSECTED? then INTERSECTED.material.color.setHex INTERSECTED.currentHex
    INTERSECTED = null
    container.style.cursor = 'auto'

onDocumentMouseDown = (event) ->
  event.preventDefault()
  vector = new THREE.Vector3 mouse.x, mouse.y, 0.5
  raycaster = new THREE.Raycaster camera.position, vector.sub(camera.position).normalize()
  intersects = raycaster.intersectObjects objects
  if intersects.length > 0
    controls.enabled = false
    SELECTED = intersects[0].object
    intersects = raycaster.intersectObject plane
    offset.copy(intersects[0].point).sub plane.position
    container.style.cursor = 'move'

onDocumentMouseUp = (event) ->
  event.preventDefault()
  controls.enabled = true
  if INTERSECTED?
    plane.position.copy INTERSECTED.position
    SELECTED = null
  container.style.cursor = 'auto'

animate = ->
  requestAnimationFrame animate
  controls.update()
  renderer.render scene, camera

