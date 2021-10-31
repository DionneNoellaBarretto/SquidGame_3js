// https://threejs.org/docs/#manual/en/introduction/Creating-a-scene starter code
// black canvas starter code - scenes is what we see
const scene = new THREE.Scene();
// to view the screen using the most basic perspective camera  that takes 4 args fov,aspect,near and far - (leaving this as default )
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// renderer renders graphics in the canvas
const renderer = new THREE.WebGLRenderer();
// setting the size of the renderer to be the size of my browser window
renderer.setSize(window.innerWidth, window.innerHeight);
// appending dom element to canvas body
document.body.appendChild(renderer.domElement);

// this changes the background color from black to this (0xb7c3f3) lilac blue tone & 1 denotes the full opacity of the color
renderer.setClearColor(0xb7c3f3, 1);

// ( see loader.load section below) of all the lights possible setting ambient light : https://threejs.org/docs/?q=light#api/en/lights/AmbientLight starter code
// this 404040 is the color of the light in js ; replacing it with ffffff for bright rendition!
const light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);


// this determines how far from the scene to display / render the camera (the green block will appear bigger if this value is less than 5 and appear smaller if its greater than 5 )

camera.position.z = 5;
// every time you create a shape for your scene renderer needs to be called but manually calling it isn't practical which is why the subsequent block of code is used instead...
// this calls the renderer to display the green colored cube on our scene/canvas
// renderer.render(scene, camera);
// renderer.setClearColor( 0xB7C3F3, 1 );

//  for the image - downloaded a free 3d image from (doesn't work)https://sketchfab.com/3d-models/alien-c8da20ee647b4bda8b164d442b13ab4a#download likewise the squid game doll image (works -https://sketchfab.com/3d-models/squid-game-doll-ccfed977f35446a7914a3abc5e393182) ( the gltf file is a zipfolder thats been extracted as models in this repository)
// giant doll - works: https://sketchfab.com/3d-models/squid-game-giant-doll-6f9049e47c4e4e7cb3e6dcf9535d46fa#download
// doesn't work https://sketchfab.com/3d-models/squidward-spongebob-7b493d23a7d941639b92cb162c175611#download - squidward 3d image
// https://threejs.org/docs/?q=glt#examples/en/loaders/GLTFLoader copying over the some portion of the starter code for gltf loading/rendering
// Instantiate a new gltf loader
// adding THREE. since we did not import this using npm i but rather manually!
const loader = new THREE.GLTFLoader();

//global variable declaration
const startPosition = -5; //this is minus since its on the left of the x-axis
const endPosition = -startPosition; //this is -ve of -5 i.t +5 on the x-axis meaning the right
// const playerPosition = startPosition -0.4;
const text = document.querySelector(".text");
const balls = document.querySelector(".balls");
const TIME_LIMIT = 10;
let gameStat = "Loading";
let isLookingAtPlayer = true;


//  the movement of the cube thats being resized per its geometry : https://threejs.org/docs/?q=box#api/en/geometries/BoxGeometry
function createCube(size, positionX, rotationY = 0, color = 0xfbc851) {
  // creating a box geometry to create cubes ( the most basic shape) - starter code snippit https://threejs.org/docs/#manual/en/introduction/Creating-a-scene copied over.. in 3 world all shapes are box geometry
  // size.w,h,d are the arguments being passed when the create cube function is called below!
  const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
  // mesh basic material colors the cube
  const material = new THREE.MeshBasicMaterial({ color: color });
  const cube = new THREE.Mesh(geometry, material);

  cube.position.x = positionX;
  cube.rotation.y = rotationY;

  scene.add(cube);
  // shows the cube at the positions defined..
  return cube;
}


// doll class to call methods within it
class Doll {
  // this wont show up without the let doll declaration
  constructor() {
    // calling the function to load our alien/doll glTF resource with a callback function
    // since we are in the js folder hence appending ../ before models to move up a directory
    // not using function (gltf) since we are using this.doll here hence converted it to a arrow function!
    loader.load("./models/scene.gltf", (gltf) => {
      scene.add(gltf.scene);      // this wont render as is if no light is present! (see light section above after the document.body element)
      doll = gltf.scene;
      // sizing adjustment with 3 dimensions x/y/z axis
      // this is a static size which can cause problems with responsiveness..
      gltf.scene.scale.set(0.4, 0.4, 0.4);

      // to move the doll image to the center of the page as opposed to right up top by playing with the z axis ( +1 moves it higher, -1 moves it lower!):
      gltf.scene.position.set(0, -1, 4);
      this.doll = gltf.scene;
    });
  }


  // turning the doll to show her back towards us using y axis rotation
backOfDoll(){
    // this.doll.rotation.y =-3.2;
    // every .45 second rotating the doll through to her position
    gsap.to(this.doll.rotation, { y: -3.2, duration: 0.35 });
    setTimeout(() => isLookingAtPlayer = true, 100);
  }

  // turning back the doll to the front position using y axis rotation
frontOfDoll() {
    // this.doll.rotation.y =0;
    // every .45 second rotating the doll through to her position facing forward
    gsap.to(this.doll.rotation, { y: 0, duration: 0.35 });
    setTimeout(() => isLookingAtPlayer = false, 350);
  }
  

 // https://greensock.com/gsap/ animation for gradually maneuvering the doll from front facing to back facing and back to front facing!

  // recursive function of the doll ( starts the dolls rotation)
  async start() {
    //   calls the back state of the doll
    this.backOfDoll();
    // await delay(1000);  1 sec intervals
    // making it challenging with a random interval between (0-1000 +1000)
    await delay(Math.random() * 1000 + 1000);
    this.frontOfDoll();
    // await delay(1000);
    await delay(Math.random() * 750 + 750);

    this.start();
  }
}

// creating a track for the movement of the person
function createTrack() {
  // center cube is the largest hence placing it as the first cube
  createCube(
    //   width height and depth of the cube panels
    { w: startPosition * 2, h: 1.3, d: 1 },
    0,
    0,
    //color of the middle track panel
    0xe5a716
  ).position.z = -0.9;

  // right side placement
  createCube({ w: 0.2, h: 1.3, d: 1 }, startPosition, -0.35);
  // left side placement
  createCube({ w: 0.2, h: 1.3, d: 1 }, endPosition, 0.35);
}
createTrack();

class Player {
  constructor() {
    // creating a player using po as a character https://sketchfab.com/juleg
    // loader.load("./po_model/scene.gltf", (gltf) => {
    //       scene.add(gltf.scene);
    //       gltf.scene.scale.set(0.9, 0.9, 0.5);
    //       gltf.scene.position.x = playerPosition;  //set(11, -5.3, -7);
    //       this.player = gltf.scene;
    //       this.playerInfo ={
    //           positionX: playerPosition,
    //         //   speed when 0 po wont move
    //           velocity: 0
    //       }
    //     });

    //sphere geometry (player representation) https://threejs.org/docs/?q=sphere#api/en/geometries/SphereGeometry
    const geometry = new THREE.SphereGeometry(0.15, 26, 14);
    // color of the sphere : https://www.htmlcsscolor.com/hex/006868
    const material = new THREE.MeshBasicMaterial({ color: 0x006868 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.z = 1;
    sphere.position.x = startPosition + 0.15;
    scene.add(sphere);
    this.player = sphere;
    this.playerInfo = {
      positionX: startPosition + 0.163,
      velocity: 0,
      name,
      isDead: false,
    };
  }
  run() {
    if (this.playerInfo.isDead) return;
    // loader.load("./po_model/scene.gltf", (gltf) => {
    this.playerInfo.velocity = 0.03;
    // });
  }
  stop() {
    //   this.playerInfo.velocity =0;
    //   gradual stop as opposed to sudden stop
    gsap.to(this.playerInfo, { duration: 0.1, velocity: 0 });
  }
  // po only moves when velocity is 1
  update() {
    // loader.load("./po_model/scene.gltf", (gltf) => {
    //     // decrease the position x of player Po from right to left hence -ve=
    //     this.playerInfo.positionX -= this.playerInfo.velocity;
    //     gltf.scene.position.x = this.playerInfo.positionX;
    // });
    this.check();
    this.playerInfo.positionX += this.playerInfo.velocity;
    this.player.position.x = this.playerInfo.positionX;
  }
  check() {
    //   conditional truthy check with and for moving player
    if ((this.playerInfo.velocity > 0) && (!isLookingAtPlayer))  {
    //   alert("Oh No - you lost! You were caught moving !");
    text.innerText ="Oh No - you lost! You were caught moving !";
    gameStat = "Game Over!! Please Try Again! ";
    }
    if (this.playerInfo.positionX > (endPosition - 0.163)){
        // alert("Whoppppy! - you won! You sneaked passed stealthily !");
        text.innerText ="Whoppppy! - you won! You sneaked passed through stealthily !";
    gameStat = "Game Over!! Feel Free to Play Again! ";
    }
    if ((gameStat === "Game Over!") && (this.playerInfo.positionX < (endPosition - 0.163))){
      //   alert("Oh No - you lost! You were caught moving !");
    text.innerText ="Oh No - you lost! You didn't reach the other end!";
    gameStat = "Game Over!! Please Try Again! ";
    }
    
  }
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const player = new Player();
 let doll = new Doll(); 

// game logic
// // without the set timeout since the model takes a while to load you may see an uncaught type error stating cannot read props fo undefined (reading rotation ) and (setting doll)
// setTimeout(() => {
//   //   doll.backOfDoll();
//   doll.start();
// }, 1000); // calling after 1 sec
async function init() {
  
  await delay(400);
  balls.innerText = "";
  text.innerText = "Starting in 3";
  await delay(400);
  text.innerText = "Starting in 2";
  await delay(400);
  text.innerText = "Starting in 1";
  await delay(400);
  text.innerText = "Go!!! ";
  startGame();
}


function startGame() {
  gameStat = "Game has started";
  // live timer up top!
  const progressBar = createCube({ w: 10, h: 0.1, d: 1 }, 0, 0, 0xe5a716);
  progressBar.position.y = 3.35;
  // this shrinks down out progress bar!
  gsap.to(progressBar.scale, { duration: TIME_LIMIT, x: 0, ease: "none" });
   doll.start;
  setTimeout(() => {
    if (gameStat != "Game Over!") {
      text.innerText = "Time Ran Out!!!";
      // loseMusic.play()
      gameStat = "Game Over!";
    }
  }, TIME_LIMIT * 1000); //multiplying ms time limit by 1 second

 
}

init();

// dynamically calling the renderer as opposed to manually calling it for each shape as described above^
function animate() {
  renderer.render(scene, camera);
  // animating the cube by rotating along x/y/z axis and defining a rotation speed! ( 1 is pretty fast hence i slowed it down to 0.01)
  // along x axis
  // cube.rotation.x +=0.01;
  // along y axis
  // cube.rotation.y +=0.01;
  // z axis
  // cube.rotation.x +=0.01;

  //  this is whats being called again and again!
  requestAnimationFrame(animate);
  //   to call the movement of po
  player.update();
}
animate();

// for responsive of the canvas background behind the image of the gltf scene using this section
//checking for the resize event and calling the resize function to adjust aspect ratio of the canvas!
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//window event key handling listener for right key being pressed to advance the player
window.addEventListener("keydown", (e) => {
  // alert(e.key);
  if (gameStat != "Game has started") return; //   ensures user can move before the game timer has started
  if (e.key === "ArrowUp") {
    player.run();
  } else if (e.key === "ArrowRight") {
    player.run();
  } else if (e.key === "w") {
    player.run();
  } else if (e.key === "d") {
    player.run();
  }
});

// stopping call
window.addEventListener("keyup", (e) => {
  // alert(e.key);
  if (e.key === "ArrowDown") {
    player.stop();
  } else if (e.key === "ArrowLeft") {
    player.stop();
  } else if (e.key === "s") {
    player.stop();
  } else if (e.key === "a") {
    player.stop();
  }
});
