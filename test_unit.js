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
 * Application imports
 * @typedef {import ('./urlform.js').FormOptions} FormOptions
 */

/**@type {FormOptions} */
const FormOptions = {
	"prefix": 'input_',
	"shareURLBtn": "#ShareURLBtn",
	"shareURL": "#ShareURL",
};

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
	"func": test_InitForm,
	"golden": `https://localhost:8082/?first_name=Bob&last_name=Smith&email_address=bob%40something.com&phone_number=1234567890&subscribe_latest_news=true`
};

/**@type {Test} */
let t_ClearForm = {
	"name": "Clear Form",
	"func": test_ClearForm,
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
function checkForm(f) {
	let parsd = Form.Parse(f);
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

// IsFormEmpty, Serialize, and Parse are tests that do not have their own unit
// test, but are all tested within the following unit tests.

// Tests InitForm().
async function test_InitForm() {
	let wait = async () => Form.InitForm(FormParameters, FormOptions);
	await wait(); // Ensure it is completed before confinuing.
	return document.getElementById('ShareURLBtn').formAction;
};

// Unit test for ClearForm(), as well as a helper function for FormJS testing.
// This test will be ran as a unit test to make sure that it is working properly,
// but may also be called from other tests when running TestsToRun.
async function test_ClearForm() {
	// Form element used for examples and testing in FormJS.
	let ExampleForm = document.getElementById('ExampleUserForm');
	if (Form.IsFormEmpty(ExampleForm)) {
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
	Form.ClearForm(FormParameters, FormOptions);
	if (!Form.IsFormEmpty(ExampleForm)) {
		return false;
	}

	return true;
}

// Tests PopulateFromURI(), as well as Serialize().
async function test_PopulateFromURI() {
	var url = new URL(window.location);
	url.searchParams.set('first_name', 'Bob');
	// Optional middle name field not set.
	url.searchParams.set('last_name', 'Smith');
	url.searchParams.set('email_address', 'bob@something.com');
	url.searchParams.set('phone_number', "1234567890");
	url.searchParams.set('subscribe_latest_news', true);

	// Push new state that updates query params without reloading the page.
	window.history.pushState({}, '', url);

	Form.PopulateFromURI(FormParameters, FormOptions);
	return checkForm(document.getElementById('ExampleUserForm'));
};

// Tests PopulateFromValues(), as well as Serialize().
async function test_PopulateFromValues() {
	Form.ClearForm(FormParameters, FormOptions);
	Form.PopulateFromValues(FormParameters, ExampleValues, FormOptions);
	return checkForm(document.getElementById('ExampleUserForm'));
};


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
///////////////////////  Interface to browsertestjs package  ///////////////////
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
	footer: `<h1><a href="github.com/cyphrme/formjs">
	Link to the source code
	</a></h1>`,
	html_test_area: `
	<div>
	<form id="ExampleUserForm">
		<div>
			<input type="text" id="input_first_name" name="first_name" placeholder="First Name">
		</div>
		<div>
			<input type="text" id="input_middle_name" name="middle_name" placeholder="Middle Name">
		</div>
		<div>
			<input type="text" id="input_last_name" name="last_name" placeholder="Last Name">
		</div>
		<div>
			<input type="text" id="input_email_address" name="email_address" placeholder="Email Address">
		</div>
		<div>
			<input type="text" id="input_phone_number" name="phone_number" placeholder="Phone Number">
		</div>
		<div>
			<label for="input_subscribe_latest_news">Subscribe to the latest news</label>
			<input type="checkbox" id="input_subscribe_latest_news" name="subscribe_latest_news">
		</div>
	</form>

	<button id="ShareURLBtn" class="btn mt-3 btn-primary">Share URL</button>
	<div>
		<p><span id="ShareURL"></span></p>
	</div>

</div>
`,
	main_image: "formjs.png",
	stylesheet: {
		href: "cyphrme_bootstrap.min.css"
	},

};

/** @type {TestBrowserJS} **/
let TestBrowserJS = {
	TestsToRun,
	TestGUIOptions,
};