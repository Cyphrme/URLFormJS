"use strict";

export {
	Run,
}

// Test will call .trim() on string's golden and returned values.  

/**
 * -----------------------------------------------------------------------------
 *
 * Test defines a test to be run.
 *
 * - name:   Name of the test to display to the user.
 * - func:   Test function to execute.
 * - golden: Correct return value for the test.
 *
 * @typedef  {Object}      Test
 * @property {String}      name
 * @property {Function}    func
 * @property {String}      golden
 *
 * -----------------------------------------------------------------------------
 *
 * Tests defines an array of `Test` objects to be run.
 * @typedef  {Array<Test>} Tests
 *
 * -----------------------------------------------------------------------------
 *
 * TestsToRun defines the tests that will be ran on the Browser Test JS page.
 * @typedef  {Tests} TestsToRun
 *
 * -----------------------------------------------------------------------------
 *
 * Stylesheet is the object for displaying CSS/stylesheets on the test page.
 *
 * - href:        The link to the stylesheet. Required.
 * - rel:         The relationship between the linked source and current
 *                document. Defaults to "stylesheet"
 * - integrity:   The digest/checksum for the given source/stylesheet.
 * - crossorigin: Sets the crossorigin for requests to the resource.
 *
 * @typedef  {Object}  Stylesheet
 * @property {String}  href
 * @property {String}  [rel]
 * @property {String}  [integrity]
 * @property {String}  [crossorigin]
 *
 * -----------------------------------------------------------------------------
 *
 * TestGUIOptions defines options for the Browser Test JS Testing page. All
 * options are optional, and will use the default if not proivded.
 *
 * Currently supported options:
 *
 * For 'header', 'footer', and any other Custom HTML elements:
 * These options must be written as HTML, but encapsulated in a string. If set,
 * the string will be used as the inner HTML and appended to the custom portion
 * of the page.
 * 
 * 'header' and 'stylesheet' are mutually exclusive, with 'header' taking
 * precedence. If they are both set, `header` will be used. If just wanting
 * to use a custom stylesheet, `stylesheet` must be set, and `header` must not.
 * If wanting a custom header and stylesheet, the custom stylesheet must go in
 * the `header`, and header must be set.
 * 
 * - header:          Custom header.
 * - stylesheet:      Custom stylesheet.
 * - footer:          Custom footer.
 * - main_image:      Custom main image.
 * - html_test_area:  Custom HTML for testing and page customization.
 *
 * @typedef  {Object}             TestGUIOptions
 * @property {Stylesheet}         [header]
 * @property {Stylesheet}         [stylesheet]
 * @property {String=Element}     [footer]
 * @property {String=Image}       [main_image]
 * @property {Stylesheet}         [html_test_area]
 *
 * -----------------------------------------------------------------------------
 *
 * TestBrowserJS defines an object for projects/packages to interact with the
 * browsertestjs library.
 *
 * When Browser Test JS page is loaded, it will attempt to retrieve the
 * TestBrowserJS object from the `unit_test.js` file. It will use this object to
 * 1.) Run the tests 2.) Make modifications to the GUI.
 *
 * - TestsToRun:  Holds the tests to be ran for the given application/package.
 * - TestOptions: Holds the options to be used for the GUI.
 *
 * @typedef  {Object}           TestBrowserJS
 * @property {TestsToRun}       TestsToRun
 * @property {TestGUIOptions}   TestGUIOptions
 *
 * -----------------------------------------------------------------------------
 */

let totalTestsToRun = 0;
let totalTestsRan = 0;
let testPastCount = 0;
let testFailCount = 0;

// Template for displaying test results in the GUI. Must be cloned.
const jsResultTemplate = document.getElementById('js_test_results');

/**
 * Runs all of the tests in the 'TestsToRun' array.
 * @param   {Tests} tests
 * @returns {void}
 */
async function Run(tests) {
	totalTestsToRun = Object.entries(tests).length;
	let values = Object.values(tests);
	for (let i = 0; i < totalTestsToRun; i++) {
		var test = {};
		test.name = values[i].name;
		test.golden = values[i].golden;
		try {
			test.result = await values[i].func();
		} catch (err) {
			console.error(err);
			test.result = err;
		}
		appendResult(test);
	}
	stats();
};

/**
 * stats displays statistics about the tests that are being run, out to the
 * screen. It will show the tests that ran, and which passed and failed.
 *
 * @returns {void}          Displays the stats on the page.
 */
async function stats() {
	document.getElementById("totalTestsToRun").innerText = totalTestsToRun;
	document.getElementById("totalTestsRan").innerText = totalTestsRan;
	document.getElementById("testPastCount").innerText = testPastCount;
	document.getElementById("testFailCount").innerText = testFailCount;

	document.getElementById("testsRunning").hidden = true;
	if (testFailCount == 0) {
		document.getElementById("testsPassed").hidden = false;
	} else {
		document.getElementById("testsFailed").hidden = false;
	}
};

/**
 * appendResults appends the results to the div on the page.
 *
 * @param {Object} obj            The object that holds the name of the test,
 *                                function, expected result, and actual results.
 * @returns {void}
 */
function appendResult(obj) {
	let clone = jsResultTemplate.content.cloneNode(true);
	let test = "" + obj.name + "\: ";

	if (typeof obj.golden == "string") {
		// Trim outer strings making tests easier to write.  
		var failed = (obj.result.trim() != obj.golden.trim())
	} else {
		failed = obj.result != obj.golden
	}
	if (failed) {
		console.error("❌ Failed.  Got: " + obj.result + " Expected: " + obj.golden);
		test += "❌ Failed";
		clone.querySelector('div').classList.add("text-danger")
		clone.querySelector('.result').textContent = "Got: " + obj.result;
		clone.querySelector('.expected').innerHTML = "Expected: " + obj.golden;
		testFailCount++;
	} else {
		// Test Passed
		clone.querySelector('div').classList.add("text-success")
		test += "✅ Passed";
		testPastCount++;
	}
	totalTestsRan++;

	clone.querySelector('.test').textContent = test;
	document.getElementById("testsResultsList").append(clone);
};