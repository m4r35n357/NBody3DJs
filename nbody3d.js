var container, stats;
var camera, scene, renderer, group, particle;
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

	// particle setup
	initialize();
	for (i = 0; i < GLOBALS.np; i += 1) {
		a = GLOBALS.particles[i];
		particle = new THREE.Particle( new THREE.ParticleCanvasMaterial( { color: a.colour, program: program } ) );
		particle.position.x = scale * a.Qx;
		particle.position.y = scale * a.Qy;
		particle.position.z = scale * a.Qz;
		particle.scale.x = particle.scale.y = 5.0 * Math.pow(a.mass, 1.0 / 3.0);
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
	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
	camera.lookAt( scene.position );

	// simulate . . .
//	sympEuler(updateQ, updateP);
//	stormerVerlet2(updateQ, updateP);
	stormerVerlet4(updateQ, updateP);
	cog();
	for (i = 0; i < GLOBALS.np; i += 1) {
		a = GLOBALS.particles[i];
		group.children[i].position.x = scale * (a.Qx - cogX);
		group.children[i].position.y = scale * (a.Qy - cogY);
		group.children[i].position.z = scale * (a.Qz - cogZ);
	}

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


