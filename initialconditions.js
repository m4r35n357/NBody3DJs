/*jslint white: true, browser: true, safe: true */

//"use strict";

function twoBody () {
	GLOBALS.g = 0.05;
	GLOBALS.ts = 0.01;
	GLOBALS.particles[0] = { colour: GLOBALS.GREEN, Qx: 1.0, Qy: 2.0, Qz: 0.0, Px: 0.1, Py: 0.1, Pz: 0.0, mass: 5.0, };
	GLOBALS.particles[1] = { colour: GLOBALS.RED, Qx: 2.0, Qy: 1.0, Qz: 0.0, Px: -0.1, Py: -0.1, Pz: 0.0, mass: 1.0, };
}

function fourBody () {
	GLOBALS.g = 3.5;
	GLOBALS.ts = 0.01;
	GLOBALS.particles[0] = { colour: GLOBALS.RED, Qx: 1.0, Qy: 1.0, Qz: 1.0, Px: -1.0, Py: 1.0, Pz: -1.0, mass: 1.0, };
	GLOBALS.particles[1] = { colour: GLOBALS.YELLOW, Qx: -1.0, Qy: -1.0, Qz: 1.0, Px: 1.0, Py: -1.0, Pz: -1.0, mass: 1.0, };
	GLOBALS.particles[2] = { colour: GLOBALS.BLUE, Qx: 1.0, Qy: -1.0, Qz: -1.0, Px: 1.0, Py: 1.0, Pz: 1.0, mass: 1.0, };
	GLOBALS.particles[3] = { colour: GLOBALS.GREEN, Qx: -1.0, Qy: 1.0, Qz: -1.0, Px: -1.0, Py: -1.0, Pz: 1.0, mass: 1.0, };
}

function eightBody () {
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
}

function unknown () {
	GLOBALS.g = 0.05;
	GLOBALS.ts = 0.01;
	GLOBALS.particles[0] = { colour: GLOBALS.YELLOW, Qx: 1.07590, Qy: 0.0, Qz: 0.0, Px: 0.0, Py: 0.19509, Pz: 0.0, mass: 1.0, };
	GLOBALS.particles[1] = { colour: GLOBALS.WHITE, Qx: -0.07095, Qy: 0.0, Qz: 0.0, Px: -0.2, Py: -1.23187, Pz: 0.0, mass: 1.0, };
	GLOBALS.particles[2] = { colour: GLOBALS.BLUE, Qx: -1.00496, Qy: 0.0, Qz: 0.0, Px: 0.0, Py: 1.03678, Pz: 0.0, mass: 1.0, };
}

