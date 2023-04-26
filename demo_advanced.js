"use strict"


const FormOptions = {
	"prefix": 'input_',
	"shareURLBtn": "#CustomShareURLBtnID",
	"shareURL": "#CustomShareURL",
	"clearBtn": "#CustomClearBtnID",

	"FormParameters": [
		{
			"name": "first_name",
			"queryLocation":"query",
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
			"name": "country_select",
			"defaultValue":1,
		},

		/////////////////
		// Bools
		////////////////
		{
			"name": "subscribe",
			"type": "bool",
		},
		{
			"name": "default_check",
			"type": "bool",
			"defaultValue":true,
		},
		{
			"name": "toggle",
			"type": "bool",
			"saveSetting": true,
		},
		{
			"name": "uri_settable",
			"type": "bool",
		},
		{ // Tests funcTrue and nonFormValue.  
			"name": "customFunction", // A custom Javascript function example that has no form buttons on the page.  
			"type": "bool",
			"funcTrue": () => document.getElementById("customFunction").textContent = "true",
			"nonFormValue":true, // Value that appears in the URL, but is not in the form.  This causes the URL value to be sticky for ShareURL if already set and then can only be removed by manual deletion.  
		},

	],
};




// When the DOM is loaded initializes the `URLFormJS` module, which
// populates the sticky form using the current URL.
document.addEventListener('DOMContentLoaded', () => {
	URLForm.Populate(URLForm.Init(FormOptions));
});