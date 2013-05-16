/*jslint white: true, browser: true, safe: true */

//"use strict";

GLOBALS = {
	debug: true,
	BLACK: "#000000",
	WHITE: "#ffffff",
	GREY: "#808080",
	DARKGREY: "#404040",
	PALEGREY: "#c0c0c0",
	RED: "#ff0000",
	GREEN: "#00ff00",
	BLUE: "#0000ff",
	YELLOW: "#808000",
	PURPLE: "#800080",
	CYAN: "#008080",
	scale: 0.2,
	n: 0,
	error: 0.0,
	particles: [],
};

function initialize () {
	GLOBALS.np = GLOBALS.particles.length;
	GLOBALS.H0 = hamiltonian();  // initial value
	GLOBALS.Hmin = GLOBALS.H0;
	GLOBALS.Hmax = GLOBALS.H0;
	GLOBALS.error = 0.0;
	GLOBALS.ts = 0.01;
	GLOBALS.outputInterval = Math.round(1.0 / GLOBALS.ts);
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

function distance (xA, yA, zA, xB, yB, zB) {
	return Math.sqrt(Math.pow(xB - xA, 2) + Math.pow(yB - yA, 2) + Math.pow(zB - zA, 2));
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

function updateQ (c) {
	var a, i, tmp;
	for (i = 0; i < GLOBALS.np; i += 1) {
		a = GLOBALS.particles[i];
		tmp = c / a.mass * GLOBALS.ts;
		a.Qx += a.Px * tmp;
		a.Qy += a.Py * tmp;
		a.Qz += a.Pz * tmp;
	}
}

function updateP (c) {
	var a, b, i, j, tmp, dPx, dPy, dPz, am, aQx, aQy, aQz, bQx, bQy, bQz;
	var N = GLOBALS.np;
	var g = GLOBALS.g;
	var ts = GLOBALS.ts;
	for (i = 0; i < N; i += 1) {
		a = GLOBALS.particles[i];
		am = a.mass;
		aQx = a.Qx;
		aQy = a.Qy;
		aQz = a.Qz;
		for (j = 0; j < N; j += 1) {
			b = GLOBALS.particles[j];
			bQx = b.Qx;
			bQy = b.Qy;
			bQz = b.Qz;
			if (i > j) {
				tmp = - c * g * am * b.mass / Math.pow(distance(aQx, aQy, aQz, bQx, bQy, bQz), 3) * ts;
				dPx = (bQx - aQx) * tmp;
				dPy = (bQy - aQy) * tmp;
				dPz = (bQz - aQz) * tmp;
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

function euler (first, second) {
	first(1.0);
	second(1.0);
}

function stormerVerletBase (first, second, step) {
	first(0.5 * step)
	second(step)
	first(0.5 * step)
}

function stormerVerlet2 (first, second) {
	stormerVerletBase(first, second, 1.0)
}

function stormerVerlet4 (first, second) {
	stormerVerletBase(first, second, 1.351207191959657)
	stormerVerletBase(first, second, -1.702414383919315)
	stormerVerletBase(first, second, 1.351207191959657)
}

function stormerVerlet6 (first, second) {
	stormerVerletBase(first, second, 0.784513610477560e0)
	stormerVerletBase(first, second, 0.235573213359357e0)
	stormerVerletBase(first, second, -1.17767998417887e0)
	stormerVerletBase(first, second, 1.31518632068391e0)
	stormerVerletBase(first, second, -1.17767998417887e0)
	stormerVerletBase(first, second, 0.235573213359357e0)
	stormerVerletBase(first, second, 0.784513610477560e0)
}

