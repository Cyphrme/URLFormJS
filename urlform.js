"use strict";

// NOTE: JSDoc will use the '@alias' when a variable is typed with '@type', and
// exported. This will reference the typedef, and classify the type as a member
// of the typedef. Exporting a variable that shares the name with a typedef will
// show an alias for both the typedef, and variable, and also carry the
// typedef's docs when accessing the variable outside of the module. For some
// reason, exporting 'DefaultFormOptions' will properly type the object, but the
// typedef docs are not carried with it. I can't find a clear explanation for
// why this is the case. The closest I can find is the following: When using the
// 'exports' object in modules, the '@module' tag is not needed, and
// automatically recognizes the object's members are being exported:
// https://jsdoc.app/tags-exports.html
//
// JSDoc reference: https://jsdoc.app/index.html

// TODO Use as examples:
//
// https://localhost:8082/#a:~:text=Hello&text=World&text=!%20news&?first_name=Hello&last_name=World&phone_number=!
// demonstrating where '!' needs to be percent encoded to work properly in the
// text fragment.
//
// Malformed text fragment (missing '&').
// https://localhost:8082/#anchor:~:text=hello?first_name=Hello&last_name=World
//
// Correct text fragment (present '&').
// https://localhost:8082/#anchor:~:text=hello&?first_name=Hello&last_name=World




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
 * FormParameter are the options for a form's field/parameter.
 *
 * Example:
 * {
 *  "name": "send_news_and_updates",
 *  "id":   "input_send_news_and_updates',
 *  "type": "bool",
 *  "funcTrue": ()=> ToggleVisible(document.querySelector("#advancedOptions"));
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
 * - queryLocation: Option for overriding the param in the URL link to either
 *                  be a query parameter, or a fragment query.
 * @typedef  {Object}     FormParameter
 * @property {String}     name
 * @property {String}     [id]
 * @property {String}     [type=string]
 * @property {Function}   [func]
 * @property {Function}   [funcTrue]
 * @property {String}     [queryLocation="fragment"]
 */

/**
 * FormParameters is the main form object that holds the different
 * `FormParameter` field objects.
 * @typedef {Array<FormParameter>} FormParameters
 */

/**
 * FormOptions are the optional fields for the initialized form. The FormOptions
 * object itself is not optional, and requires the 'id' of the initialized form.
 * The 'id' should match the 'id' of the HTMLFormElement on the page.
 * 
 * FormOptions are in this form:
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
 * @typedef  {Object}    FormOptions
 * @property {String}    id
 * @property {String}    [prefix]
 * @property {String}    [shareURLBtn]
 * @property {String}    [shareURL]
 * @property {String}    [shareURLArea]
 * @property {String}    [queryLocation="fragment"]
 * @property {Boolean}   [preserveExtra=false]
 * @property {Function}  [callback]
 * @property {Boolean}   [cleanURL]
 */

/**
 * Fragment Holds the fragment portion/components of the URL.
 *
 * - string:   Fragment string is everything after '#' (full fragment).
 * - before:   Fragment before is everything after '#' and before the first '?'.
 * - after:    Fragment after is everything after '#', '?' and ':~:text='.
 * - query:    Fragment query is everything after '#' and '?'.
 * - pairs:    Fragment pairs is a key:value object, containing the fragment
 *             queries.
 * @typedef  {Object}    Fragment
 * @property {String}    string
 * @property {String}    before
 * @property {String}    after
 * @property {String}    query
 * @property {Object}    pairs
 */

/**
 * ExtraParameters holds the extra fields given in a URL that are not in the
 * initialized form.
 * Object properties will be in key:value objects.
 * 
 * - query:     Object. Extra query parameters given in the URL, not in the form.
 * - queryKeys: Array.  Extra Query parameter keys from the `query` object.
 * - frag:      Object. Extra fragment query parameters given in the URL, not in the form.
 * - fragKeys:  Array.  Extra Frag query parameter keys from the `frag` object.
 * @typedef   {Object}        ExtraParameters
 * @property  {Object}        query
 * @property  {Array<String>} queryKeys
 * @property  {Object}        frag
 * @property  {Array<String>} fragKeys
 */

// DefaultFormOptions where all options are set to their default case.
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
	if (formElement === null) {
		console.warn("URLFormJS: Could not find the form for the given 'id' in 'FormOptions'.");
	}
	formInited = true;
}

/**
 * PopulateFromURI populates the GUI from the URI, if any of the form params
 * are supplied in the URI Query.
 *
 * @returns {void}
 * @throws  {Error} Fails if Init() has not been called for the URLFormJS module.
 */
function PopulateFromURI() {
	if (!formInited) {
		throw new Error("URLFormJS: Init() must be called first to initialize the URLFormJS module.");
	}
	if (isEmpty(FormParameters)) {
		return;
	}

	// Add fragment queries to query params.
	let fragQuery = getFragment(getQueryParams());
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
 * @param   {Object} values          A key:value pair JSON object.
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
 * @returns {String}  serialized  String. Stringed form.
 * @throws  {Error}   error       Error. Fails if form is not of type HTMLFormElement.
 */
function Serialize() {
	return JSON.stringify(Objectify());
};

/**
 * Objectify makes the initialized form into a JSON object.
 * 
 * @returns {Object} parsd   Object. JSON form.
 * @throws  {Error}  error   Error. Fails if form is not of type HTMLFormElement.
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
	for (let p in FormParameters) {
		let fp = getFormParamCopy(p);
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
 * @returns {Boolean} bool    Boolean. Whether or not the form is empty.
 * @throws  {Error}   error   Error.   Fails if form is not of type HTMLFormElement.
 */
function IsEmpty() {
	return isEmpty(Objectify());
}

/**
 * Returns a 'Fragment' object. If no 'pairs' object is given/is empty, an
 * empty 'pairs' object will be created in the 'Fragment' object. If there
 * are no fragment queries, the 'pairs' object is returned either as an empty
 * object (if created in this func), or unmodified. Fragment queries will
 * override a field if already set.
 * @param   {Object}        [pairs]       Object. A key:value pair JSON object.
 * @returns {Fragment}      frag          Object. A Fragment object.
 */
function getFragment(pairs) {
	// Chrome removes ':~:text=' (text fragments), and anything after the text
	// fragment. Thus, calilng 'window.location.hash' with a URL of:
	// https://localhost:8082/#:~:text=hello?first_name=asdf&last_name=hello
	// will result: '#a'.
	// And calling 'window.location.hash' with a URL of:
	// https://localhost:8082/#?first_name=asdf&last_name=hello:~:text=hello
	// will result: '#?first_name=asdf&last_name=hello'.
	// Firefox sees and preserves the text fragment.
	// See: 
	// https://stackoverflow.com/questions/67039633/get-the-text-fragment-part-of-current-url-from-window-location
	// and
	// https://github.com/WICG/scroll-to-text-fragment/issues
	//
	// By default, we support FireFox's way of handling the text fragment using
	// 'window.location', but will also perform a secnodary check for Chrome,
	// and other browsers that do not support text fragments in 'window.location'.

	// Set 'before', 'after', 'query', and 'string' before calculating fragment
	// query pairs.
	let query = "";
	let splits = window.location.hash.split("#");
	let after = "";
	let before = "";

	// Use 'performance' package for browsers other than 'Firefox', to properly
	// handle text fragments NOTE: MDN recommends never using user agent or
	// browsers to determine logic, but this seems to be the best way until text
	// fragments are properly handled.
	if (!navigator.userAgent.includes('Firefox')) {
		splits = performance.getEntriesByType('navigation')[0].name.split("#");
	}

	// Check if URL has fragment/hash.
	if (splits.length > 1) {
		let ss = splits[1].split('?');
		// Check if URL has fragment 'query' and 'before'.
		if (ss.length > 1) {
			before = ss[0];
			query = "?" + ss[1];
		} else {
			// If fragment does not contain '?', entire fragment is put into 'before'.
			before = ss[0];
		}
	}

	if (!isEmpty(query)) {
		let s = query.split(':~:text=');
		if (s.length > 1) {
			after = ":~:text=" + s[1].split('?')[0];
			query = s[0];
		}
	}

	/**@type {Fragment} */
	let fragment = {
		string: before + query + after, // Everything after "#".
		query: query, // Everything after "#" and "?".
		before: before, // Everything after "#" and before "?".
		after: after, // Everything after "#", "?", and ":~:text=".
		pairs: {} // Holds key:value fragment pairs.
	};

	//// Set fragment query pairs.
	if (!isEmpty(pairs)) {
		fragment.pairs = pairs;
	}
	if (!isEmpty(fragment.query)) {
		let f = fragment.query.split('?');

		// Fragment query is empty or malformed.
		if (f.length < 2) {
			return fragment;
		}

		// Fragment query is after # and ?, separated by "&".
		for (let pair of f[1].split("&")) {
			pair = pair.split("=");
		}
		f[1].split('&').forEach((q) => {
			let pair = q.split('=');
			if (pair[1] === undefined) {
				fragment.pairs[pair[0]] = null;
				return; // In anonymous func.
			}
			// Browsers automatically escape values. 'unescape' deprecated.
			fragment.pairs[pair[0]] = decodeURI(pair[1]);
		});
	}
	return fragment;
}

/**
 * Returns URL query parameters as a key:value pair object.
 *
 * @returns {Object} pairs    Object. key:value object.
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
 * @param   {Object} values    Object. key:value pair JSON object.
 * @returns {void}
 */
function setGUI(values) {
	try {
		// Process form paramters
		for (let p in FormParameters) {
			let fp = getFormParamCopy(p);
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

/**
 * Returns a copy of the FormParameter object for the given paramter key.
 * 
 * @param   {String}         param     String. Form parameter key/index.
 * @returns {FormParameter}            Object. FormParameter object.
 */
function getFormParamCopy(param) {
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
 * @returns {Object}      FormOptions
 * @throws  {Error}       fails if FormOptions or 'id' in options is empty.
 */
function sanitizeFormOptions(formOptions) {
	// Not making a copy will modify the original, even though it's a const.
	let formOpts = {
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
	if (!isEmpty(formOptions.cleanURL)) {
		formOpts.cleanURL = formOptions.cleanURL;
	}

	formOpts.FormJs_Sanitized = true;
	return formOpts;
}

/**
 * Generates a share URL, populates the GUI with it, and returns the URL.
 * 
 * Fragment queries will take precedence over query parameters.
 *
 * @param   {Fragment}  [frag]    Object. Fragment object.
 * @returns {URL}       URL       Object. Javascript URL object.
 */
function shareURI(frag) {
	if (isEmpty(FormParameters)) {
		return;
	}

	// Get fragment queries.
	let fragKeys = [];
	if (isEmpty(frag)) {
		frag = getFragment();
	}
	if (!isEmpty(frag.pairs)) {
		fragKeys = Object.keys(frag.pairs);
	}

	var url = new URL(window.location.origin);
	for (let p in FormParameters) {
		let fp = getFormParamCopy(p);

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
			frag.pairs[fp.name] = value;
		} else if (!e) {
			url.searchParams.set(fp.name, value);
		} else {
			// Cleans out value from string in case it is set in the URI already.
			// (e.g. bools on false will not be cleared)
			url.searchParams.delete(fp.name);
		}
	}
	let extras = getExtraParameters();
	// Set extras back in query params, if given, and 'cleanURL' not set.
	if (!isEmpty(extras.query) && !FormOptions.cleanURL) {
		for (let extra in extras.query) {
			url.searchParams.set(extra, extras.query[extra]);
		}
	}

	// Rebuild fragment query in case new form fields were set.
	url.hash = fragQueryToURLHash(frag, extras);

	//Remove hash if there's nothing in it."#" character is pos [0]
	if (isEmpty(frag.string)) {
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

/**
 * Returns the extra fields that are not specified in the initialized form
 * from both query params and fragment queries.
 * 
 * @returns {ExtraParameters} extras   Object. ExtraParameters object.
 */
function getExtraParameters() {
	let fq = getFragment();
	let qp = getQueryParams();

	/** @type {ExtraParameters} */
	let extras = {
		query: {},
		frag: {},
		queryKeys: [],
		fragKeys: [],
	};

	let queryKeys = Object.keys(qp);
	let fragKeys = Object.keys(fq.pairs);

	let params = [];
	for (let p of FormParameters) {
		params.push(p.name);
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
 * @param   {Fragment}        frag   Object. FragmentQuery object.
 * @param   {ExtraParameters} extras      Object. ExtraParameters object.
 * @returns {String}          fqs         String. Fragment query string (#?...).
 */
function fragQueryToURLHash(frag, extras) {
	let fqs = "#";
	if (isEmpty(frag)) {
		return fqs;
	}
	if (!isEmpty(frag.before)) {
		fqs += frag.before;
	}
	fqs += "?";
	var last = Object.keys(frag.pairs).length - 1;
	var i = 0;
	var suffix = "&";
	if (last === 0) {
		suffix = "";
	}
	for (let key in frag.pairs) {
		if (i === (last)) {
			suffix = "";
		}
		i++;
		if (extras.fragKeys.includes(key) || extras.queryKeys.includes(key)) {
			continue;
		}
		fqs += key + "=" + frag.pairs[key] + suffix;
	}

	// Set extras back in query params, if given.
	if (!isEmpty(extras.frag) && !FormOptions.cleanURL) {
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

	// Append text-fragment.
	fqs += frag.after;

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
 * @returns {Boolean}          Boolean.  
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
 * @returns {Boolean}         An actual boolean.
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