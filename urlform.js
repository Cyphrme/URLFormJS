"use strict";

// InitForm() must be called first if the page/form is using `Form Options` or
// if using a `Share URL Button`. 


export {
	Init,
	PopulateFromValues,
	PopulateFromURI,

	// Helpers
	DefaultFormOptions,
	Serialize,
	Parse,
	Clear,
	IsEmpty,
};

/**
 * FormParameter
 * FormParameter should be in this form: 
 *
 * {
 * 	"name":       "Parameter name in the URI.  Is used as the default value for id.  "
 *  "id":         "id of the html element if it differs from 'name'.  Example, URI parameter "retrieve" and html id "Retrieve."
 * 	"type":       "type of the parameter" // Bool, string
 * 	"funcTrue":    ToggleVisible(document.querySelector("#advancedOptions"));
 * }
 * 
 * - name:     Parameter name in the URI.  Is used as the default value for id.
 * 
 * - id:       Id of the html element if it differs from the name.
 *             Example, URI parameter "retrieve" and html id "Retrieve"
 * 
 * - type:     Type of the parameter (bool/string). Defaults to string.
 *
 * - func:     Gets called if set on each call to setGUI (PopulateFromValues and
 *             PopulateFromURI).
 *
 * - funcTrue: Function to execute if param is true. e.g. `"funcTrue": () => {
 *             ToggleVisible(document.querySelector("#advancedOptions"))};`
 *
 * @typedef  {Object}     FormParameter
 * @property {String}     name
 * @property {String}     [id]
 * @property {String}     [type=string]
 * @property {Function}   [func]
 * @property {Function}   [funcTrue]
 * 
 * -----------------------------------------------------------------------------
 * 
 * FormOptions
 * formOptions are in this form:
 * {
 * "prefix": "input_"
 * }
 *
 * - prefix:       Form input prefix which will be prepended to name.
 * - shareURLBtn:  Button element for sharing the form in the URL.
 * - shareURL:     Will share the link as a URL
 * - shareURLArea: Will share the link as a text
 * - callback:     Function that's executed each time the form is processed.  
 *
 * @typedef  {Object}   FormOptions
 * @property {String}   prefix
 * @property {String}   shareURLBtn
 * @property {String}   shareURL
 * @property {String}   shareURLArea
 */

// DefaultFormOptions where all options are set to their zero case.
/**@type {FormOptions} */
const DefaultFormOptions = {
	prefix: "",
	shareURLBtn: "#shareURLBtn",
	shareURL: "#shareURL",
	shareURLArea: "#shareURLArea",
};

// Global FormOptions state, set by InitForm (which calls sanitizeFormOptions)
/**@type {FormOptions} */
var sanitizedFormOptions;
var shareButton;

////////////////////////////
// Functions
///////////////////////////


/**
 * Initializes the globals and event listeners for the formjs module.
 * @param   {FormParameter} params          FormParameters object.
 * @param   {FormOptions}   [formOptions]   formOptions object.
 * @returns {void}
 */
function Init(params, formOptions) {
	sanitizedFormOptions = {};
	sanitizedFormOptions = sanitizeFormOptions(formOptions);
	shareButton = document.querySelector(sanitizedFormOptions.shareURLBtn);
	if (shareButton != null) {
		shareButton.addEventListener('click', () => shareURI(params));
	}
}

/**
 * PopulateFromURI populates the GUI from the URI, if any of the form params
 * are supplied in the URI Query.
 *
 * @param   {FormParameter} params          FormParameters object.
 * @param   {FormOptions}        [formOptions]   A form options object.
 * @returns {void}
 */
async function PopulateFromURI(params, formOptions) {
	if (isEmpty(params)) {
		return;
	}

	var url = new URL(window.location.href);
	// Put parts into an object since searchParams needs to be combined with fragment queries. 
	let pairs = {};
	// Convert the entries into an object.
	for (var pair of url.searchParams.entries()) {
		pairs[pair[0]] = pair[1];
	}

	var frag = window.location.hash.substring(1); //"#" character is pos [0]
	if (!isEmpty(frag)) {
		let p = frag.split('?');
		// // Anchor: (for debugging)
		// let anchor = p[0]; 
		// console.log("Anchor: ", anchor);

		// Fragment query is after # and ?, separated by "&".
		if (!isEmpty(p[1])) {
			let fqs = p[1].split('&');
			fqs.forEach((q) => {
				let fqp = q.split('=');
				if (fqp[1] === undefined) {
					pairs[fqp[0]] = null;
					return;
				}
				// Browsers automatically escape values. Unescape.
				pairs[fqp[0]] = unescape(fqp[1]);
			});
		}
	}

	if (isEmpty(pairs)) {
		return;
	}

	PopulateFromValues(params, pairs, formOptions);
	shareURI(params);
}

/**
 * Populates the GUI from the given values and params.
 * Params describes the model, or what options are available in the form, and
 * Values are the given values to populate the form.
 * 
 * An optional formOptions object may be used to specify certain aspects, or how
 * to interpret the form. e.g. `prefix`, so model_name becomes input_model_name
 * if the formOptions prefix setting is set to "input_".
 * 
 * @param   {FormParameter}  params          A Param object.
 * @param   {Object}         values          A values object.
 * @param   {FormOptions}    formOptions     A parsed/sanitized form options object.
 * @returns {void}
 */
function PopulateFromValues(params, values, formOptions) {
	if (!isEmpty(params)) {
		setGUI(params, values, sanitizeFormOptions(formOptions));
	}
}

/**
 * Does the processing and checking for a parameter in the params form.
 * Sets GUI for each param, and executes funcTrue() per param, if applicable.
 *
 * @param   {FormParameter} params          Object. FormParameters object.
 * @param   {Object}        values          Object. Values object that holds a value for the given name.
 * @param   {FormOptions}   formOpts        Object. sanitizeFormOptions.
 * @returns {void}
 */
function setGUI(params, values, formOpts) {
	for (const parameter in params) {
		let name = params[parameter].name;
		let id = params[parameter].id;
		let type = params[parameter].type;
		let value = values[name];
		let funcTrue = params[parameter].funcTrue;

		name = formOpts.prefix + name;

		// If id is empty, assume name is the id on the page.
		if (isEmpty(id)) {
			id = name;
		}

		// Run func if set
		if (func !== undefined) {
			params[parameter].func();
		}

		// Run funcTrue. Value may be "true", or empty "" if in the URL and with no
		// value set, but not `undefined`.  Name only is considered a flag and is
		// interpreted as true.  
		if (type == "bool" && funcTrue !== undefined && value !== undefined && (value === "" || value === "true" || value === true)) {
			// console.debug("Running funcTrue for: ", params[parameter]);
			params[parameter].funcTrue();
		}

		// Sets the GUI if the value is populated. Checks checkbox elements if
		// type=bool and otherwise sets the value of the element based on the given
		// name.
		if (!isEmpty(value)) {
			if (type == "bool" && (value == "true" || value === true)) {
				let e = document.getElementById(id);
				if (e != null) {
					e.checked = true;
				}
				continue;
			}

			let e = document.getElementById(id);
			if (e != null) {
				e.value = value;
			}
		}
	}
}


/**
 * Sanitizes a formOptions object, and sets all of the options types to their
 * zero case, if they are not set. Otherwise, the options will be set.
 * 
 * Modifies "in place" as well as returns the object. 
 * 
 * Returns a Form Options Object, after being sanitized.
 * 
 * @param   {FormOptions} formOptions  A form options object.
 * @returns {Object}      FormOptions
 */
function sanitizeFormOptions(formOptions) {
if (formOptions.FormJs_Sanitized === true){
	return;
}
	let formOpts = { // TODO (Jared) fix this.  No need to ever copy
		...DefaultFormOptions
	};
	if (isEmpty(formOptions)) {
		return formOpts;
	}
	if (!isEmpty(formOptions.prefix)) {
		formOpts.prefix = formOptions.prefix;
	}
	if (!isEmpty(formOptions.shareURLArea)) {
		formOpts.shareURLArea = formOptions.shareURLArea;
	}
	if (!isEmpty(formOptions.shareURL)) {
		formOpts.shareURL = formOptions.shareURL;
	}
	if (!isEmpty(formOptions.shareURLBtn)) {
		formOpts.shareURLBtn = formOptions.shareURLBtn;
	}

	formOpts.FormJs_Sanitized = true;
	return formOpts;
}


/**
 * Generates a share URL, populates the GUI with it, and returns the URL.
 * 
 * @param   {FormParameter}   params       Form parameters object.
 * @returns {URL}             URL          Object. Javascript URL object.
 */
function shareURI(params) {
	var url = new URL(window.location.href);

	for (const parameter in params) {
		var name = params[parameter].name;
		var id = params[parameter].id;
		var type = params[parameter].type;

		// `name` is default id for html element. `id` overrides `name` for html
		// elements ids.
		let htmlID = name;
		if (!isEmpty(id)) {
			htmlID = id
		}

		var elem = document.getElementById(sanitizedFormOptions.prefix + htmlID);
		let value;
		if (elem !== null) {
			value = elem.value;
			if (type == "bool") {
				if (elem.checked) {
					value = "true";
				} else {
					value = "";
				}
			}
		}
		if (!isEmpty(value)) {
			url.searchParams.set(name, value);
		} else {
			// Cleans out value from string in case it is set in the URI already.
			// (e.g. bools on false will not be cleared)
			url.searchParams.delete(name);
		}
	}

	//Remove hash if there's nothing in it."#" character is pos [0]
	if (isEmpty(url.hash.substring(1))) {
		url.hash = "";
	}
	// console.log("Share URI Link: ", url.href);

	// URI Link

	let shareUrl = document.querySelector(sanitizedFormOptions.shareURL);
	if (shareUrl != null) {
		shareUrl.innerHTML = url.href.link(url.href);
	}

	// Text Area 
	let shareArea = document.querySelector(sanitizedFormOptions.shareURLArea);
	if (shareArea != null) {
		shareArea.innerHTML = url.href;
	}

	return url;
};

/**
 * Serialize serialize a form into JSON string.
 * 
 * @param   {Element} form        Object. HTML Form element
 * @returns {string}  serialized  String. Stringed form.
 * @throws  {Error}   error       Error. Fails if form is not of type HTMLFormElement.
 */
function Serialize(form) {
	return JSON.stringify(Parse(form));
};

/**
 * Parse parses a form into a JSON object.
 * 
 * @param   {HTMLFormElement} form    Object. HTML Form element
 * @returns {Object}  parsd           Object. JSON form.
 * @throws  {Error}   error           Error. Fails if form is not of type HTMLFormElement.
 */
function Parse(form) { // TODO (Jared) rename objectify
	var formData = new FormData(form); // throws
	var pairs = {};
	for (let [name, value] of formData) {
		if (value == "true" || value == "on") {
			value = true;
		}
		if (value == "false" || value == "unchecked") {
			value = false;
		}
		// TODO (Jared) This should probably not be hardcoded and come from a formOptions param.
		if (name.substring(0, 6) == "input_") {
			name = name.substring(6);
		}
		if (!isEmpty(value)) {
			pairs[name] = value;
		}
	}
	return pairs;
};


/**
 * Clear clears out a form with the given FormParameters and FormOptions.
 *
 * @param   {FormParameter} params          Object. FormParameters object.
 * @param   {FormOptions}   formOpts        Object. sanitizeFormOptions.
 * @returns {void}
 */
 function Clear(params, formOpts) {
	sanitizeFormOptions(formOpts)
	for (const parameter in params) {
		let name = formOpts.prefix + params[parameter].name;
		let id = params[parameter].id;
		let type = params[parameter].type;

		// If id is empty, assume name is the id on the page.
		if (isEmpty(id)) {
			id = name;
		}

		// Clears the GUI. Unchecks checkbox elements if type=bool and otherwise
		// sets the value of the element to "";
		if (type == "bool") {
			let e = document.getElementById(id);
			if (e != null) {
				e.checked = false;
			}
			continue;
		}

		let e = document.getElementById(id);
		if (e != null) {
			e.value = "";
		}
	}
}


/**
 * IsEmpty returns whether or not a given form is empty.
 * 
 * @param   {Element}  form        Object.  HTML Form element
 * @returns {Boolean}  bool        Boolean. Whether or not the form is empty.
 * @throws  {Error}    error       Error.   Fails if form is not of type HTMLFormElement.
 */
function IsEmpty(form) {
	return isEmpty(Parse(form));
}



/**
 * isEmpty is a helper function to determine if thing is empty. 
 * 
 * Functions are considered always not empty. 
 * 
 * Arrays are checked for the number of elements, and recursively calls isEmpty.  
 * 
 * Objects are empty if they have no keys. (Returns len === 0 of object keys.)
 * 
 * NaN returns true.  (NaN === NaN is always false, as NaN is never equal to
 * anything. NaN is the only JavaScript value unequal to itself.)
 *
 * Don't use on HTMl elements. For HTML elements, use the !== equality check
 * (element !== null). 
 *
 * Cannot use CryptoKey with this function since (len === 0) always. 
 *
 * @param   {any}     thing    Thing you wish was empty.  
 * @returns {boolean}          Boolean.  
 */
function isEmpty(thing) {
	if (typeof thing === 'function') {
		return false;
	}

	if (Array.isArray(thing)) {
		return isEmpty(thing[0]);
	}

	if (thing === Object(thing)) {
		if (Object.keys(thing).length === 0) {
			return true;
		}
		return false;
	}

	if (!isBool(thing)) {
		return true;
	}
	return false
};


/**
 * Helper function to determine boolean.  
 *
 * Javascript, instead of considering everything false except a few key words,
 * decided everything is true instead of a few key words.  Why?  Because
 * Javascript.  This function inverts that assumption, so that everything can be
 * considered false unless true. 
 *
 * @param   {any}      bool   Thing that you wish was a boolean.  
 * @returns {boolean}         An actual boolean.
 */
function isBool(bool) {
	if (
		bool === false ||
		bool === "false" ||
		bool === undefined ||
		bool === "undefined" ||
		bool === "" ||
		bool === 0 ||
		bool === "0" ||
		bool === null ||
		bool === "null" ||
		bool === "NaN" ||
		Number.isNaN(bool) ||
		bool === Object(bool) // isObject
	) {
		return false;
	}
	return true;
};