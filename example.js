"use strict"

import * as Form from './urlform.js';

// An application may use the prefix "input_" to denote user modifiable fields
// in the GUI, use a custom id for the ShareURL button, or a custom id for the
// share URL link.
const FormOptions = {
	// Required
	"id": "ExampleUserForm",
	// Optional
	"prefix": 'input_',
	"shareURLBtn": "#CustomShareURLBtnID",
	"shareURL": "#CustomShareURL",
};

// Permissable fields within the form for the application.
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

// Runs when the DOM is loaded. Initializes the `URLFormJS` module, and then
// populates the sticky form from the given URL query parameters.
document.addEventListener('DOMContentLoaded', () => {
	// What if I wanted to see an empty form?  When testing the demo, this
	// behavior is not clear. Instead of this, the link should include the
	// options.
	// if (window.location.search === "" && window.location.hash === "") {
	// 	var url = new URL(window.location);
	// 	url.searchParams.set('first_name', 'Bob');
	// 	// Middle name purposefully not set for demonstation.
	// 	url.searchParams.set('last_name', 'Smith');
	// 	url.searchParams.set('email_address', 'bob@something.com');
	// 	url.searchParams.set('phone_number', "1234567890");
	// 	url.searchParams.set('subscribe_latest_news', true);
	// 	// Push new state that updates query params without reloading the page.
	// 	window.history.pushState({}, '', url);
	// }

	// Initialize and populate sticky form.
	Form.Init(FormParameters, FormOptions);
	Form.PopulateFromURI();
	console.debug(Form.DefaultFormOptions);
	console.debug(Form.FormOptions);
	console.debug(Form.FormParameters);

});