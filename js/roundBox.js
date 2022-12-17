const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

const light = new THREE.SpotLight( 0xffffff );
light.castShadow = true;
light.position.set( 0, 8000, 0 );
light.shadow.bias = -0.004;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
scene.add( light );
scene.add( new THREE.AmbientLight( 0x404040, 0.8 ) );

function roundBox( width, height, depth, radius0, smoothness ) {
    let shape = new THREE.Shape();
    let eps = 0.00001;
    let radius = radius0 - eps;
    shape.absarc( eps, eps, eps, -Math.PI / 2, -Math.PI, true );
    shape.absarc( eps, height -  radius * 2, eps, Math.PI, Math.PI / 2, true );
    shape.absarc( width - radius * 2, height -  radius * 2, eps, Math.PI / 2, 0, true );
    shape.absarc( width - radius * 2, eps, eps, 0, -Math.PI / 2, true );
    let geometry = new THREE.ExtrudeBufferGeometry( shape, {
        amount: depth - radius0 * 2,
        bevelEnabled: true,
        bevelSegments: smoothness * 2,
        steps: 1,
        bevelSize: radius,
        bevelThickness: radius0,
        curveSegments: smoothness
    });

    geometry.center();

    return geometry;
}

let material = new THREE.MeshStandardMaterial({
    color: Math.random() * 0x777777 + 0x777777,
    metalness: 2 / 9,
    roughness: 1 - 2 / 9
});

let mesh = new THREE.Mesh( roundBox( 5000, 250, 3500, 1100 / 9, 16 ), material );
scene.add( mesh );
mesh.position.y = -2000;

let mesh2 = new THREE.Mesh( roundBox( 5000, 250, 3500, 1100 / 9, 16 ), material );
scene.add( mesh2 );

let nodeGeometry = new THREE.CylinderBufferGeometry( 800, 800, 1000, 5, 1, false, 0 );

const textureLoader = new THREE.TextureLoader();

let nodeMaterial = new THREE.MeshMatcapMaterial();
nodeMaterial.matcap = textureLoader.load(`/images/matcaps/3.png`);
nodeMaterial.color = new THREE.Color('#ffff00');

let cylinder = new THREE.Mesh( nodeGeometry, nodeMaterial );
cylinder.position.y = 600;

scene.add( cylinder );

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
})

const camera = new THREE.PerspectiveCamera( 40, (window.innerWidth / window.innerHeight), 5, 65000 );
camera.position.set( 0, 6000, 1500 * 10 );
scene.add( camera )

const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );

const render = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
}

render();

const buttons = document.querySelectorAll("#texture > button");
buttons.forEach( (button)  => button.addEventListener("click", (event) => {
    let num = event.target.innerText.charAt(8);
    nodeMaterial.matcap = textureLoader.load(`/images/matcaps/${num}.png`);
}));