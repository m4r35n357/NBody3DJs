if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;
var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var threeDscale = 100.0;
init();
animate();


function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
	camera.position.z = 1000;

	scene = new THREE.Scene();
//				scene.fog = new THREE.FogExp2( 0x000000, 0.0007 );

	geometry = new THREE.Geometry();
/*
	// these are the particles
	for ( i = 0; i < 200; i ++ ) {

		var vertex = new THREE.Vector3();
		vertex.x = Math.random() * 2000 - 1000;
		vertex.y = Math.random() * 2000 - 1000;
		vertex.z = Math.random() * 2000 - 1000;

		geometry.vertices.push( vertex );

	}
*/
	initialize();
	for (i = 0; i < GLOBALS.np; i += 1) {
		geometry.vertices[i] = new THREE.Vector3(threeDscale * GLOBALS.particles[i].Qx, threeDscale * GLOBALS.particles[i].Qy, threeDscale * GLOBALS.particles[i].Qz);
	}

	// [[ colour ], size ] 
	parameters = [
		[ [1, 1, 0.5], 10 ],
		[ [0.95, 1, 0.5], 4 ],
		[ [0.90, 1, 0.5], 3 ],
		[ [0.85, 1, 0.5], 2 ],
		[ [0.80, 1, 0.5], 1 ]
	];

//				for ( i = 0; i < parameters.length; i ++ ) {
	for ( i = 0; i < geometry.vertices.length; i ++ ) {

		color = parameters[i][0];
		size  = parameters[i][1];

		materials[i] = new THREE.ParticleBasicMaterial( { size: size } );

		particles = new THREE.ParticleSystem( geometry, materials[i] );

//					particles.rotation.x = Math.random() * 6;
//					particles.rotation.y = Math.random() * 6;
//					particles.rotation.z = Math.random() * 6;

		scene.add( particles );

	}

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart( event ) {
	if ( event.touches.length === 1 ) {
		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}

function onDocumentTouchMove( event ) {
	if ( event.touches.length === 1 ) {
		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}

function animate() {
	requestAnimationFrame( animate );

	render();
	stats.update();
}

function render() {
//				var time = Date.now() * 0.00005;
	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

	camera.lookAt( scene.position );
/*
	for ( i = 0; i < scene.children.length; i ++ ) {

		var object = scene.children[ i ];

		if ( object instanceof THREE.ParticleSystem ) {

			object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );

		}

	}

	for ( i = 0; i < materials.length; i ++ ) {

		color = parameters[i][0];

		h = ( 360 * ( color[0] + time ) % 360 ) / 360;
		materials[i].color.setHSL( h, color[1], color[2] );

	}
*/
	// simulate . . .
	sympEuler(updateQ, updateP);
	for (i = 0; i < GLOBALS.np; i += 1) {
		geometry.vertices[i].set(threeDscale * GLOBALS.particles[i].Qx, threeDscale * GLOBALS.particles[i].Qy, threeDscale * GLOBALS.particles[i].Qz);
	}
	geometry.verticesNeedUpdate = true;

	// monitor value of the Hamiltonian
	if (GLOBALS.debug && ((GLOBALS.n % 100) === 0)) {
		update = false;
		Hcurrent = hamiltonian();
		if (Hcurrent < GLOBALS.Hmin) {
			GLOBALS.Hmin = Hcurrent;
			update = true;
		} else if (Hcurrent > GLOBALS.Hmax) {
			GLOBALS.Hmax = Hcurrent;
			update = true;
		}
		if (update) {
			console.log("Hamiltonian: " + Hcurrent.toExponential(6) +
					", Start: " + GLOBALS.H0.toExponential(6) +
					", Min: " + GLOBALS.Hmin.toExponential(6) +
					", Max: " + GLOBALS.Hmax.toExponential(6));
		}
	}
	GLOBALS.n += 1;
	renderer.render( scene, camera );
}

