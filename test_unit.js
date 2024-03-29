"use strict"

import './urlform.js' // Namespace exported as 'URLFORMJS'.

export {
	TestBrowserJS
}

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
			"name": "subscribe",
			"type": "bool",
			"saveSetting": true,
		},
		{
			"name": "country_select",
			"saveSetting": true,
		},
		{
			"name": "default_value",
			"defaultValue": true,
			"type": "bool"
		},
		{
			"name": "negative_flag",
			"defaultValue": true,
			"type": "bool"
		},
	]
}


// Example Parsed JSON object for the example user form.
const ExampleValues = {
	"first_name": "Bob",
	"middle_name": "",
	"last_name": "Smith",
	"email_address": "bob@something.com",
	"phone_number": 1234567890,
	"subscribe": "true",
	"country_select": "1",
	"default_value": "true",
	"negative_flag": "true", // Default
	"-negative_flag": "", // Override default
}

/**@type {Test} */
let t_InitForm = {
	"name": "Initialize Form",
	"func": test_Init,
	"golden": ` ?first_name=Bob&last_name=Smith&email_address=bob%40something.com&phone_number=1234567890&subscribe=true&country_select=1&json_payload=%7B%22e%22%3A%22ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%21%23%24%25%26%28%29*%2B%2C.%2F%3A%3C%3D%3E%3F%40%5B%5D%5E_%60%7B%7C%7D%7E%22%7D&default_value=&-negative_flag=`
}

/**@type {Test} */
let t_Clear = {
	"name": "Clear Form",
	"func": test_Clear,
	"golden": true
}

/**@type {Test} */
let t_Populate = {
	"name": "Populate From URI",
	"func": test_Populate,
	"golden": true
}

/**@type {Test} */
let t_PopulateFromValues = {
	"name": "Populate From Values",
	"func": test_PopulateFromValues,
	"golden": true
}

/**@type {Test} */
let t_GetForm = {
	"name": "Get Form",
	"func": test_GetForm,
	"golden": true
}

/**@type {Test} */
let t_GetFormElements = {
	"name": "Get Form Elements",
	"func": test_GetFormElements,
	"golden": true
}

/**@type {Test} */
let t_GetURLKeyValue = {
	"name": "Get URL Key Value Pairs",
	"func": test_GetURLKeyValue,
	"golden": true
}

/**@type {Test} */
let t_SerializeForm = {
	"name": "Serialize Form",
	"func": test_Serialize,
	"golden": `{"first_name":"Bob","last_name":"Smith","email_address":"bob@something.com","phone_number":1234567890,"subscribe":true,"country_select":"1","default_value":true,"negative_flag":true}`
}

/**@type {Test} */
let t_GetDefaultOpts = {
	"name": "Get Default Form Options",
	"func": test_GetDefaultOpts,
	"golden": `{"FormParameters":[{"name":"first_name","queryLocation":"fragment"},{"name":"middle_name","queryLocation":"fragment"},{"name":"last_name","queryLocation":"fragment"},{"name":"email_address","queryLocation":"fragment"},{"name":"phone_number","type":"number","queryLocation":"fragment"},{"name":"subscribe","type":"bool","saveSetting":true,"queryLocation":"fragment"},{"name":"country_select","saveSetting":true,"queryLocation":"fragment"},{"name":"default_value","defaultValue":true,"type":"bool","queryLocation":"fragment"},{"name":"negative_flag","defaultValue":true,"type":"bool","queryLocation":"fragment"}],"prefix":"","shareURLBtn":"#shareURLBtn","shareURL":"#shareURL","shareURLArea":"#shareURLArea","defaultQueryLocation":"fragment","callback":null,"cleanURL":false,"localStorageNamespace":"URLFormJS_","Sanitized":false,"Inited":false,"formID":"","FormMode":false}`
}

/**@type {Test} */
let t_SaveSetting = {
	"name": "Save Setting",
	"func": test_saveSetting,
	"golden": true,
}

/**@type {Test} */
let t_NumberType = {
	"name": "Number Type",
	"func": test_numberType,
	"golden": true,
}

////////////////////////////////////////////////////////////////////////////////
//////////////////////    Testing Variables    /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Testing helper function for checking that the form was populated correctly.
 * @param   {()}      parsd   Object with FormParameters populated. 
 * @returns {Boolean}
 */
function checkForm(parsd) {

	if (parsd.first_name !== "Bob") {
		console.error("Failed on ");
		return false
	}
	if (parsd.last_name !== "Smith") {
		console.error("Failed on last_name");
		return false
	}
	if (parsd.email_address !== "bob@something.com") {
		console.error("Failed on email_address");
		return false
	}
	if (parsd.phone_number !== 1234567890) {
		console.error("Failed on phone_number");
		return false
	}
	if (parsd.subscribe !== true) {
		console.error("Failed on subscribe");
		return false
	}
	if (parsd.default_value !== true) {
		console.error("Failed on default_value");
		return false
	}
	// if (parsd.negative_flag !== false && parsd.negative_flag !== undefined) {
	// 	console.error("Failed on negative_flag");
	// 	return false
	// }
	return true
}

// Testing helper function for populating the form in the GUI with testing values.
function populateGUI() {
	document.getElementById('input_first_name').value = ExampleValues.first_name
	document.getElementById('input_middle_name').value = ExampleValues.middle_name
	document.getElementById('input_last_name').value = ExampleValues.last_name
	document.getElementById('input_email_address').value = ExampleValues.email_address
	document.getElementById('input_phone_number').value = ExampleValues.phone_number
	document.getElementById('input_subscribe').checked = ExampleValues.subscribe
	document.getElementById('input_country_select').value = ExampleValues.country_select
	document.getElementById('input_default_value').checked = ExampleValues.default_value
	document.getElementById('input_negative_flag').checked = ExampleValues["-negative_flag"]
}

////////////////////
// Tests
////////////////////

// IsEmpty does not have its own unit test, but is tested in the unit tests.

// Tests for not reloading the page on URL hash change are not done, because
// the only foreseeable way of accomplishing this is to check if the infinite
// loop of reloading the page is not being hit. To test non page reloads on
// change, it must be done manually.

// Populated from Init. Global form options for testing.
var initedFormOptions

// test_Init removes any existing quag components and sets the test values.  
function test_Init() {
	// Get sanitize base path without query.  e.g. `https://bob.com/joe` 
	var url = new URL(window.location.origin + window.location.pathname)
	url.searchParams.set('first_name', 'Bob')
	// Optional middle name field not set.
	url.searchParams.set('last_name', 'Smith')
	url.searchParams.set('email_address', 'bob@something.com')
	url.searchParams.set('phone_number', 1234567890)
	url.searchParams.set('subscribe', true)
	url.searchParams.set('country_select', "1")
	// Tests JSON objects/escaping as URL values.
	url.searchParams.set('json_payload', JSON.stringify({
		"e": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:<=>?@[]^_`{|}~"
	}))
	url.searchParams.set('default_value', "")
	url.searchParams.set('-negative_flag', "")

	// Push new URL that includes updated query params without reloading the page.
	window.history.pushState({}, '', url)
	initedFormOptions = URLForm.Init(FormOptions)

	// Return golden path.  
	return new URL(document.getElementById('ShareURLBtn').formAction).search
}

// Unit test for Clear(), as well as a helper function for URLFormJS testing.
// This test will be ran as a unit test to make sure that it is working properly,
// but may also be called from other tests when running TestsToRun.
function test_Clear() {
	if (URLForm.IsEmpty(initedFormOptions)) {
		// Populate before clearing
		// Manually set each field, to keep this as a unit test and not have to call
		// Populate or PopulateFromValues, in case one of those two funcs
		// fail, it can make debugging more difficult.
		populateGUI()
	}
	URLForm.Clear(initedFormOptions)
	if (!URLForm.IsEmpty(initedFormOptions)) {
		return false
	}
	return true
}

// Tests Populate().
function test_Populate() {
	URLForm.Populate(initedFormOptions)
	// Additional check for default value that is not in `checkForm`.
	let parsd = URLForm.GetForm(initedFormOptions)
	return checkForm(parsd)
}

// Tests PopulateFromValues().
function test_PopulateFromValues() {
	URLForm.Clear(initedFormOptions)
	URLForm.PopulateFromValues(ExampleValues, initedFormOptions)
	return checkForm(URLForm.GetForm(initedFormOptions))
}

// Tests GetForm().
function test_GetForm() {
	return checkForm(URLForm.GetForm(initedFormOptions))
}

// Tests GetFormElements().
function test_GetFormElements() {
	let elems = URLForm.GetFormElements(initedFormOptions)
	// Example values match the values of the returned elements.
	for (let i in elems) {
		let elemVal = elems[i].value // Always string
		if (typeof ExampleValues[i] === "number") {
			elemVal = Number(elemVal)
		}
		// Sanitize Javascripts `on` for checkboxes
		if (elemVal === "on") {
			elemVal = "true"
		}
		if (elemVal === ExampleValues[i]) {
			continue
		}
		return false
	}
	return true
}

// Tests retrieval of key:value pairs from the URL.
function test_GetURLKeyValue() {
	let pairs = URLForm.GetURLKeyValue(initedFormOptions)
	// Order of fields in golden must be correct.
	let golden = {
		"first_name": "Bob",
		"last_name": "Smith",
		"email_address": "bob@something.com",
		"phone_number": "1234567890",
		"subscribe": "true",
		"country_select": "1",
		"json_payload": "{\"e\":\"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:<=>?@[]^_`{|}~\"}",
		"default_value": "",
		"negative_flag": "false",
	}
	let gv = JSON.stringify(golden);
	let sp = JSON.stringify(pairs);
// console.log(gv, sp);

	return  sp === gv
}

// Tests Serialize().
// TODO this test is not a unit test since it depends on other tests.  
function test_Serialize() {
	let s = URLForm.Serialize(initedFormOptions);
	return s
}

// Tests GetDefaultFormOptions().
function test_GetDefaultOpts() {
	return JSON.stringify(URLForm.GetDefaultFormOptions())
}

// Tests FormParameters options 'saveSetting'.
function test_saveSetting() {
	// Test bool
	let e = document.getElementById('input_subscribe')
	e.checked = false // Sanitize check to be false before 'click'.
	e.click() // Sets local storage value to 'true'.
	let results = localStorage.getItem('URLFormJS_input_subscribe') === 'true'
	if (!results) {
		return results
	}

	// Test non-bool
	// Simulate a change of input for country select. This should set the value
	// in local storage to '1'.
	document.getElementById('input_country_select').dispatchEvent(new Event('input'))
	results = localStorage.getItem('URLFormJS_input_country_select') === '1'

	// Clear out testing state in local storage for next page load.
	localStorage.clear()
	return results
}

// Tests "number" type to ensure that type is always returned as number from
// 'GetForm', and returned as 0 on empty.
function test_numberType() {
	let form = URLForm.GetForm(initedFormOptions) // Form vals populated.
	if (typeof form.phone_number !== "number" || form.phone_number !== ExampleValues.phone_number) {
		return false
	}
	URLForm.Clear(initedFormOptions)
	form = URLForm.GetForm(initedFormOptions, true) // Return zero val on clear.
	if (typeof form.phone_number !== "number" || form.phone_number !== 0) {
		return false
	}
	URLForm.PopulateFromValues(ExampleValues, initedFormOptions) // Populate GUI again.
	return true
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
]

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
		<label for="input_subscribe">Subscribe</label>
			<input type="checkbox" id="input_subscribe" name="input_subscribe">
		</div>
		<div id="defaultValue" >
		<label for="input_default_value">Default Value</label>
			<input type="checkbox" id="input_default_value" name="input_default_value">
		</div>
		<div id="negativeFlag" >
		<label for="input_negative_flag">Negative Flag</label>
			<input type="checkbox" id="input_negative_flag" name="input_negative_flag">
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
	main_image: "../urlformjs.png",
}

/** @type {TestBrowserJS} **/
let TestBrowserJS = {
	TestsToRun,
	TestGUIOptions,
}