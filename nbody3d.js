var container, stats;
var camera, scene, renderer, group, particle, grid;
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

	// Grid
	var N = 2;
	var W = H = 1000;
	var grid = new THREE.Mesh(new THREE.PlaneGeometry(N * W, N * H, N, N), new THREE.MeshBasicMaterial({ color: GLOBALS.DARKGREY, wireframe: true }));
	grid.rotation.z = PI2;
	scene.add(grid);

	// particle setup
/*
	//two body
	GLOBALS.g = 0.05;
	GLOBALS.ts = 0.01;
	GLOBALS.particles[0] = { colour: GLOBALS.GREEN, Qx: 1.0, Qy: 2.0, Qz: 0.0, Px: 0.1, Py: 0.1, Pz: 0.0, mass: 5.0, };
	GLOBALS.particles[1] = { colour: GLOBALS.RED, Qx: 2.0, Qy: 1.0, Qz: 0.0, Px: -0.1, Py: -0.1, Pz: 0.0, mass: 1.0, };
	//
	GLOBALS.g = 0.05;
	GLOBALS.ts = 0.01;
	GLOBALS.particles[0] = { colour: GLOBALS.YELLOW, Qx: 1.07590, Qy: 0.0, Qz: 0.0, Px: 0.0, Py: 0.19509, Pz: 0.0, mass: 1.0, };
	GLOBALS.particles[1] = { colour: GLOBALS.WHITE, Qx: -0.07095, Qy: 0.0, Qz: 0.0, Px: -0.2, Py: -1.23187, Pz: 0.0, mass: 1.0, };
	GLOBALS.particles[2] = { colour: GLOBALS.BLUE, Qx: -1.00496, Qy: 0.0, Qz: 0.0, Px: 0.0, Py: 1.03678, Pz: 0.0, mass: 1.0, };
	// eight-body
	GLOBALS.g = 0.05;
	GLOBALS.ts = 0.01;
	GLOBALS.particles[0] = { colour: GLOBALS.YELLOW, Qx: 0.0, Qy: 0.0, Qz: 0.0, Px: 0.0, Py: 0.0, Pz: 0.0, mass: 100.0, };
	GLOBALS.particles[1] = { colour: GLOBALS.WHITE, Qx: 0.0, Qy: 4.5, Qz: 0.4, Px: -0.2, Py: 0.0, Pz: 1.8, mass: 2.0, };
	GLOBALS.particles[2] = { colour: GLOBALS.BLUE, Qx: -6.0, Qy: 0.0, Qz: -0.4, Px: 0.0, Py: -0.6, Pz: 1.0, mass: 3.0, };
	GLOBALS.particles[3] = { colour: GLOBALS.GREEN, Qx: 3.0, Qy: 0.0, Qz: -0.2, Px: 0.0, Py: 5.8, Pz: -0.2, mass: 5.0, };
	GLOBALS.particles[4] = { colour: GLOBALS.DARKGREY, Qx: 0.0, Qy: -4.0, Qz: 0.1, Px: -3.6, Py: 0.0, Pz: 0.2, mass: 4.0, };
	GLOBALS.particles[5] = { colour: GLOBALS.RED, Qx: -4.0, Qy: 0.0, Qz: -0.1, Px: 0.0, Py: -0.2, Pz: -2.6, mass: 3.0, };
	GLOBALS.particles[6] = { colour: GLOBALS.CYAN, Qx: 8.0, Qy: 0.0, Qz: -0.3, Px: 0.0, Py: 1.2, Pz: -0.2, mass: 3.0, };
	GLOBALS.particles[7] = { colour: GLOBALS.PURPLE, Qx: 0.0, Qy: 4.0, Qz: -0.2, Px: -4.8, Py: 0.0, Pz: -0.2, mass: 4.0, };
*/
	// four-body
	GLOBALS.g = 3.5;
	GLOBALS.ts = 0.01;
	GLOBALS.particles[0] = { colour: GLOBALS.RED, Qx: 1.0, Qy: 1.0, Qz: 1.0, Px: -1.0, Py: 1.0, Pz: -1.0, mass: 1.0, };
	GLOBALS.particles[1] = { colour: GLOBALS.YELLOW, Qx: -1.0, Qy: -1.0, Qz: 1.0, Px: 1.0, Py: -1.0, Pz: -1.0, mass: 1.0, };
	GLOBALS.particles[2] = { colour: GLOBALS.BLUE, Qx: 1.0, Qy: -1.0, Qz: -1.0, Px: 1.0, Py: 1.0, Pz: 1.0, mass: 1.0, };
	GLOBALS.particles[3] = { colour: GLOBALS.GREEN, Qx: -1.0, Qy: 1.0, Qz: -1.0, Px: -1.0, Py: -1.0, Pz: 1.0, mass: 1.0, };
	initialize();
	for (i = 0; i < GLOBALS.np; i += 1) {
		a = GLOBALS.particles[i];
		a.radius = Math.pow(a.mass / GLOBALS.density, 1.0 / 3.0);
		particle = new THREE.Particle( new THREE.ParticleCanvasMaterial({ color: a.colour, program: program }));
		particle.position.x = scale * a.Qx;
		particle.position.y = scale * a.Qy;
		particle.position.z = scale * a.Qz;
		particle.scale.x = particle.scale.y = particle.scale.z = 8.0 * Math.pow(a.mass, 1.0 / 3.0);
		group.add(particle);
	}

	renderer = new THREE.CanvasRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	document.addEventListener( 'mousedown', onDocumentMouseMove, false );
//	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
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

function touch () {
	if ( event.touches.length === 1 ) {
		event.preventDefault();
		mouseX = event.touches[0].pageX - windowHalfX;
		mouseY = event.touches[0].pageY - windowHalfY;
	}
}

function onDocumentTouchStart( event ) {
	touch();
}

function onDocumentTouchMove( event ) {
	touch();
}

function animate() {
	requestAnimationFrame( animate );
	render();
	stats.update();
}

function render() {
	var hNow, dH;
	camera.position.x += ( mouseX - 0.5 * camera.position.x ) * 1.0;
	camera.position.y += ( - mouseY - 0.5 * camera.position.y ) * 1.0;
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
		hNow = hamiltonian();
		dH = hNow - GLOBALS.H0;
		if (hNow < GLOBALS.Hmin) {
			GLOBALS.Hmin = hNow;
		} else if (hNow > GLOBALS.Hmax) {
			GLOBALS.Hmax = hNow;
		}
		if (GLOBALS.n % 1000 === 0) {
			console.log("t: " + (GLOBALS.n * GLOBALS.ts).toFixed(0) +
					", H:" + hNow.toExponential(6) +
					", H0:" + GLOBALS.H0.toExponential(6) +
					", H-:" + GLOBALS.Hmin.toExponential(6) +
					", H+:" + GLOBALS.Hmax.toExponential(6) +
					", ER:" + (10.0 * Math.log(Math.abs(dH / GLOBALS.H0)) / Math.log(10.0)).toFixed(1));
		}
	}
	GLOBALS.n += 1;
	renderer.render( scene, camera );
}


