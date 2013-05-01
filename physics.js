/*jslint white: true, browser: true, safe: true */

//"use strict";

GLOBALS = {
	debug: true,
	BLACK: "#000000",
	GREY: "#808080",
	PALEGREY: "#c0c0c0",
	RED: "#ff0000",
	GREEN: "#00ff00",
	BLUE: "#0000ff",
	YELLOW: "#808000",
	PURPLE: "#800080",
	CYAN: "#008080",
	scale: 0.2,
	g: 0.05,
	ts: 0.005,
	n: 0,
	particles: [],
};

function initialize () {
	GLOBALS.particles[0] = { colour: GLOBALS.YELLOW, Qx: 0.0, Qy: 0.0, Qz: 0.0, Px: 0.0, Py: 0.0, Pz: 0.1, mass: 100.0, };
	GLOBALS.particles[1] = { colour: GLOBALS.BLACK, Qx: 0.0, Qy: 1.5, Qz: 0.4, Px: -3.4, Py: 0.0, Pz: -0.2, mass: 2.0, };
	GLOBALS.particles[2] = { colour: GLOBALS.BLUE, Qx: -2.0, Qy: 0.0, Qz: -0.4, Px: 0.0, Py: -4.0, Pz: 0.2, mass: 3.0, };
	GLOBALS.particles[3] = { colour: GLOBALS.GREEN, Qx: 3.0, Qy: 0.0, Qz: -0.2, Px: 0.0, Py: 4.0, Pz: -0.1, mass: 5.0, };
	GLOBALS.particles[4] = { colour: GLOBALS.GREY, Qx: 0.0, Qy: -4.0, Qz: 0.1, Px: 4.6, Py: 0.0, Pz: 0.1, mass: 4.0, };
	GLOBALS.particles[5] = { colour: GLOBALS.RED, Qx: -4.0, Qy: 0.0, Qz: -0.1, Px: 0.0, Py: -2.8, Pz: -0.2, mass: 3.0, };
	GLOBALS.particles[6] = { colour: GLOBALS.CYAN, Qx: 2.0, Qy: 0.0, Qz: -0.3, Px: 0.0, Py: 3.2, Pz: 0.2, mass: 3.0, };
	GLOBALS.particles[7] = { colour: GLOBALS.PURPLE, Qx: 0.0, Qy: 3.0, Qz: -0.2, Px: -4.8, Py: 0.0, Pz: -0.1, mass: 4.0, };
	GLOBALS.np = GLOBALS.particles.length;
	GLOBALS.H0 = hamiltonian();  // initial value
	GLOBALS.Hmin = GLOBALS.H0;
	GLOBALS.Hmax = GLOBALS.H0;
}

function cog () {
	var a;
	var X = 0.0;
	var Y = 0.0;
	var Z = 0.0;
	var mT = 0.0;
	for (i = 0; i < GLOBALS.np; i += 1) {
		a = GLOBALS.particles[i];
		X += a.Qx * a.mass;
		Y += a.Qy * a.mass;
		Z += a.Qz * a.mass;
		mT += a.mass;
	}
	cogX = X / mT;
	cogY = Y / mT;
	cogZ = Z / mT;
}

function distance (x1, y1, z1, x2, y2, z2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
}

function hamiltonian () {
	var a, b, i, j;
	var totalEnergy = 0.0;
	for (i = 0; i < GLOBALS.np; i += 1) {
		a = GLOBALS.particles[i];
		totalEnergy += 0.5 * (a.Px * a.Px + a.Py * a.Py + a.Pz * a.Pz) / a.mass;
		for (j = 0; j < GLOBALS.np; j += 1) {
			if (i > j) {
				b = GLOBALS.particles[j];
				totalEnergy -= GLOBALS.g * a.mass * b.mass / distance(a.Qx, a.Qy, a.Qz, b.Qx, b.Qy, b.Qz);
			}
		}
	}
	return totalEnergy;
}

function updateQ (coefficient) {
	var a, i, tmp;
	for (i = 0; i < GLOBALS.np; i += 1) {
		a = GLOBALS.particles[i];
		tmp = coefficient / a.mass * GLOBALS.ts;
		a.Qx += a.Px * tmp;
		a.Qy += a.Py * tmp;
		a.Qz += a.Pz * tmp;
	}
}

function updateP (coefficient) {
	var a, b, i, j, tmp, dPx, dPy;
	for (i = 0; i < GLOBALS.np; i += 1) {
		a = GLOBALS.particles[i];
		for (j = 0; j < GLOBALS.np; j += 1) {
			b = GLOBALS.particles[j];
			tmp = - coefficient * GLOBALS.g * a.mass * b.mass / Math.pow(distance(a.Qx, a.Qy, a.Qz, b.Qx, b.Qy, b.Qz), 3) * GLOBALS.ts;
			if (i > j) {
				dPx = (b.Qx - a.Qx) * tmp;
				dPy = (b.Qy - a.Qy) * tmp;
				dPz = (b.Qz - a.Qz) * tmp;
				a.Px -= dPx;
				a.Py -= dPy;
				a.Pz -= dPz;
				b.Px += dPx;
				b.Py += dPy;
				b.Pz += dPz;
			}
		}
	}
}

function sympEuler (first, second) {
	first(1.0);
	second(1.0);
}

function stormerVerlet2 (first, second) {
	first(0.5);
	second(1.0);
	first(0.5);
}

function stormerVerlet4 (first, second) {
	var c1, c2, c3, c4, d1, d2, d3;
	var cubeRoot2 = Math.pow(2.0, 1/3);
	var denom = 2.0 - cubeRoot2;
	c1 = c4 = 1.0 / (2.0 * denom);
	c2 = c3 = (1.0 - cubeRoot2) / (2.0 * denom);
	d1 = d3 = 1.0 / denom;
	d2 = - cubeRoot2 / denom;
	first(c1);
	second(d1);
	first(c2);
	second(d2);
	first(c3);
	second(d3);
	first(c4);
}

