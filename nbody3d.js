var container, stats;
var camera, scene, renderer, group, particle, plane;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var scale = 100.0;
init();
animate();

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
	camera.position.z = 1000;

	scene = new THREE.Scene();

	var PI2 = Math.PI * 2;
	var program = function ( context ) {
		context.beginPath();
		context.arc( 0, 0, 1, 0, PI2, true );
		context.closePath();
		context.fill();
	}

	group = new THREE.Object3D();
	scene.add( group );
/*
	// each square
	var planeW = 100; // pixels
	var planeH = 100; // pixels 
	var numW = 50; // how many wide (50*50 = 2500 pixels wide)
	var numH = 50; // how many tall (50*50 = 2500 pixels tall)
	var plane = new THREE.Mesh( new THREE.PlaneGeometry( planeW*50, planeH*50, planeW, planeH ), new THREE.MeshBasicMaterial( { color: GLOBALS.PALEGREY, wireframe: true } ) );
	plane.rotation.z = PI2;
	scene.add(plane);
*/
	// particle setup
/*
	GLOBALS.particles[0] = { colour: GLOBALS.BLACK, Qx: 1.0, Qy: 2.0, Qz: 0.0, Px: 0.1, Py: 0.1, Pz: 0.0, mass: 5.0, };
	GLOBALS.particles[1] = { colour: GLOBALS.BLACK, Qx: 2.0, Qy: 1.0, Qz: 0.0, Px: -0.1, Py: -0.1, Pz: 0.0, mass: 1.0, };
*/
	GLOBALS.particles[0] = { colour: GLOBALS.YELLOW, Qx: 0.0, Qy: 0.0, Qz: 0.0, Px: 0.0, Py: 0.0, Pz: 0.1, mass: 100.0, };
	GLOBALS.particles[1] = { colour: GLOBALS.WHITE, Qx: 0.0, Qy: 1.5, Qz: 0.4, Px: -3.4, Py: 0.0, Pz: -0.2, mass: 2.0, };
	GLOBALS.particles[2] = { colour: GLOBALS.BLUE, Qx: -2.0, Qy: 0.0, Qz: -0.4, Px: 0.0, Py: -4.0, Pz: 0.2, mass: 3.0, };
	GLOBALS.particles[3] = { colour: GLOBALS.GREEN, Qx: 3.0, Qy: 0.0, Qz: -0.2, Px: 0.0, Py: 4.0, Pz: -0.1, mass: 5.0, };
	GLOBALS.particles[4] = { colour: GLOBALS.DARKGREY, Qx: 0.0, Qy: -4.0, Qz: 0.1, Px: 4.6, Py: 0.0, Pz: 0.1, mass: 4.0, };
	GLOBALS.particles[5] = { colour: GLOBALS.RED, Qx: -4.0, Qy: 0.0, Qz: -0.1, Px: 0.0, Py: -2.8, Pz: -0.2, mass: 3.0, };
	GLOBALS.particles[6] = { colour: GLOBALS.CYAN, Qx: 2.0, Qy: 0.0, Qz: -0.3, Px: 0.0, Py: 4.4, Pz: 0.2, mass: 3.0, };
	GLOBALS.particles[7] = { colour: GLOBALS.PURPLE, Qx: 0.0, Qy: 3.0, Qz: -0.2, Px: -5.0, Py: 0.0, Pz: -0.1, mass: 4.0, };

	initialize();
	for (i = 0; i < GLOBALS.np; i += 1) {
		a = GLOBALS.particles[i];
		particle = new THREE.Particle( new THREE.ParticleCanvasMaterial( { color: a.colour, program: program } ) );
		particle.position.x = scale * a.Qx;
		particle.position.y = scale * a.Qy;
		particle.position.z = scale * a.Qz;
		particle.scale.x = particle.scale.y = 4.0 * Math.pow(a.mass, 1.0 / 3.0);
		group.add( particle );
	}

	renderer = new THREE.CanvasRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );

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
	camera.position.x += ( mouseX - camera.position.x ) * 1.0;
	camera.position.y += ( - mouseY - camera.position.y ) * 1.0;
	camera.lookAt( scene.position );

	// simulate . . .
	stormerVerlet4(updateQ, updateP);
	cog();
	for (i = 0; i < GLOBALS.np; i += 1) {
		a = GLOBALS.particles[i];
		group.children[i].position.x = scale * (a.Qx - cogX);
		group.children[i].position.y = scale * (a.Qy - cogY);
		group.children[i].position.z = scale * (a.Qz - cogZ);
	}

	// monitor value of the Hamiltonian
	if (GLOBALS.debug) {
		Hcurrent = hamiltonian();
		if (Hcurrent < GLOBALS.Hmin) {
			GLOBALS.Hmin = Hcurrent;
			GLOBALS.error += Math.abs(Hcurrent - GLOBALS.H0);
		} else if (Hcurrent > GLOBALS.Hmax) {
			GLOBALS.Hmax = Hcurrent;
			GLOBALS.error += Math.abs(Hcurrent - GLOBALS.H0);
		}
		if (GLOBALS.n % 1000 === 0) {
			console.log("n: " + GLOBALS.n +
					", Hamiltonian: " + Hcurrent.toExponential(9) +
					", Start: " + GLOBALS.H0.toExponential(9) +
					", Min: " + GLOBALS.Hmin.toExponential(9) +
					", Max: " + GLOBALS.Hmax.toExponential(9) +
					", Error: " + GLOBALS.error.toExponential(9) +
					", SNR: " + (10.0 * Math.log(Math.abs(GLOBALS.H0 / GLOBALS.error)) / Math.log(10.0)).toFixed(1));
		}
	}
	GLOBALS.n += 1;
	renderer.render( scene, camera );
}


