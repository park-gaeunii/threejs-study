const colors = document.querySelectorAll(".color > a");
const del = document.getElementById('del');
const add = document.getElementById('add');
const tween = document.getElementById('tween');

const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});

const fov = 45;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 200;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 20, 100);

const controls = new THREE.OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();

const scene = new THREE.Scene();

const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
	'/images/neg-x.png',
	'/images/pos-x.png',
	'/images/pos-y.png',
	'/images/neg-y.png',
	'/images/neg-z.png',
	'/images/pos-z.png'
]);
scene.background = texture;

const light = new THREE.DirectionalLight();
light.position.set(5, 10, 5);
scene.add(light);

const hemiLight = new THREE.HemisphereLight();
hemiLight.intensity = 0.5;
scene.add(hemiLight);

const layerArray = [
	{
		name: 'topLayer',
		y: 12
	}, {
		name: 'middleLayer',
		y: 0
	}, {
		name: 'bottomLayer',
		y: -12
	}
];

const layerWidth = 40;
const layerHeight = .2;
const layerDepth = 40;
const layerGeometry = new THREE.BoxGeometry(layerWidth, layerHeight, layerDepth);

const layerMaterial = new THREE.MeshStandardMaterial({
	color: '#f1f1f1',
	opacity: .5,
	transparent: true,
	depthWrite: false
});

for (let i = 0; i < layerArray.length; i++) {
	const layer = new THREE.Mesh(layerGeometry, layerMaterial);
	scene.add(layer);
	layer.name = layerArray[i].name;
	layer.position.set(0, layerArray[i].y, 0);
}

let nodeArray = [];

const topLayer = scene.getObjectByName('topLayer');
const middleLayer = scene.getObjectByName('middleLayer');
const bottomLayer = scene.getObjectByName('bottomLayer');

const hexagonTop =  2.0;
const hexagonBottom = 2;
const hexagonHeight = 2.0;
const hexagonSegments = 6;
const hexagonGeometry = new THREE.CylinderGeometry(hexagonTop, hexagonBottom, hexagonHeight, hexagonSegments);
const hexagonMaterial = new THREE.MeshStandardMaterial({
	color: '#ff0000',
	metalness: 0.2,
	roughness: 0.5
});
const hexagon = new THREE.Mesh(hexagonGeometry, hexagonMaterial);
hexagon.name = 'hexagon';
hexagon.position.set(0, topLayer.position.y + (hexagonHeight/2) + topLayer.geometry.parameters.height, 0);
nodeArray.push(hexagon);

const boxWidth = 4;
const boxHeight = 4;
const boxDepth = 4;
const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

const textureLoader = new THREE.TextureLoader();

const boxColor = '#88aacc';

const boxMaterials = [
	new THREE.MeshStandardMaterial({color: boxColor}),
	new THREE.MeshStandardMaterial({color: boxColor}),
	new THREE.MeshStandardMaterial({ map: textureLoader.load('/images/Backbone_01.png') }),
	new THREE.MeshStandardMaterial({color: boxColor}),
	new THREE.MeshStandardMaterial({color: boxColor}),
	new THREE.MeshStandardMaterial({color: boxColor})
];
const box = new THREE.Mesh(boxGeometry, boxMaterials);
box.name = 'box';
box.position.set(5, middleLayer.position.y + (boxHeight/2) + middleLayer.geometry.parameters.height, 0);
nodeArray.push(box);

const cylinderTop =  2.0;
const cylinderBottom = 2;
const cylinderHeight = 5.0;
const cylinderSegments = 50;
const cylinderGeometry = new THREE.CylinderGeometry(cylinderTop, cylinderBottom, cylinderHeight, cylinderSegments);
const cylinderMaterial = new THREE.MeshStandardMaterial({
	color: '#ccaa88',
	metalness: 0.2,
	roughness: 0
});
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.name = 'cylinder';
cylinder.position.set(-10, middleLayer.position.y + (cylinderHeight/2) + middleLayer.geometry.parameters.height, 0);
nodeArray.push(cylinder);

const sphereRadius = 2;
const sphereWidthSegments = 30;
const sphereHeightSegments = 30;
const sphereGeometry = new THREE.SphereGeometry(sphereRadius, sphereWidthSegments, sphereHeightSegments);
const sphereMaterial = new THREE.MeshPhongMaterial({color: '#00ff00'});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.name = 'sphere';
sphere.position.set(0, bottomLayer.position.y + sphereRadius + bottomLayer.geometry.parameters.height, 0);
nodeArray.push(sphere);

for (let i = 0; i < nodeArray.length; i++) {
	scene.add( nodeArray[i] );
}

const position = {
	hexagon: scene.getObjectByName('hexagon').position,
	box: scene.getObjectByName('box').position,
	cylinder: scene.getObjectByName('cylinder').position,
	sphere: scene.getObjectByName('sphere').position
}

const lineArray = [
	{
		start: position.hexagon,
		end: position.box, 
		color: '#00ff00',
		width: 10
	}, {
		start: position.cylinder,
		end: position.box,
		color: '#0000ff',
		width: 5
	}, {
		start: position.cylinder,
		end: position.sphere,
		color: '#ff0000',
		width: 2
	}
];

for (let i = 0; i < lineArray.length; i++) {
	const lineGeometry = new THREE.LineGeometry();
	let start = lineArray[i].start;
	let end = lineArray[i].end;
	lineGeometry.setPositions([start.x, start.y, start.z, end.x, end.y, end.z]);
	
	const lineMaterial = new THREE.LineMaterial({
		color: lineArray[i].color,
		linewidth: lineArray[i].width, // px 
		transparent: true,
		opacity: 0.5,
		resolution: new THREE.Vector2(window.innerWidth, window.innerHeight)
		// dashed, dashScale, dashSize, gapSized
	});
	
	const line = new THREE.Line2(lineGeometry, lineMaterial);
	scene.add(line);
}

function resizeRendererToDisplaySize(renderer) {
	const canvas = renderer.domElement;
	const width = window.innerWidth;
	const height = window.innerHeight;
	const needResize = canvas.width !== width || canvas.height !== height;
	if (needResize) {
		renderer.setSize(width, height, false);
	}
	return needResize;
}

function render() {
	if ( resizeRendererToDisplaySize(renderer) ) {
		const canvas = renderer.domElement;
		camera.aspect = canvas.clientWidth / canvas.clientHeight;
		camera.updateProjectionMatrix();
	}
	TWEEN.update();
	renderer.render(scene, camera);
	requestAnimationFrame(render);
}

requestAnimationFrame(render);

function onMouseClick(event) {
	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(scene.children);
	if (intersects.length) {
		console.log(intersects[0].object.name);
	}
}

function tweenEvent() {
	const obj = scene.getObjectByName('cylinder');
	let position = {x: obj.position.x,  y: obj.position.y, z: obj.position.z};
	let target = {y: 20.7};
	let tween = new TWEEN.Tween(position).to(target, 2000);
	tween.onUpdate( () => {
		obj.position.x = position.x;
		obj.position.y = position.y;
		obj.position.z = position.z;
	})
	tween.easing(TWEEN.Easing.Elastic.InOut);
	tween.start();
}

canvas.addEventListener('click', onMouseClick);

colors.forEach( (button)  => button.addEventListener("click", (event) => {
    let color = `#${event.target.id.slice(-6)}`;
		const obj = scene.getObjectByName('cylinder');
		obj.material.color = new THREE.Color(color);
}));

del.addEventListener("click", () => {
	const obj = scene.getObjectByName('sphere');
	
	obj.geometry.dispose();
	obj.material.dispose();
	scene.remove(obj);

	for (let i = 0; i < nodeArray.length; i++) {
		if (nodeArray[i].name == obj.name) {
			nodeArray.splice(i, 1);
		}
	}
});

add.addEventListener("click", () => {
	const topLayer = scene.getObjectByName('topLayer');
	const sphereRadius = 1.5;
	const sphereWidthSegments = 30;
	const sphereHeightSegments = 30;
	const sphereGeometry = new THREE.SphereGeometry(sphereRadius, sphereWidthSegments, sphereHeightSegments);
	const sphereMaterial = new THREE.MeshStandardMaterial({
		color: '#fff000',
		metalness: 0.2,
		roughness: 0.6
	});
	const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphere.name = 'sphere';
	sphere.position.set(10, topLayer.position.y + sphereRadius + topLayer.geometry.parameters.height, 5);
	nodeArray.push(sphere);
	scene.add(sphere);
});

tween.addEventListener("click", () => {
  tweenEvent();
});