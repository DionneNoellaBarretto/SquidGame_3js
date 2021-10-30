// https://threejs.org/docs/#manual/en/introduction/Creating-a-scene starter code

// black canvas starter code - scenes is what we see
const scene = new THREE.Scene();
// to view the screen using the most basic perspective camera  that takes 4 args (leaving this as default )
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// renderer renders graphics in the canvas
const renderer = new THREE.WebGLRenderer();
// setting the size of the renderer to be the size of my browser window
renderer.setSize( window.innerWidth, window.innerHeight );
// appending dom element to canvas body
document.body.appendChild( renderer.domElement );


// creating a box geometry to create cubes ( the most basic shape) - starter code snippit https://threejs.org/docs/#manual/en/introduction/Creating-a-scene copied over.. in 3 world all shapes are box geometry
const geometry = new THREE.BoxGeometry();
// mesh basic material colors the cube
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// this determines how far from the scene to display / render the camera (the green block will appear bigger if this value is less than 5 and appear smaller if its greater than 5 )

camera.position.z = 5;

// every time you create a shape for your scene renderer needs to be called but manually calling it isn't practical which is why the subsequent block of code is used instead... 
// this calls the renderer to display the green colored cube on our scene/canvas
    // renderer.render( scene,camera );

// dynamically calling the renderer as opposed to manually calling it for each shape as described above^
function animate() {
	
	renderer.render( scene, camera );

// animating the cube by rotating along x/y/z axis and defining a rotation speed! ( 1 is pretty fast hence i slowed it down to 0.01)
// along x axis
// cube.rotation.x +=0.01;
// along y axis
// cube.rotation.y +=0.01;
// z axis
// cube.rotation.x +=0.01;

//  for the image - downloaded a free 3d image from https://sketchfab.com/3d-models/alien-c8da20ee647b4bda8b164d442b13ab4a#download  ( the gltf file is a zipfolder thats been extracted as models in this repository)

// https://threejs.org/docs/?q=glt#examples/en/loaders/GLTFLoader copying over the some portion of the starter code for gltf loading/rendering 
// Instantiate a new gltf loader
const loader = new GLTFLoader();


//  this is whats being called again and again! 
    requestAnimationFrame( animate );

}
animate();