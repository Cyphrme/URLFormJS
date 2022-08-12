"use strict";

/**
 * URLFormJS is used for sticky forms and sharable URL links.
 * URLFormJS also use `Fragments` heavily. See README.
 * 
 * `Init()` must be called with the `FormOptions` object.
 * 
 * Certain elements, such as the ShareURL Button, if being used, must specify
 * the Element's id on the page in `FormOptions`, before calling `Init()`.
 * 
 * `id` is required in `FormOptions` for `Init()` to properly initialize the
 * form with all of the exported functions from this module that require the
 * HTMLFormElement.
 * 
 * All functions require `Init()` to be called before execution:
 *
 * DefaultFormOptions is exported, for READ ONLY capabilities of seeing default
 * `FormOptions`.
 * 
 * FormOptions shows the `FormOptions` for the initialized form.
 * 
 * FormParameters shows the `FormParameters` for the initialized form.
 */

export {
	// Required for initializing a form.
	Init,

	// Helpers
	DefaultFormOptions,
	FormOptions,
	FormParameters,

	PopulateFromValues,
	PopulateFromURI,

	Serialize,
	Objectify,
	Clear,
	IsEmpty,
};

/**
 * FormParameter
 * FormParameter are the options for a form's field/parameter.
 *
 * Example:
 * {
 *  "name":       "Parameter name in the URI.  Is used as the default value for
 *  id.  " "id":         "id of the html element if it differs from 'name'.
 *  Example, URI parameter "retrieve" and html id "Retrieve." "type":
 *  "type of the parameter" // Bool, string "funcTrue":
 *  ToggleVisible(document.querySelector("#advancedOptions"));
 * }
 *
 * - name:          Parameter name in the URI.  Is used as the default value for
 *                  id.
 *
 * - id:            Id of the html element if it differs from the name. Example,
 *                  URI parameter "retrieve" and html id "Retrieve"
 *
 * - type:          Type of the parameter (bool/string). Defaults to string.
 *
 * - func:          Gets called if set on each call to setGUI
 *                  (PopulateFromValues and PopulateFromURI).
 *
 * - funcTrue:      Function to execute if param is true. e.g. `"funcTrue": ()
 *                  => {
 *                  ToggleVisible(document.querySelector("#advancedOptions"))};`
 *
 * - queryLocation: Form wide option for overriding the share URL link to either
 *                  be a query parameter, or a fragment query.
 * @typedef  {object}     FormParameter
 * @property {string}     name
 * @property {string}     [id]
 * @property {string}     [type=string]
 * @property {function}   [func]
 * @property {function}   [funcTrue]
 * @property {string}     [queryLocation="fragment"]
 *
 *
 * FormParameters FormParameters is the main form object that holds the
 * different FormParameter field objects.
 *
 * - id:            HTMLFormElement ID on the page.
 * - formParameter: `FormParameter` object(s) for each form field.
 * @typedef   {Array<FormParameter>} FormParameters
 * @property  {...FormParameter}     formParameter
 * 
 *
 * FormOptions formOptions are in this form:
 * {
 * "id":"ExampleUserForm",
 * "prefix": "input_"
 * }
 *
 * ** Required fields:
 * 
 * - id:            HTMLFormElement ID on the page for the initialized form.
 * 
 * ** Optional fields:
 * 
 * - prefix:        Form input prefix which will be prepended to name.
 * - shareURLBtn:   Button element for sharing the form in the URL.
 * - shareURL:      Will share the link as a URL.
 * - shareURLArea:  Will share the link as a text.
 * - queryLocation: Whether form link generates as a fragment query, or a
 *                  regular query. Defaults to fragment query, which is the
 *                  recommended use, if possible.
 * - preserveExtra: Whether or not to preserve extra query parameters. Default
 *                  is set to false, and does not preserve extra parameters.
 * - callback:      Function that's executed each time the form is processed.
 * - cleanURL:      If set to `true`, does not preserve any extra information
 *                  from the URL that is not in the initialized form.
 * @typedef  {object}    FormOptions
 * @property {string}    id
 * @property {string}    [prefix]
 * @property {string}    [shareURLBtn]
 * @property {string}    [shareURL]
 * @property {string}    [shareURLArea]
 * @property {string}    [queryLocation="fragment"]
 * @property {boolean}   [preserveExtra=false]
 * @property {function}  [callback]
 * @property {boolean}   [cleanURL] // TODO
 *
 *
 * Fragment Holds the fragment portion/components of the URL.
 *
 * - string:   Fragment string is everything after '#'.
 * - anchor:   Fragment anchor is everything after '#' and before the first '?'.
 * - query:    Fragment query is everything after '#' and '?'.
 * - pairs:    Fragment pairs is a key:value object, containing fragment
 *   queries.
 * @typedef  {object}    Fragment
 * @property {string}    string
 * @property {string}    anchor // TODO RENAME to 'before'
 * @property {string}    after // TODO
 * @property {string}    query
 * @property {object}    pairs
 *
 *
 * Extras holds the extra fields given in a URL that are not in the initialized
 * form.
 * Object properties will be in key:value objects.
 * 
 * - query:     Object. Extra query parameters given in the URL, not in the form.
 * - queryKeys: Array.  Extra Query parameter keys from the `query` object.
 * - frag:      Object. Extra fragment query parameters given in the URL, not in the form.
 * - fragKeys:  Array.  Extra Frag query parameter keys from the `frag` object.
 * @typedef   {object}   Extras // TODO REname ExtraParameters
 * @property  {object}   query
 * @property  {object}   queryKeys
 * @property  {object}   frag
 * @property  {object}   fragKeys
 */

// DefaultFormOptions where all options are set to their zero case.
/**@type {FormOptions} */
const DefaultFormOptions = {
	id: "",
	prefix: "",
	shareURLBtn: "#shareURLBtn",
	shareURL: "#shareURL",
	shareURLArea: "#shareURLArea",
	queryLocation: "fragment",
	preserveExtra: false,
	callback: null,
	cleanURL: false,
};

// Global FormOptions state, set by InitForm (which calls sanitizeFormOptions)
/**@type {FormOptions} */
var FormOptions;

// Global FormParameters state, set by InitForm
/**@type {FormParameters} */
var FormParameters;

// Global ShareURL Button
/**@type {HTMLButtonElement} */
var shareButton;

// Global HTMLFormElement
/**@type {HTMLFormElement} */
var formElement;

// Global state for whether or not URLFormJS module has been initialized.
var formInited = false;

////////////////////////////
// Functions
///////////////////////////


/**
 * Initializes the globals and event listeners for the URLFormJS module.
 * @param   {FormParameters} params          FormParameters object.
 * @param   {FormOptions}    [formOptions]   FormOptions object.
 * @returns {void}
 */
function Init(params, formOptions) {
	FormParameters = params;
	FormOptions = {};
	FormOptions = sanitizeFormOptions(formOptions);
	shareButton = document.querySelector(FormOptions.shareURLBtn);
	if (shareButton != null) {
		shareButton.addEventListener('click', () => shareURI()); // Must be anonymous, otherwise passes pointer event object.
	}
	formElement = document.getElementById(FormOptions.id);
	formInited = true;
}

/**
 * PopulateFromURI populates the GUI from the URI, if any of the form params
 * are supplied in the URI Query.
 *
 * @returns {void}
 * @throws  {error} Fails if Init() has not been called for the URLFormJS module.
 */
function PopulateFromURI() {
	if (!formInited) {
		throw new Error("URLFormJS: Init() must be called first to initialize the URLFormJS module.");
	}
	if (isEmpty(FormParameters)) {
		return;
	}

	// Add fragment queries to query params.
	let fragQuery = getFragmentQuery(getQueryParams());
	if (isEmpty(fragQuery.pairs)) {
		return;
	}
	PopulateFromValues(fragQuery.pairs);
	shareURI(fragQuery);
}

/**
 * Populates the form initialized in `Init()` from the given values.
 * Values are the given values to populate the form.
 * 
 * @param   {object} values          A key:value pair JSON object.
 * @returns {void}
 */
function PopulateFromValues(values) {
	if (!formInited) {
		throw new Error("URLFormJS: Init() must be called first to initialize the URLFormJS module.");
	}
	if (!isEmpty(FormParameters)) {
		setGUI(values);
	}
}

/**
 * Serialize serializes the initialized form into a JSON string.
 * 
 * @returns {string}  serialized  String. Stringed form.
 * @throws  {error}   error       Error. Fails if form is not of type HTMLFormElement.
 */
function Serialize() {
	return JSON.stringify(Objectify());
};

/**
 * Objectify makes the initialized form into a JSON object.
 * 
 * @returns {object} parsd   Object. JSON form.
 * @throws  {error}  error   Error. Fails if form is not of type HTMLFormElement.
 */
function Objectify() {
	if (!formInited) {
		throw new Error("URLFormJS: Init() must be called first to initialize the URLFormJS module.");
	}
	var formData = new FormData(formElement); // throws
	var pairs = {};
	for (let [name, value] of formData) {
		if (value == "true" || value == "on") {
			value = true;
		}
		if (value == "false" || value == "unchecked") {
			value = false;
		}
		// Handle FormOptions if set.
		if (!isEmpty(FormOptions)) {
			// Remove prefix, if set.
			if (!isEmpty(FormOptions.prefix)) {
				name = name.substring(FormOptions.prefix.length);
			}
		}

		if (!isEmpty(value)) {
			pairs[name] = value;
		}
	}
	return pairs;
};


/**
 * Clear clears out a form with the FormParameters and FormOptions set at
 * initialization.
 *
 * @returns {void}
 */
function Clear() {
	if (!formInited) {
		throw new Error("URLFormJS: Init() must be called first to initialize the URLFormJS module.");
	}
	if (isEmpty(FormParameters)) {
		return;
	}
	for (const parameter in FormParameters) {
		let fp = getFormParam(parameter);
		fp.name = FormOptions.prefix + fp.name;

		// If id is empty, assume name is the id on the page.
		if (isEmpty(fp.id)) {
			fp.id = fp.name;
		}

		// Clears the GUI. Unchecks checkbox elements if type=bool and otherwise
		// sets the value of the element to "";
		if (fp.type == "bool") {
			let e = document.getElementById(fp.id);
			if (e != null) {
				e.checked = false;
			}
			continue;
		}

		let e = document.getElementById(fp.id);
		if (e != null) {
			e.value = "";
		}
	}
}

/**
 * IsEmpty returns whether or not the initialized form is empty.
 * 
 * @returns {boolean} bool    Boolean. Whether or not the form is empty.
 * @throws  {error}   error   Error.   Fails if form is not of type HTMLFormElement.
 */
function IsEmpty() {
	return isEmpty(Objectify());
}

/**
 * Returns a FragmentQuery object. If no 'pairs' object is given/is empty, an
 * empty 'pairs' object will be created in the 'FragmentQuery' object. If there
 * are no fragment queries, the 'pairs' object is returned either as an empty
 * object (if created in this func), or unmodified. Fragment queries will
 * override a field if already set.
 *
 * @param   {object}        [pairs]       Object. A key:value pair JSON object.
 * @returns {Fragment}      fq            Object. A FragmentQuery object.
 */
function getFragmentQuery(pairs) {
	/**@type {Fragment} */
	let fq = {
		anchor: "", // "everything after "#" and before "?"
		fragment: window.location.hash.substring(1), //"#" character is pos [0]
		pairs: {}
	};
	if (!isEmpty(pairs)) {
		fq.pairs = pairs;
	}
	if (!isEmpty(fq.fragment)) {
		let f = fq.fragment.split('?');

		// Fragment query is empty or malformed.
		if (f.length < 2) {
			return fq;
		}
		fq.anchor = f[0];
		// Fragment query is after # and ?, separated by "&".
		for (let pair of f[1].split("&")) {
			pair = pair.split("=");
			// console.log(pair)
		}
		f[1].split('&').forEach((q) => {
			let pair = q.split('=');
			if (pair[1] === undefined) {
				fq.pairs[pair[0]] = null;
				return; // In anonymous func.
			}
			// Browsers automatically escape values. 'unescape' deprecated.
			fq.pairs[pair[0]] = decodeURI(pair[1]);
		});
	}
	return fq;
}

/**
 * Returns URL query parameters as a key:value pair object.
 *
 * @returns {object} pairs    Object. key:value object.
 */
function getQueryParams() {
	var url = new URL(window.location.href);
	// Put parts into an object since searchParams needs to be combined with fragment queries. 
	let pairs = {};
	// Convert the entries into an object.
	for (var pair of url.searchParams.entries()) {
		pairs[pair[0]] = pair[1];
	}
	return pairs;
}

/**
 * Does the processing and checking for a parameter in the params form.
 * Sets GUI for each param, and executes funcTrue() per param, if applicable.
 *
 * @param   {object} values    Object. key:value pair JSON object.
 * @returns {void}
 */
function setGUI(values) {
	try {
		// Process form paramters
		for (const parameter in FormParameters) { // TODO FIXME
			let fp = getFormParam(parameter);
			let value = values[fp.name];

			// If id is empty, assume name is the id on the page.
			if (isEmpty(fp.id)) {
				fp.id = FormOptions.prefix + fp.name;
			}

			// Run func if set
			if (!isEmpty(fp.func)) {
				fp.func();
			}

			// Run funcTrue. Value may be "true", or empty "" if in the URL and with no
			// value set, but not `undefined`.  Name only is considered a flag and is
			// interpreted as true.  
			if (fp.type == "bool" && fp.funcTrue !== undefined && value !== undefined && value !== "" && (value === "true" || value === true)) {
				fp.funcTrue();
			}

			// Sets the GUI if the value is populated. Checks checkbox elements if
			// type=bool and otherwise sets the value of the element based on the given
			// name.
			if (!isEmpty(value)) {
				if (fp.type == "bool" && (value == "true" || value === true)) {
					let e = document.getElementById(fp.id);
					if (e != null) {
						e.checked = true;
					}
					continue;
				}

				let e = document.getElementById(fp.id);
				if (e != null) {
					e.value = value;
				}
			}
		}
	} finally {
		// Process form
		if (!isEmpty(FormOptions.callback)) {
			FormOptions.callback();
		}
	}
}

/** TODO Deprecate and fix syntax where this is called
 * Returns a FormParameter object for the given paramter key.
 * 
 * @param   {string}         param     String. Form parameter key.
 * @returns {FormParameter}            Object. FormParameter object.
 */
function getFormParam(param) {
	return /**@type {FormParameter} */ {
		name: FormParameters[param].name,
		id: FormParameters[param].id,
		type: FormParameters[param].type,
		func: FormParameters[param].func,
		funcTrue: FormParameters[param].funcTrue,
	};
}

/**
 * Sanitizes a formOptions object, and sets all of the options values to their
 * default value if not set.
 * 
 * Modifies "in place" as well as returns the object.
 * 
 * For new options/setting FormOptions, Init() must be re-called.
 * 
 * @param   {FormOptions} formOptions  A form options object.
 * @returns {object}      FormOptions
 * @throws  {error}       fails if FormOptions or 'id' in options is empty.
 */
function sanitizeFormOptions(formOptions) {
	let formOpts = { // Not making a copy will modify the original, even though it's a const.
		...DefaultFormOptions
	};
	// If no options given, use default.
	if (isEmpty(formOptions) || isEmpty(formOptions.id)) {
		throw new Error("URLFormJS: `FormOptions` is not properly set, see README.");
	}
	// If FormOptions has already been sanitized, do nothing.
	if (!isEmpty(formOptions.FormJs_Sanitized) && formOptions.FormJs_Sanitized === true) {
		return;
	}

	//// Sanitize

	// `id` is required.
	formOpts.id = formOptions.id;
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
	if (!isEmpty(formOptions.queryLocation)) {
		formOpts.queryLocation = formOptions.queryLocation;
	}
	if (!isEmpty(formOptions.preserveExtra)) {
		formOpts.preserveExtra = formOptions.preserveExtra;
	}
	if (!isEmpty(formOptions.callback)) {
		formOpts.callback = formOptions.callback;
	}
	formOpts.FormJs_Sanitized = true;
	return formOpts;
}

/**
 * Generates a share URL, populates the GUI with it, and returns the URL.
 * 
 * Fragment queries will take precedence over query parameters.
 *
 * @param   {FragmentQuery}  [fq]    Object. FragmentQuery object.
 * @returns {URL}            URL     Object. Javascript URL object.
 */
function shareURI(fq) {
	if (isEmpty(FormParameters)) {
		return;
	}

	// Get fragment queries.
	let fragKeys = [];
	if (isEmpty(fq)) {
		fq = getFragmentQuery();
	}
	if (!isEmpty(fq.pairs)) {
		fragKeys = Object.keys(fq.pairs);
	}

	let extras = getExtras();

	var url = new URL(window.location.origin);
	for (const parameter in FormParameters) {
		let fp = getFormParam(parameter);

		// `name` is default id for html element. `id` overrides `name` for html
		// elements ids.
		let htmlID = fp.name;
		if (!isEmpty(fp.id)) {
			htmlID = fp.id;
		}

		var elem = document.getElementById(FormOptions.prefix + htmlID);
		let value;
		if (elem !== null) {
			value = elem.value;
			if (fp.type == "bool") {
				if (elem.checked) {
					value = "true";
				} else {
					value = "";
				}
			}
		}
		// Sets value if populated, otherwise removes the name from the query param.
		// If 'queryLocation' is set to "fragment" on a form wide basis, all values
		// will be part of the fragment query.
		let e = isEmpty(value);
		if (!e && (FormOptions.queryLocation == "fragment") || (fragKeys.includes(fp.name) || fp.queryLocation === "fragment")) {
			fq.pairs[fp.name] = value;
		} else if (!e) {
			url.searchParams.set(fp.name, value);
		} else {
			// Cleans out value from string in case it is set in the URI already.
			// (e.g. bools on false will not be cleared)
			url.searchParams.delete(fp.name);
		}
	}
	// Set extras back in query params, if given.
	if (!isEmpty(extras.query)) {
		for (let extra in extras.query) {
			url.searchParams.set(extra, extras.query[extra]);
		}
	}

	// Rebuild fragment query in case new form fields were set.
	url.hash = fragQueryToString(fq, extras);

	//Remove hash if there's nothing in it."#" character is pos [0]
	if (isEmpty(url.hash.substring(1))) {
		url.hash = "";
	}

	// URI Link
	let shareUrl = document.querySelector(FormOptions.shareURL);
	if (shareUrl != null) {
		shareUrl.innerHTML = url.href.link(url.href);
	}

	// Text Area 
	let shareArea = document.querySelector(FormOptions.shareURLArea);
	if (shareArea != null) {
		shareArea.innerHTML = url.href;
	}

	return url;
};

/** TODO Rename to getExtraParameters
 * Returns the extra fields that are not specified in the initialized form
 * from both query params and fragment queries.
 * 
 * @returns {Extras} extras   Object. Extras object.
 */
function getExtras() {
	let fq = getFragmentQuery();
	let qp = getQueryParams();

	/** @type {Extras} */
	let extras = {
		query: {},
		frag: {},
		queryKeys: [],
		fragKeys: [],
	};

	let queryKeys = Object.keys(qp);
	let fragKeys = Object.keys(fq.pairs);

	let params = [];
	for (let param in FormParameters) {
		let fp = getFormParam(param);
		params.push(fp.name);
	}
	for (let key of queryKeys) {
		if (!params.includes(key)) {
			extras.query[key] = qp[key];
			extras.queryKeys.push(key);
		}
	}
	for (let key of fragKeys) {
		if (!params.includes(key)) {
			extras.frag[key] = fq.pairs[key];
			extras.fragKeys.push(key);
		}
	}
	return extras;
}

/**
 * Returns a fragment query string from a fragment query key:value object.
 * 
 * Returns "#" if the given fragment query object is empty.
 * 
 * @param   {FragmentQuery} fragQuery   Object. FragmentQuery object.
 * @param   {Extras}        extras      Object. Extras object.
 * @returns {string}        fqs         String. Fragment query string (#?...).
 */
function fragQueryToString(fragQuery, extras) { // TODO Rename to fragQueryToURLHash
	let fqs = "#";
	if (isEmpty(fragQuery)) {
		return fqs;
	}
	if (!isEmpty(fragQuery.anchor)) {
		fqs += fragQuery.anchor;
	}
	fqs += "?";
	var last = Object.keys(fragQuery.pairs).length - 1;
	var i = 0;
	var suffix = "&";
	if (last === 0) {
		suffix = "";
	}
	for (let key in fragQuery.pairs) {
		if (i === (last)) {
			suffix = "";
		}
		i++;
		if (extras.fragKeys.includes(key) || extras.queryKeys.includes(key)) {
			continue;
		}
		fqs += key + "=" + fragQuery.pairs[key] + suffix;
	}

	// Set extras back in query params, if given.
	if (!isEmpty(extras.frag)) {
		i = 0;
		suffix = "&";
		last = extras.fragKeys.length - 1;
		for (let extra in extras.frag) {
			if (i === (last)) {
				suffix = "";
			}
			i++;
			fqs += extra + "=" + extras.frag[extra] + suffix;
		}
	}
	// TODO put fragment afters here

	return fqs;
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