
# somting
console.log "loaded"

scene = new THREE.Scene
ratio = window.innerWidth / window.innerHeight
camera = new THREE.PerspectiveCamera 45, ratio, 0.1, 500
camera.position.set 0, 0, 100
camera.lookAt (new THREE.Vector3 0, 0, 0)

renderer = new THREE.WebGLRenderer
renderer.setSize window.innerWidth, window.innerHeight
document.body.appendChild renderer.domElement

geometry = new THREE.CubeGeometry
geometry.vertices.push (new THREE.Vector3 -10, 0, 0)
geometry.vertices.push (new THREE.Vector3 0, 10, 0)
geometry.vertices.push (new THREE.Vector3 10, 0, 0)
material = new THREE.LineBasicMaterial color: 0x0000ff
line = new THREE.Line geometry, material
scene.add line

renderer.render scene, camera