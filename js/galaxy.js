const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

const light = new THREE.DirectionalLight( 0xffffff, 0.7 );
light.position.set( 1, 1, 0 ).normalize();
scene.add( light );
scene.add( new THREE.AmbientLight( 0xffffff, 0.3 ) );

const parameters = {};
parameters.count = 100000;
parameters.size = 0.01;
parameters.radius = 5;
parameters.branches = 3;
parameters.spin = 1;
parameters.randomness = 0.2;
parameters.randomnessPower = 3;
parameters.insideColor = '#ff3c30';
parameters.outsideColor = '#1b7184';

let geometry = null;
let material = null;
let points = null;

if( points !== null ) {
    geometry.dispose();
    material.dispose();
    scene.remove( points );
}

geometry = new THREE.Geometry();

const colorInside = new THREE.Color( parameters.insideColor );
const colorOutside = new THREE.Color( parameters.outsideColor );

for ( let i = 0; i < parameters.count; i++ ) {

    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    const branchAngle = ( i % parameters.branches ) / parameters.branches * Math.PI * 2;

    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius;
    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius;
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius;

    const x = Math.cos( branchAngle + spinAngle ) * radius + randomX;
    const y = randomY;
    const z = Math.sin( branchAngle + spinAngle ) * radius + randomZ;

    geometry.vertices.push( new THREE.Vector3( x, y, z ) );

    const mixedColor = colorInside.clone();
    mixedColor.lerp( colorOutside, radius / parameters.radius );

    geometry.colors.push( new THREE.Color(mixedColor.r, mixedColor.g, mixedColor.b) );

}

material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
});

points = new THREE.Points( geometry, material );
points.scale.x = 1500;
points.scale.y = 1500;
points.scale.z = 1500;
points.position.set( 0, -1000, 0 );
scene.add( points );

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
    points.rotation.y -= 0.0004;
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
}

render();