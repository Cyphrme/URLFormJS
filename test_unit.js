"use strict";

import './urlform.js'; // Namespace exported as 'URLFORMJS'.

export {
	TestBrowserJS
};

/**
 * Browser Test JS Imports
 * @typedef {import('./browsertestjs/test.js').Test}            Test
 * @typedef {import('./browsertestjs/test.js').Tests}           Tests
 * @typedef {import('./browsertestjs/test.js').TestsToRun}      TestsToRun
 * @typedef {import('./browsertestjs/test.js').TestGUIOptions}  TestGUIOptions
 * @typedef {import('./browsertestjs/test.js').TestBrowserJS}   TestBrowserJS
 *
 * 
 * Application imports
 * @typedef {import ('./urlform.js').FormOptions}    FormOptions
 * @typedef {import ('./urlform.js').FormParameters} FormParameters
 */

/**@type {FormOptions} */
const FormOptions = {
	"id": "ExampleUserForm",
	"prefix": 'input_',
	"shareURLBtn": "#ShareURLBtn",
	"shareURL": "#ShareURL",
	"FormParameters": [{
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
			"type": "number",
		},
		{
			"name": "subscribe_latest_news",
			"type": "bool",
			"saveSetting": true,
		},
		{
			"name": "country_select",
			"saveSetting": true,
		},
	]
};


// Example Parsed JSON object for the example user form.
const ExampleValues = {
	"first_name": "Bob",
	"middle_name": "",
	"last_name": "Smith",
	"email_address": "bob@something.com",
	"phone_number": 1234567890,
	"subscribe_latest_news": "true",
	"country_select": "1",
};

/**@type {Test} */
let t_InitForm = {
	"name": "Initialize Form",
	"func": test_Init,
	"golden": `https://localhost:8082/?first_name=Bob&last_name=Smith&email_address=bob%40something.com&phone_number=1234567890&subscribe_latest_news=true&country_select=1&json_payload=%7B%22e%22%3A%22ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%21%23%24%25%26%28%29*%2B%2C.%2F%3A%3B%3C%3D%3E%3F%40%5B%5D%5E_%60%7B%7C%7D%7E%22%7D`
};

/**@type {Test} */
let t_Clear = {
	"name": "Clear Form",
	"func": test_Clear,
	"golden": true
};

/**@type {Test} */
let t_Populate = {
	"name": "Populate From URI",
	"func": test_Populate,
	"golden": true
};

/**@type {Test} */
let t_PopulateFromValues = {
	"name": "Populate From Values",
	"func": test_PopulateFromValues,
	"golden": true
};

/**@type {Test} */
let t_GetForm = {
	"name": "Get Form",
	"func": test_GetForm,
	"golden": true
};

/**@type {Test} */
let t_GetFormElements = {
	"name": "Get Form Elements",
	"func": test_GetFormElements,
	"golden": true
};

/**@type {Test} */
let t_GetURLKeyValue = {
	"name": "Get URL Key Value Pairs",
	"func": test_GetURLKeyValue,
	"golden": true
};

/**@type {Test} */
let t_SerializeForm = {
	"name": "Serialize Form",
	"func": test_Serialize,
	"golden": `{"first_name":"Bob","last_name":"Smith","email_address":"bob@something.com","phone_number":1234567890,"subscribe_latest_news":true,"country_select":"1"}`
};

/**@type {Test} */
let t_GetDefaultOpts = {
	"name": "Get Default Form Options",
	"func": test_GetDefaultOpts,
	"golden": `{"FormParameters":[{"name":"first_name","queryLocation":"fragment"},{"name":"middle_name","queryLocation":"fragment"},{"name":"last_name","queryLocation":"fragment"},{"name":"email_address","queryLocation":"fragment"},{"name":"phone_number","type":"number","queryLocation":"fragment"},{"name":"subscribe_latest_news","type":"bool","saveSetting":true,"queryLocation":"fragment"},{"name":"country_select","saveSetting":true,"queryLocation":"fragment"}],"prefix":"","shareURLBtn":"#shareURLBtn","shareURL":"#shareURL","shareURLArea":"#shareURLArea","defaultQueryLocation":"fragment","callback":null,"cleanURL":false,"localStorageNamespace":"URLFormJS_","Sanitized":false,"Inited":false,"formID":"","FormMode":false}`
};

/**@type {Test} */
let t_SaveSetting = {
	"name": "Save Setting",
	"func": test_saveSetting,
	"golden": true,
};

/**@type {Test} */
let t_NumberType = {
	"name": "Number Type",
	"func": test_numberType,
	"golden": true,
};

////////////////////////////////////////////////////////////////////////////////
//////////////////////    Testing Variables    /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Testing helper function for checking that the form was populated correctly.
 * @param   {()}      parsd   Object with FormParameters populated. 
 * @returns {Boolean}
 */
function checkForm(parsd) {
	if (parsd.email_address !== "bob@something.com") {
		return false;
	}
	if (parsd.first_name !== "Bob") {
		return false;
	}
	if (parsd.last_name !== "Smith") {
		return false;
	}
	if (parsd.phone_number !== 1234567890) {
		return false;
	}
	if (parsd.subscribe_latest_news !== true) {
		return false;
	}
	return true;
}

// Testing helper function for populating the form in the GUI with testing values.
function populateGUI() {
	document.getElementById('input_first_name').value = ExampleValues.first_name;
	document.getElementById('input_middle_name').value = ExampleValues.middle_name;
	document.getElementById('input_last_name').value = ExampleValues.last_name;
	document.getElementById('input_email_address').value = ExampleValues.email_address;
	document.getElementById('input_phone_number').value = ExampleValues.phone_number;
	document.getElementById('input_subscribe_latest_news').checked = ExampleValues.subscribe_latest_news;
	document.getElementById('input_country_select').value = ExampleValues.country_select;
}

////////////////////
// Tests
////////////////////

// IsEmpty does not have its own unit test, but is tested in the unit tests.

// Populated from Init. Global form options for testing.
var initedFormOptions;

// Tests Init().
function test_Init() {
	var url = new URL(window.location.origin);
	url.searchParams.set('first_name', 'Bob');
	// Optional middle name field not set.
	url.searchParams.set('last_name', 'Smith');
	url.searchParams.set('email_address', 'bob@something.com');
	url.searchParams.set('phone_number', 1234567890);
	url.searchParams.set('subscribe_latest_news', true);
	url.searchParams.set('country_select', "1");
	// Tests JSON objects/escaping as URL values.
	url.searchParams.set('json_payload', JSON.stringify({
		"e": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~"
	}));

	// Push new state that updates query params without reloading the page.
	window.history.pushState({}, '', url);
	initedFormOptions = URLForm.Init(FormOptions);
	return document.getElementById('ShareURLBtn').formAction;
};

// Unit test for Clear(), as well as a helper function for URLFormJS testing.
// This test will be ran as a unit test to make sure that it is working properly,
// but may also be called from other tests when running TestsToRun.
function test_Clear() {
	if (URLForm.IsEmpty(initedFormOptions)) {
		// Populate before clearing
		// Manually set each field, to keep this as a unit test and not have to call
		// Populate or PopulateFromValues, in case one of those two funcs
		// fail, it can make debugging more difficult.
		populateGUI();
	}
	URLForm.Clear(initedFormOptions);
	if (!URLForm.IsEmpty(initedFormOptions)) {
		return false;
	}

	return true;
}

// Tests Populate().
function test_Populate() {
	URLForm.Populate(initedFormOptions);
	return checkForm(URLForm.GetForm(initedFormOptions));
};

// Tests PopulateFromValues().
function test_PopulateFromValues() {
	URLForm.Clear(initedFormOptions);
	URLForm.PopulateFromValues(ExampleValues, initedFormOptions);
	return checkForm(URLForm.GetForm(initedFormOptions));
};

// Tests GetForm().
function test_GetForm() {
	return checkForm(URLForm.GetForm(initedFormOptions));
}

// Tests GetFormElements().
function test_GetFormElements() {
	let elems = URLForm.GetFormElements(initedFormOptions);
	// Example values match the values of the returned elements.
	for (let i in elems) {
		let elemVal = elems[i].value; // Always string
		if (typeof ExampleValues[i] === "number") {
			elemVal = Number(elemVal);
		}
		if (elemVal === ExampleValues[i]) {
			continue;
		}
		return false;
	}
	return true;
}

// Tests retrieval of key:value pairs from the URL.
function test_GetURLKeyValue() {
	let pairs = URLForm.GetURLKeyValue(initedFormOptions);
	let golden = {
		"first_name": "Bob",
		"last_name": "Smith",
		"email_address": "bob@something.com",
		"phone_number": "1234567890",
		"subscribe_latest_news": "true",
		"country_select": "1",
		"json_payload": "{\"e\":\"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~\"}"
	}
	return JSON.stringify(pairs) === JSON.stringify(golden);
}

// Tests Serialize().
function test_Serialize() {
	return URLForm.Serialize(initedFormOptions);
}

// Tests GetDefaultFormOptions().
function test_GetDefaultOpts() {
	return JSON.stringify(URLForm.GetDefaultFormOptions());
}

// Tests FormParameters options 'saveSetting'.
function test_saveSetting() {
	// Test bool
	let e = document.getElementById('input_subscribe_latest_news');
	e.checked = false; // Sanitize check to be false before 'click'.
	e.click(); // Sets local storage value to 'true'.
	let results = localStorage.getItem('URLFormJS_input_subscribe_latest_news') === 'true';
	if (!results) {
		return results;
	}

	// Test non-bool
	// Simulate a change of input for country select. This should set the value
	// in local storage to '1'.
	document.getElementById('input_country_select').dispatchEvent(new Event('input'));
	results = localStorage.getItem('URLFormJS_input_country_select') === '1';

	// Clear out testing state in local storage for next page load.
	localStorage.clear();
	return results;
}

// Tests "number" type to ensure that type is always returned as number from
// 'GetForm', and returned as 0 on empty.
function test_numberType() {
	let form = URLForm.GetForm(initedFormOptions); // Form vals populated.
	if (typeof form.phone_number !== "number" || form.phone_number !== ExampleValues.phone_number) {
		return false;
	}
	URLForm.Clear(initedFormOptions);
	form = URLForm.GetForm(initedFormOptions, true); // Return zero val on clear.
	if (typeof form.phone_number !== "number" || form.phone_number !== 0) {
		return false;
	}
	URLForm.PopulateFromValues(ExampleValues, initedFormOptions); // Populate GUI again.
	return true;
}


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
	t_Clear,
	t_Populate,
	t_PopulateFromValues,
	t_GetForm,
	t_GetFormElements,
	t_GetURLKeyValue,
	t_SerializeForm,
	t_GetDefaultOpts,
	t_SaveSetting,
	t_NumberType,
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
		<div class="d-flex justify-content-center">
		<div class="form-floating w-40">
			<select title="Example country codes for (alphabetically) first,last, and United States." 
			class="form-select" id="input_country_select" name="input_country_select">
			<option disabled selected value> -- select a country -- </option>
			<option value="1">United States</option>
			<option value="93">Afghanistan</option>
			<option value="263">Zimbabwe</option>
			</select>
			<label class="text-start" for="input_country_select">Country</label>
		</div>
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