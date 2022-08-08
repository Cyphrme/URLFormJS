"use strict";

import {
	Run
} from './test.js';
import * as Unit from '../test_unit.js';

/**
 * @typedef {import('./test.js').TestBrowserJS} TestBrowserJS
 */

// Uses Bootstrap 5 CDN as default stylesheet/CSS.
const DefaultPageStylesheet = {
	href: "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css",
	rel: "stylesheet",
	// integrity: "sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx",
	crossorigin: "anonymous"
};

/**
 * Calls tests to be ran, after the DOM has been loaded.
 * See README for how to structure your directory, and test_unit.js file.
 **/
document.addEventListener('DOMContentLoaded', () => {
	let tbjs = Unit.TestBrowserJS;
	if (tbjs === null || tbjs == undefined || typeof tbjs !== "object" || Object.keys(tbjs).length <= 0) {
		console.error("TestBrowserJS: The TestBrowserJS object is not properly defined, please see README.", tbjs);
	} else {
		setGUI(tbjs);

		if (Array.isArray(tbjs.TestsToRun) && tbjs.TestsToRun.length > 0) {
			Run(tbjs.TestsToRun);
			return;
		}
	}

	document.getElementById('testsResultsMeta').innerHTML = "";
	document.getElementById('noTestsToRun').hidden = false;
});

/**
 * Sets the Browser Test JS GUI. If the needed attribute for the page is not
 * provided, the default will be used.
 *
 * @param   {TestBrowserJS}  tbjs   Object. Holds interface betwe TestBrowserJS and package.
 * @returns {void}
 **/
function setGUI(tbjs) {
	if (tbjs.TestGUIOptions !== null && tbjs.TestGUIOptions !== undefined &&
		typeof tbjs.TestGUIOptions === "object" && Object.keys(tbjs.TestGUIOptions).length > 0) {
		// Perform checks for what options are provided and what is default.
		let keys = Object.keys(tbjs.TestGUIOptions);

		// Set custom header and stylesheet if provided
		if (keys.includes("header")) {
			document.getElementById('CustomHeader').innerHTML = tbjs.TestGUIOptions.header;
		} else if (keys.includes("stylesheet")) {
			// Set stylesheet if custom provided, and custom header is not.
			setStyleSheet(tbjs.TestGUIOptions.stylesheet);
		} else {
			// If no custom header or stylesheet is given, use defaults.
			setStyleSheet(DefaultPageStylesheet);
		}

		// Set custom footer if provided
		if (keys.includes("footer")) {
			document.getElementById('CustomFooter').innerHTML = tbjs.TestGUIOptions.footer;
		}
		// Set custom main image if given.
		if (keys.includes("main_image")) {
			document.getElementById('MainImage').src = tbjs.TestGUIOptions.main_image;
		}
		// Set custom custom HTML testing area in body if given.
		if (keys.includes("html_test_area")) {
			document.getElementById('htmlTestArea').innerHTML = tbjs.TestGUIOptions.html_test_area;
		}
	}
}

/**
 * Sets the stylesheet for the Browser Test JS page, with the given
 * Stylesheet object.
 *
 * @param   {Stylesheet}  ss   Object. Stylesheet object.
 * @returns {void}
 **/
function setStyleSheet(ss) {
	let stylesheet = document.getElementById('bootstrapCSS');
	stylesheet.href = ss.href;
	let keys = Object.keys(ss);
	if (keys.includes("crossorigin")) {
		stylesheet.crossorigin = ss.crossorigin;
	} else {
		stylesheet.crossorigin = DefaultPageStylesheet.crossorigin;
	}
	if (keys.includes("integrity")) {
		stylesheet.integrity = ss.integrity;
	}
	if (keys.includes("rel")) {
		stylesheet.rel = ss.rel;
	} else {
		stylesheet.rel = DefaultPageStylesheet.rel;
	}
}