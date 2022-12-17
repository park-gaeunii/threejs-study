const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

const light = new THREE.DirectionalLight( 0xffffff, 0.7 );
light.position.set( 1, 1, 0 ).normalize();
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add( hemisphereLight );
scene.add( light );
scene.add( new THREE.AmbientLight( 0xffffff, 0.3 ) );

const clouds = [];

const array = [
	[
		{
			radius: 200,
			x: -600,
			y: -400,
			z: 500
		}, {
			radius: 300,
			x: -400,
			y: -400,
			z: 200
		}, {
			radius: 350,
			x: 0,
			y: -200,
			z: 0
		}, {
			radius: 500,
			x: 0,
			y: -150,
			z: 500
		}, {
			radius: 800,
			x: 800,
			y: 0,
			z: 0
		}, {
			radius: 350,
			x: 600,
			y: -200,
			z: 700
		}, {
			radius: 450,
			x: 1600,
			y: 50,
			z: 300
		}, {
			radius: 400,
			x: 1000,
			y: -300,
			z: -700
		}, {
			radius: 600,
			x: 1600,
			y: -300,
			z: -500
		}, {
			radius: 350,
			x: 1600,
			y: 300,
			z: -100
		}, {
			radius: 350,
			x: 2000,
			y: -150,
			z: 100
		}
	], [
		{
			radius: 350,
			x: -700,
			y: -300,
			z: 200
		}, {
			radius: 400,
			x: -500,
			y: 100,
			z: -200
		}, {
			radius: 500,
			x: 50,
			y: -50,
			z: -200
		}, {
			radius: 650,
			x: -50,
			y: -50,
			z: 400
		}, {
			radius: 800,
			x: 800,
			y: 0,
			z: 0
		}, {
			radius: 550,
			x: 1500,
			y: 0,
			z: 500
		}, {
			radius: 700,
			x: 1400,
			y: 500,
			z: -400
		}, {
			radius: 450,
			x: 2100,
			y: 0,
			z: 100
		}, {
			radius: 450,
			x: 1800,
			y: 0,
			z: -500
		}, {
			radius: 400,
			x: 2100,
			y: 400,
			z: -400
		}
	], [
		{
			radius: 200,
			x: -2700,
			y: -300,
			z: 400
		}, {
			radius: 300,
			x: -2300,
			y: -100,
			z: 400
		}, {
			radius: 450,
			x: -1250,
			y: -100,
			z: 400
		}, {
			radius: 650,
			x: -650,
			y: 500,
			z: 200
		}, {
			radius: 700,
			x: -300,
			y: -100,
			z: 100
		}, {
			radius: 650,
			x: -300,
			y: 100,
			z: -500
		}, {
			radius: 750,
			x: 200,
			y: 700,
			z: -400
		}, {
			radius: 800,
			x: 900,
			y: 0,
			z: 0
		}, {
			radius: 500,
			x: 600,
			y: 200,
			z: -900
		}, {
			radius: 700,
			x: 1400,
			y: 200,
			z: -700
		}, {
			radius: 500,
			x: 1900,
			y: -300,
			z: -200
		}
	]
];

let geometry;
let mesh;
	
const material = new THREE.MeshPhongMaterial();
material.flatShading = true;
material.color = new THREE.Color( 0xffffff );

const map = (val, smin, smax, emin, emax) => (emax-emin)*(val-smin)/(smax-smin) + emin;
	
for ( let i = 0; i < array.length; i++ ) {
	clouds.push( new THREE.Group() );

	for ( let j = 0; j < array[i].length; j++ ) {
		geometry = new THREE.IcosahedronGeometry( array[i][j].radius, 1 );
	
		geometry.vertices.forEach( v => {
			v.x += map( Math.random(), 0, 1, - ( v.x / 11 ), ( v.x / 11 ) );
			v.y += map( Math.random(), 0, 1, - ( v.y / 11 ), ( v.y / 11 ) );
			v.z += map( Math.random(), 0, 1, - ( v.z / 11 ), ( v.z / 11 ) );
		});
	
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( array[i][j].x, array[i][j].y, array[i][j].z );

		clouds[i].add( mesh );
	}

	scene.add( clouds[i] );
}

clouds[0].position.set( -10000, -4000, 0 );
clouds[0].scale.x = 1;
clouds[0].scale.y = 1;
clouds[0].scale.z = 1;

clouds[1].position.set( 10000, -4000, 0 );
clouds[1].scale.x = 1;
clouds[1].scale.y = 1;
clouds[1].scale.z = 1;

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
};

window.addEventListener('resize', () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera( 40, (window.innerWidth / window.innerHeight), 5, 65000 );
camera.position.set( 0, 6000, 1500 * 10 );
scene.add( camera );

const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	alpha: true
});
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) );

const render = () => {
	controls.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(render);
}

render();