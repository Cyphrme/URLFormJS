"use strict";

import * as Form from './urlform.js';

export {
	TestBrowserJS
};

/**
 * Browser Test JS Imports
 * @typedef {import('./browsertestjs/test.js').Test} Test
 * @typedef {import('./browsertestjs/test.js').Tests} Tests
 * @typedef {import('./browsertestjs/test.js').TestsToRun} TestsToRun
 * @typedef {import('./browsertestjs/test.js').TestGUIOptions} TestGUIOptions
 * @typedef {import('./browsertestjs/test.js').TestBrowserJS} TestBrowserJS
 *
 * 
 * Application imports
 * @typedef {import ('./urlform.js').FormOptions} FormOptions
 * @typedef {import ('./urlform.js').FormParameters} FormParameters
 */

/**@type {FormOptions} */
const FormOptions = {
	"id": "ExampleUserForm",
	"prefix": 'input_',
	"shareURLBtn": "#ShareURLBtn",
	"shareURL": "#ShareURL",
};

/**@type {FormParameters} */
const FormParameters = [{
		"name": "first_name",
	},
	{
		"name": "middle_name",
	},
	{
		"name": "last_name",
	},
	{
		"name": "email_address",
	},
	{
		"name": "phone_number",
	},
	{
		"name": "subscribe_latest_news",
		"type": "bool",
	},
];

// Example Parsed JSON object for the example user form.
const ExampleValues = {
	"first_name": "Bob",
	"last_name": "Smith",
	"email_address": "bob@something.com",
	"phone_number": "1234567890",
	"subscribe_latest_news": true
};

/**@type {Test} */
let t_InitForm = {
	"name": "Initialize Form",
	"func": test_Init,
	"golden": `https://localhost:8082/?first_name=Bob&last_name=Smith&email_address=bob%40something.com&phone_number=1234567890&subscribe_latest_news=true`
};

/**@type {Test} */
let t_ClearForm = {
	"name": "Clear Form",
	"func": test_Clear,
	"golden": true
};

/**@type {Test} */
let t_PopulateFromURI = {
	"name": "Populate From URI",
	"func": test_PopulateFromURI,
	"golden": true
};
/**@type {Test} */
let t_PopulateFromValues = {
	"name": "Populate From Values",
	"func": test_PopulateFromValues,
	"golden": true
};


////////////////////////////////////////////////////////////////////////////////
//////////////////////    Testing Variables    /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Testing helper function for checking that the form was populated correctly.
function checkForm() {
	let parsd = Form.Objectify();
	if (parsd.email_address !== "bob@something.com") {
		return false;
	}
	if (parsd.first_name !== "Bob") {
		return false;
	}
	if (parsd.last_name !== "Smith") {
		return false;
	}
	if (parsd.phone_number !== "1234567890") {
		return false;
	}
	if (parsd.subscribe_latest_news !== true) {
		return false;
	}
	return true;
}

////////////////////
// Tests
////////////////////

// IsEmpty, Serialize, and Objectify are tests that do not have their own unit
// test, but are all tested within the following unit tests.

// Tests Init().
async function test_Init() {
	var url = new URL(window.location);
	url.searchParams.set('first_name', 'Bob');
	// Optional middle name field not set.
	url.searchParams.set('last_name', 'Smith');
	url.searchParams.set('email_address', 'bob@something.com');
	url.searchParams.set('phone_number', "1234567890");
	url.searchParams.set('subscribe_latest_news', true);

	// Push new state that updates query params without reloading the page.
	window.history.pushState({}, '', url);
	let wait = async () => Form.Init(FormParameters, FormOptions);
	await wait(); // Ensure it is completed before confinuing.
	return document.getElementById('ShareURLBtn').formAction;
};

// Unit test for Clear(), as well as a helper function for URLFormJS testing.
// This test will be ran as a unit test to make sure that it is working properly,
// but may also be called from other tests when running TestsToRun.
async function test_Clear() {
	if (Form.IsEmpty()) {
		// Populate before clearing
		// Manually set each field, to keep this as a unit test and not have to call
		// PopulateFromURI or PopulateFromValues, in case one of those two funcs
		// fail, it can make debugging more difficult.
		document.getElementById('input_first_name').value = ExampleValues.first_name;
		document.getElementById('input_middle_name').value = ExampleValues.middle_name;
		document.getElementById('input_last_name').value = ExampleValues.last_name;
		document.getElementById('input_email_address').value = ExampleValues.email_address;
		document.getElementById('input_subscribe_latest_news').checked = true;
	}
	Form.Clear();
	if (!Form.IsEmpty()) {
		return false;
	}

	return true;
}

// Tests PopulateFromURI().
async function test_PopulateFromURI() {
	Form.PopulateFromURI();
	return checkForm();
};

// Tests PopulateFromValues().
async function test_PopulateFromValues() {
	Form.Clear();
	Form.PopulateFromValues(ExampleValues);
	return checkForm();
};


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
///////////////////////  Interface to BrowserTestJS package  ///////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


/**
 * TestsToRun must be declared at the bottom of the file, as the variables
 * cannot be accessed before initialization.
 * 
 * @type {TestsToRun}
 **/
let TestsToRun = [
	t_InitForm,
	t_ClearForm,
	t_PopulateFromURI,
	t_PopulateFromValues,
];

/** @type {TestGUIOptions} **/
let TestGUIOptions = {
	footer: `<h1><a href="https://github.com/cyphrme/URLFormJS">
	Link to the source code
	</a></h1>`,
	html_test_area: `
	<div>
	<form id="ExampleUserForm">
		<div>
			<input type="text" id="input_first_name" name="input_first_name" placeholder="First Name">
		</div>
		<div>
			<input type="text" id="input_middle_name" name="input_middle_name" placeholder="Middle Name">
		</div>
		<div>
			<input type="text" id="input_last_name" name="input_last_name" placeholder="Last Name">
		</div>
		<div>
			<input type="text" id="input_email_address" name="input_email_address" placeholder="Email Address">
		</div>
		<div>
			<input type="text" id="input_phone_number" name="input_phone_number" placeholder="Phone Number">
		</div>
		<div>
			<label for="input_subscribe_latest_news">Subscribe to the latest news</label>
			<input type="checkbox" id="input_subscribe_latest_news" name="input_subscribe_latest_news">
		</div>
	</form>

	<button id="ShareURLBtn" class="btn mt-3 btn-primary">Share URL</button>
	<div>
		<p><span id="ShareURL"></span></p>
	</div>

</div>
`,
	main_image: "urlformjs.png",
};

/** @type {TestBrowserJS} **/
let TestBrowserJS = {
	TestsToRun,
	TestGUIOptions,
};