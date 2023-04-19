"use strict"

const FormOptions = {
	"prefix": 'input_',
	"shareURLBtn": "#CustomShareURLBtnID",
	"shareURL": "#CustomShareURL",
	"clearBtn": "#CustomClearBtnID",

	"FormParameters": [
		{
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
			"name": "country_select",
		},
		{
			"name": "subscribe",
			"type": "bool",
		},
	],
};




// When the DOM is loaded initializes the `URLFormJS` module, which
// populates the sticky form using the current URL.
document.addEventListener('DOMContentLoaded', () => {
	URLForm.Populate(URLForm.Init(FormOptions));
});