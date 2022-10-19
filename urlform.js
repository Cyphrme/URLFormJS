'use strict';

// URLFormJS is used for sticky forms and sharable URL links.  See README. 

// # Test URL
// ### Convention
// Queries values are two letters, 
// Frag queries are one letter.  
// Extras begin with "e".  
// Extra before frag begin with "eb"
// Extra after frag begin with "el"

// file:///home/z/dev/go/src/github.com/cyphrme/cyphr.me/web/dist/js/pkg/urlformjs/index.html?last_name=Smith&eBob=eBob#ebmarry=ebmarry?first_name=f&middle_name=m&extramarry=extramarry

// file:///home/z/dev/go/src/github.com/cyphrme/cyphr.me/web/dist/js/pkg/urlformjs/index.html?first_name=ff&eBob=eBob#ebmarry=ebmarry?&middle_name=m&last_name=l&email_address=e&phone_number=p&subscribe_latest_news=true&country_select=1&elmarry=elmarry



// UMD export pattern.  See //TODO LINk
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
		typeof define === 'function' && define.amd ? define(['exports'], factory) :
		(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.URLForm = {}));
})(this, (function (exports) {
	exports.Init = Init;
	exports.PopulateFromValues = PopulateFromValues;
	exports.PopulateFromURI = PopulateFromURI;
	exports.Serialize = Serialize;
	exports.GetForm = GetForm;
	exports.Clear = Clear;
	exports.IsEmpty = IsEmpty;
	exports.GetDefaultFormOptions = GetDefaultFormOptions;

	Object.defineProperty(exports, '__esModule', {
		value: true
	});
}));


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
 *                  For 'bool', if the parameter is present in the URL and has
 *                  a function set in 'funcTrue', the function will be executed.
 *                  (e.g. https://localhost/?send_news_and_updates) using the
 *                  example above will execute the 'ToggleVisible' function.
 *
 * - func:          Gets called if set on each call to setGUI
 *                  (PopulateFromValues and PopulateFromURI).
 *
 * - funcTrue:      Function to execute if param is true. e.g. `"funcTrue": ()
 *                  => {
 *                  ToggleVisible(document.querySelector("#advancedOptions"))};`
 *
 * - queryLocation: Option for overriding the param in the URL link to either
 *                  be a query parameter, or a fragment query. Defaults to empty
 *                  string, which will inherit the 'defaultQueryLocation' from
 *                  the form wide options.
 * 
 * - saveSetting:  Save and use this setting from local storage.  Will be
 *                  overwritten by URL flag values if present. 
 * @typedef  {Object}        FormParameter
 * @property {String}        name
 * @property {String}        [id]
 * @property {ParamType}     [type=string]
 * @property {Function}      [func]
 * @property {Function}      [funcTrue]
 * @property {QueryLocation} [queryLocation=""]
 * @property {bool}          [saveSetting=false]
 */

/**
 * ParamType is the type for a given FormParameter.
 *
 * A ParamType may be one of the following:
 * - "string":  The parameter is a string. Default.
 * - "bool":    The parameter is a boolean. Used for checkboxes.
 * - "":        The parameter uses the default.
 * @typedef {"string" | "bool" | ""} ParamType
 */

/**
 * QueryLocation is the option for what kind of query a form and/or form
 * parameter will be.
 *
 * A QueryLocation may be one of the following:
 * - "fragment": The query is preceded by '#' and '?'.
 * - "query":    The query is preceded by '?'.
 * - "":         Empty will inherit the form wide option for 'queryLocation'.
 * @typedef {"fragment" | "query" | ""} QueryLocation
 */

/**
 * FormParameters is the main form object (Array) that holds the different
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
 * Fields:
 * 
 * 
 * 
 * - prefix:               Form input prefix which will be prepended to name.
 * 
 * - clearBtn:             Button element for clearing the form and
 *                         queries/fragments in the URL.
 * 
 * - shareURLBtn:          Button element for sharing the form in the URL.
 * 
 * - shareURL:             Will share the link as a URL.
 * 
 * - shareURLArea:         Will share the link as a text.
 * 
 * - defaultQueryLocation: Whether form link generates as a fragment query, or
 *                         a regular query. Defaults to fragment query, which
 *                         is the recommended use, if possible. Can only be
 *                         either 'fragment' or 'query', and not empty.
 * 
 * - callback:             Function that's executed each time the form is
 *                         processed.
 * 
 * - cleanURL:             If set to `true`, does not preserve any extra
 *                         information from the URL that is not in the
 *                         initialized form. Defaults to false.
 * <form> mode options:
 * - formID:               HTMLFormElement ID of <form>. Set formMode true
 * 
 * 
 * Properties that are intended for use within this module.
 * 
 * - Sanitized:          Whether 'FormOptions' has been sanitized.
 * - Inited:             Whether URLFormJS module was initialized.
 * - ShareURLBtnElement: Share URL button element in GUI.
 * - ClearBtnElement:    Clear the `shareURL` and form in GUI.
 * <form> mode options:
 * - FormMode:            Use `<form>` mode.  FormOptions must include a form 'id' found in the GUI.
 * - FormElement:        Form element in GUI, specified by 'id' in 'FormOptions'.
 * @typedef  {Object}               FormOptions
 * @property {String}               [prefix]
 * @property {String}               [clearBtn]
 * @property {String}               [shareURLBtn] 
 * @property {String}               [shareURL]
 * @property {String}               [shareURLArea]
 * @property {QueryLocation}        [defaultQueryLocation="fragment"]
 * @property {Function}             [callback]
 * @property {Boolean}              [cleanURL=false]
 * @property {String}               [formID]
 * // Read only Values
 * @property {Boolean}              Sanitized=false
 * @property {Boolean}              Inited=false
 * @property {Boolean}              FormMode=false
 * @property {HTMLFormElement}      FormElement
 * @property {HTMLButtonElement}    ShareURLBtnElement
 * @property {HTMLButtonElement}    ClearBtnElement 
 * @property {FormParameters}       FormParameters
 */

/**
 * Query is the Query string.  Everything after first ? and before first #.
 * @typedef {String}    QueryString
 */

/**
 * Fragment is the Fragment string without `#`.  Everything after the first #.
 * @typedef {String}    FragmentString
 */

/**
 * QuagPairs is an Object of key:value pairs for both Query Parameters and
 * Fragment Query Parameters. `quag` is the superset of `query` and `fragment`.
 * 'object' is diluted in meaning by JSDoc, and using '{}' will denote a key:val
 * object. See: https://github.com/microsoft/TypeScript/issues/50321#issuecomment-1217224937
 * @typedef {{}}   QuagPairs
 */

/**
 * Fragment holds the fragment parts from the URL. All parts may be nil. Includes extras. 
 * // TODO future: support other scheme starting delimiters and perhaps `?` for
	// fragment queries.
 * 
 * - fragment:   The whole fragment string (everything included).
 * - pairs:      key:value object containing the fragment queries. Does not include extras.  
 * - extras:      key:value that appear in fragment query but not in form.
 * 
 * - before:     Everything after '#' and if exists everything before the first '?'.
 * - query:      Everything after `before` and before the next fragment scheme 
 *               delimiter, i.e. ':~:'. This is the "middle part".  This is the fragment query.  
 * - after:      Everything after `query`.
 * @typedef  {Object}         Fragment
 * @property {FragmentString} string  
 * @property {QuagPairs}      pairs
 * @property {QuagPairs}      extras
 * @property {String}         before
 * @property {String}         query
 * @property {String}         after
 */


/**
 * Query holds the fragment parts from the URL. All parts may be nil. Includes extras. 
 * 
 * - string:     The string URL query component. Does not contain any fragment.
 * - pairs:      key:value object containing the queries. Includes extras.
 * - extras:     Extra query parameters given in the URL.
 * @typedef  {Object}       Query
 * @property {String}       string
 * @property {QuagPairs}    pairs
 * @property {QuagPairs}    extra
 */

/**
 * QuagParts holds the query and fragment from the existing URL.  See README on `quag`.
 *
 * - pairs:      All pairs.  key:value object containing `query.pairs` and `fragment.pairs`.
 * - fragment:   Fragment object.
 * - query:      Query Object.
 * @typedef  {Object}    QuagParts
 * @property {QuagPairs} pairs
 * @property {Query}     query
 * @property {Fragment}  fragment
 */


/** @type {QueryLocation} */
const QueryLocationQuery = "query";

/** @type {QueryLocation} */
const QueryLocationFragment = "fragment";

/**
 * DefaultFormOptions where all options are set to their default case.
 * @type {FormOptions} 
 */
const DefaultFormOptions = {
	formID: "",
	prefix: "",
	shareURLBtn: "#shareURLBtn",
	shareURL: "#shareURL",
	shareURLArea: "#shareURLArea",
	defaultQueryLocation: QueryLocationFragment,
	callback: null,
	cleanURL: false,
	localStorageNamespace: "URLFormJS_",
	// Module fields not settable externally.  
	Sanitized: false,
	Inited: false,
	FormMode: false,
	FormElement: HTMLFormElement,
	ShareURLBtnElement: HTMLButtonElement,
	ClearBtnElement: HTMLButtonElement,
};

/**
 * Initializes the globals and event listeners for the URLFormJS module.
 * If 'formOptions' is empty, the default options will be used.
 * 
 * @param   {FormParameters} params
 * @param   {FormOptions}    [formOptions]
 * @returns {FormParameters} SetFormParameters
 */
function Init(params, formOptions) {
	let formOpt = {};
	formOpt = sanitizeFormOptions(formOptions);

	// Sanitize form parameters. (The `for` is pass by reference, not pass by copy.)
	for (let fp of params) {
		// If query location is not a recognized 'QueryLocation', use default.
		if (fp.queryLocation !== QueryLocationFragment && fp.queryLocation !== QueryLocationQuery) {
			fp.queryLocation = DefaultFormOptions.defaultQueryLocation;
		}
	}
	formOpt.FormParameters = params;
	formOpt.ShareURLBtnElement = document.querySelector(formOpt.shareURLBtn);
	if (formOpt.ShareURLBtnElement != null) {
		formOpt.ShareURLBtnElement.addEventListener('click', () => shareURI(formOpt)); // Must be anonymous, otherwise passes pointer event object.
	}
	formOpt.ClearBtnElement = document.querySelector(formOpt.clearBtn);
	if (formOpt.ClearBtnElement != null) {
		formOpt.ClearBtnElement.addEventListener('click', () => {
			Clear(formOpt);
		});
	}
	// Form Mode
	if (!isEmpty(formOpt.formID)) {
		formOpt.FormElement = document.getElementById(formOpt.formID);
		if (formOpt.FormElement !== null) {
			formOpt.FormMode = true;
		}
	}
	formOpt.Inited = true;
	return formOpt;
}

/**
 * PopulateFromURI populates the GUI from the URI, if any of the form params
 * are supplied in the URI Query.
 * @param   {FormOptions}    formOptions
 * @returns {void}
 * @throws  {Error} Fails if Init() has not been called for the URLFormJS module.
 */
function PopulateFromURI(formOptions) {
	PopulateFromValues(getQuagParts(formOptions).pairs, formOptions);
}

/**
 * Populates the form initialized in `Init()` from the given values. Values are
 * the given values to populate the form.
 * 
 * @param   {QuagPairs}   quagPairs
 * @param   {FormOptions} formOptions
 * @returns {void}
 * @throws  {Error} Fails if Init() has not been called for the URLFormJS module.
 */
function PopulateFromValues(quagPairs, formOptions) {
	if (!formOptions.Inited) {
		throw new Error("URLFormJS: Init() must be called first to initialize the URLFormJS module.");
	}
	setGUI(quagPairs, formOptions);
	shareURI(formOptions);
}

/**
 * getFragmentString returns URL fragment as a string, not including '#'.
 * See notes in function.
 *
 * @returns {Fragment.string}
 */
function getFragmentString() {
	let fParts = window.location.hash.split("#"); // May not work in chrome, see note below.

	// Chrome removes ':~:' (fragment directives (for text fragments)), and
	// anything after the text fragment. Thus, calling 'window.location.hash' with
	// a URL of:
	// https://localhost:8082/#:~:text=hello?first_name=asdf&last_name=hello
	// will result: '#a'. And calling 'window.location.hash' with a URL of:
	// https://localhost:8082/#?first_name=asdf&last_name=hello:~:text=hello
	// will result: '#?first_name=asdf&last_name=hello'.
	// Firefox sees and preserves the text fragment. See:
	// https://stackoverflow.com/a/73366996/1923095
	// and
	// https://github.com/WICG/scroll-to-text-fragment/issues/193#issuecomment-1219640246
	//
	// FireFox's way of handling the text fragment using 'window.location'is
	// correct and the following performs a secondary check for other browsers
	// (Chrome) that have changed the behavior of 'window.location'.
	//
	// Use 'performance' API for browsers other than 'Firefox', to
	// properly handle text fragments MDN recommends never using user agent or
	// browsers to determine logic, but this is the only way in Chrome to
	// guaranteed to be given the full URL now that Chrome may remove parts of
	// the URL. (WTF).
	//
	// When running files locally, calling
	// `performance.getEntriesByType('navigation')[0].name`
	// will return an empty string. Thus, running a file locally that uses
	// URLFormJS, and using Chrome, will have no way of preserving fragment
	// directives in the URL, since they cannot be interpreted by the browser.
	// Another problem under this circumstance is that if the fragment
	// directive comes before the fragment query, the fragment query will not
	// be interpreted either.
	// TODO Implement Chrome API for directives when supported:
	// https://github.com/WICG/scroll-to-text-fragment/blob/main/fragment-directive-api.md

	// See issues for not retrieving full URL (with fragment directives) when
	// using 'file://' protocol:
	// https://github.com/mozilla/standards-positions/issues/194#issuecomment-1224592766
	// https://github.com/WICG/scroll-to-text-fragment/issues/196#issue-1348444072

	// Can't use 'name' in performance when running locally.
	if (window.location.protocol !== "file:" && !navigator.userAgent.includes('Firefox')) {
		fParts = performance.getEntriesByType('navigation')[0].name.split("#");
	}

	if (fParts.length == 1) { // only "#"
		return "";
	}
	return fParts[1];
}


/**
 * Does the processing and checking for a parameter in the params form.
 * Sets GUI for each parameter, and executes funcTrue() per parameter, if
 * applicable. See docs in 'FormOptions'.
 * Form wide options are also executed (e.g. 'callback' in 'FormOptions').
 *
 * @param   {QuagPairs}    kv
 * @param   {FormOptions}  formOptions
 * @returns {void}
 */
function setGUI(kv, formOptions) {
	try {
		for (let fp of formOptions.FormParameters) {
			// Set as vars to avoid mutability.
			let name = fp.name;
			let value = kv[name];
			let id = fp.id;

			// If id is empty, assume name is the id on the page.
			if (isEmpty(id)) {
				id = formOptions.prefix + name;
			}

			// Run func if set
			if (!isEmpty(fp.func)) {
				fp.func();
			}

			// Run funcTrue. Value may be "true", or empty "" if in the URL and with no
			// value set, but not `undefined`.  Name only is considered a flag and is
			// interpreted as true.
			if (!isEmpty(fp.funcTrue) && ((fp.type == "bool" && value !== undefined) || (value === "true" || value === true))) {
				fp.funcTrue();
			}

			// Attempt to get value from local storage if it hasn't already been
			// set by URI.  
			if (isEmpty(value)) {
				value = getSavedSetting(name, formOptions);
			}
			let e = document.getElementById(id);
			if (e == null) {
				continue;
			}

			// Set GUI bool elements.  
			if (!isEmpty(value)) {
				// Checks checkbox elements if type=bool and value==true.
				if (fp.type == "bool" && (value == "true" || value === true)) {
					e.checked = true;
				} else {
					// Set GUI Non-bool inputs.  
					e.value = value;
				}
			}

			if (fp.saveSetting) {
				e.addEventListener("input", () => {
					setSavedSetting(name, this.value, formOptions)
				});
			}

		}
	} finally {
		//// Form wide options

		// Callback if any.
		if (!isEmpty(formOptions.callback)) {
			formOptions.callback();
		}
	}
}

/**
 * Gets the setting. 
 * @param   {string}       name
 * @param   {FormOptions}  formOptions
 * @returns {void}
 */
function getSavedSetting(name, formOptions) {
	return localStorage.getItem(formOptions.localStorageNamespace + formOptions.prefix + name);
}

/**
 * Sets the setting. 
 * @param   {string}       name
 * @param   {string}       value
 * @param   {FormOptions}  formOptions
 * @returns {void}
 */
function setSavedSetting(name, value, formOptions) {
	return localStorage.setItem(localStorageNamespace + formOptions.prefix + name, value);
}

/**
 * Sanitizes a formOptions object, and sets all of the options values to
 * their default value if not set.
 * 
 * Modifies "in place" as well as returns the object.
 * 
 * For new options/setting FormOptions, Init() must be re-called.
 * 
 * @param   {FormOptions} formOptions
 * @returns {FormOptions}
 * @throws  {Error}        Fails if FormOptions or 'id' in options is empty.
 */
function sanitizeFormOptions(formOptions) {
	// Not making a copy will modify the original, even though it's a const.
	let foc = {
		...DefaultFormOptions
	};
	// If no options given, use default.
	if (isEmpty(formOptions)) {
		return foc;
	}
	// If FormOptions has already been sanitized, do nothing.
	if (!isEmpty(formOptions.Sanitized) && formOptions.Sanitized === true) {
		return;
	}

	//// Sanitize
	if (!isEmpty(formOptions.formID)) {
		foc.formID = formOptions.formID;
	}
	if (!isEmpty(formOptions.prefix)) {
		foc.prefix = formOptions.prefix;
	}
	if (!isEmpty(formOptions.clearBtn)) {
		foc.clearBtn = formOptions.clearBtn;
	}
	if (!isEmpty(formOptions.shareURLArea)) {
		foc.shareURLArea = formOptions.shareURLArea;
	}
	if (!isEmpty(formOptions.shareURL)) {
		foc.shareURL = formOptions.shareURL;
	}
	if (!isEmpty(formOptions.shareURLBtn)) {
		foc.shareURLBtn = formOptions.shareURLBtn;
	}
	if (!isEmpty(formOptions.defaultQueryLocation)) {
		foc.defaultQueryLocation = formOptions.defaultQueryLocation;
	}
	if (!isEmpty(formOptions.callback)) {
		foc.callback = formOptions.callback;
	}
	if (!isEmpty(formOptions.cleanURL)) {
		foc.cleanURL = formOptions.cleanURL;
	}
	if (!isEmpty(formOptions.localStorageNamespace)) {
		foc.localStorageNamespace = formOptions.localStorageNamespace;
	}

	// Options with limited valid values.  
	if (formOptions.defaultQueryLocation !== QueryLocationQuery) {
		foc.defaultQueryLocation = QueryLocationFragment;
	}

	foc.Sanitized = true;
	return foc;
}

/**
 * Generates a share URL from the current URL and form, populates the GUI, and
 * returns the URL. Fragment queries take precedence over query parameters.
 * 
 * @param   {FormOptions}   formOptions
 * @returns {URL}           Javascript URL object.
 */
function shareURI(formOptions) {
	let q = getQuagParts(formOptions); // Current URL values.
	let formPairs = GetForm(formOptions); // Current form values.
	console.log("QuagParts:", q, "formPairs:", formPairs);

	var u = new URL(window.location.origin + window.location.pathname);

	for (let fp of formOptions.FormParameters) {
		let value = formPairs[fp.name];
		// console.log(fp, value);
		if (isEmpty(value)) {
			// Sets value if populated.  Otherwise removes from the query/fragment. (A
			// query parameter set in fragment, or a fragment parameter set in Query.
			// Note: bools on false will not have been cleared yet.)
			u.searchParams.delete(fp.name);
			delete q.fragment.pairs[fp.name];
			continue;
		}

		// Set to Fragment
		if (fp.queryLocation === QueryLocationFragment) {
			u.searchParams.delete(fp.name);
			q.fragment.pairs[fp.name] = value;
			continue;
		}

		// Set to Query
		u.searchParams.set(fp.name, value);
		delete q.fragment.pairs[fp.name];
	}

	// Query extras
	if (!isEmpty(q.query.extras) && !formOptions.cleanURL) {
		for (let e in q.query.extras) {
			u.searchParams.set(e, q.query.extras[e]);
		}
	}

	// console.log(q);
	// Rebuild fragment query in case new form fields were set.
	u.hash = quagPartsToURLHash(q.fragment, formOptions);
	setShareURL(u.href, formOptions);

	return u;
};


/**
 * Sets the URL on share link and share area.  
 * @param   {String}       href
 * @returns voice
 */
function setShareURL(href, formOptions) {
	// URI Link
	let shareUrl = document.querySelector(formOptions.shareURL);
	if (shareUrl !== null) {
		shareUrl.innerHTML = href.link(href);
	}

	// Text Area 
	let shareArea = document.querySelector(formOptions.shareURLArea);
	if (shareArea !== null) {
		shareArea.innerHTML = href;
	}
}


/**
 * Generates a fragment string from Fragment.
 * 
 * @param   {Fragment}      fragment
 * @param   {FormOptions}   formOptions
 * @returns {String}        Fragment string (#<before>?<middle>[delimiter]<after>).
 */
function quagPartsToURLHash(fragment, formOptions) {
	console.log(fragment);
	// Concatenate fragment ("#") and before.
	let fqs = "#" + fragment.before;

	// Middle.  Build the fragment query.  (Query is the middle).
	var i = Object.keys(fragment.pairs).length;
	if (i != 0) {
		fqs += "?"; //start fragment query delimiter ("?")
		for (let key in fragment.pairs) {
			i--;
			fqs += key + "=" + fragment.pairs[key]
			if (i > 0) {
				fqs += "&"; // Add separator on everything except the last.  
			}
		}
	}

	// Extras (still in middle)
	let j = Object.keys(fragment.extras).length;
	if (Object.keys(fragment.pairs).length && j > 0) {
		fqs += "&"; // Prepend extras with ampersand if fragment is populated. 
	}
	// Append extras back in query params
	if (j > 0 && !formOptions.cleanURL) {
		for (let e in fragment.extras) {
			j--;
			fqs += e + "=" + fragment.extras[e]
			if (j > 0) {
				fqs += "&";
			}
		}
	}

	// After.  
	fqs += fragment.after;
	return fqs;
}


/**
 * Returns from `key=value` string a `key:value` object.
 * @param   {String}      s   e.g. `key=value&key=value`.  
 * @returns {QuagPairs}       {key:value}
 */
function getPairs(s) {
	if (isEmpty(s)) {
		return {};
	}

	let pairs = {};
	let parts = s.split('&');
	for (const i in parts) {
		let kv = parts[i].split('=');
		let key = kv[0];
		let value = kv[1];
		// If the string begins/ends with "&", there will be an empty element. 
		if (isEmpty(key)) { 
			continue;
		}
		// Sanitize to string. (Don't use isEmpty as string "true"/"false" are valid.)
		if (value === undefined || value === null) {
			value = "";
		}
		// Browsers automatically escape values. Javascript 'unescape()' is deprecated.
		value = decodeURI(value);
		pairs[key] = value;
	}
	console.log(pairs);
	return pairs;
}

/**
 * getFragment returns (fragment,pairs,before,query,after) from the URL
 * fragment, but not (extras). Warning: Puts all pairs, including extras, into
 * pairs.  
 * @returns {Fragment}
 */
function getFragment() {
	let frag = {
		string: getFragmentString(), // The whole fragment including `#`. 
		pairs: {},
		extras: {},
		before: "",
		query: "",
		after: "",
	};
	console.log(frag);

	// Check if fragment query has 'before'.
	let ss = frag.string.split('?');
	if (ss.length == 0) {
		frag.query = ss[0];
	} else {
		frag.before = ss[0];
		frag.query = ss[1];
	}

	// Check for after. Fragment queries supports beginning delimiters for other
	// fragment schemes, like fragment directive `:~:`.
	if (!isEmpty(frag.query)) {
		let s = frag.query.split(':~:');
		if (s.length > 1) {
			frag.query = s[0];
			frag.after = ':~:' + s[1];
		}
	}
	let pairs = getPairs(frag.query);
	console.log(pairs);
	frag.pairs = pairs;
	console.log(frag);

	// Javascript deep copy
	return JSON.parse(JSON.stringify(frag));
}


/**
 * getQueryParts returns QuagParts generated from the current URL, not the
 * form, and puts values into the correct object based on formOptions.
 * Includes extras.  See docs on `QuagParts`.
 * 
 * @param   {FormOptions}   formOptions
 * @returns {QuagParts}
 */
function getQuagParts(formOptions) {
	let qp = {
		query: {
			string: window.location.search.substring(1), // substring removes "?"
			pairs: getPairs(window.location.search.substring(1)),
			extras: {},
		},
		fragment: getFragment(),
	};

	qp.pairs = {
		...qp.query.pairs,
		...qp.fragment.pairs,
	};


	// Generate extras and remove any extras from Query and Fragment.  
	let formParams = [];
	for (let p of formOptions.FormParameters) {
		formParams.push(p.name);
	}

	// Extra query pairs.  
	for (let key of Object.keys(qp.query.pairs)) {
		if (!formParams.includes(key)) {
			qp.query.extras[key] = qp.query.pairs[key];
			delete qp.query.pairs[key];
		}
	}
	// Extra frag pairs. 
	for (let key of Object.keys(qp.fragment.pairs)) {
		if (!formParams.includes(key)) {
			qp.fragment.extras[key] = qp.fragment.pairs[key];
			delete qp.fragment.pairs[key];
		}
	}

	return qp;
}


/**
 * Serialize serializes the initialized FormParameters that are populated in the
 * GUI into a JSON string.
 * 
 * @param   {FormOptions}   formOptions
 * @returns {String}
 */
function Serialize(formOptions) {
	return JSON.stringify(GetForm(formOptions));
};


/**
 * GetForm gets current form values from the GUI into {key:value,key:value}.
 * 
 * @param   {FormOptions}   formOptions
 * @returns {QuagPairs}     // key/value
 */
function GetForm(formOptions) {
	if (!formOptions.Inited) {
		throw new Error("URLFormJS: Init() must be called first to initialize the URLFormJS module.");
	}

	let pairs = {};
	// Normal usage, Not FormMode.  On individual ID's, not in a <form>.
	if (!formOptions.FormMode) {
		for (let fp of formOptions.FormParameters) {
			let htmlID = fp.name;
			if (!isEmpty(fp.id)) {
				htmlID = fp.id;
			}
			let elem = document.getElementById(formOptions.prefix + htmlID);
			let value;
			if (elem !== null) {
				value = elem.value;
				if (fp.type === "bool") {
					value = elem.checked;
				}
			}
			if (!isEmpty(value)) {
				pairs[fp.name] = value;
			}
		}
		return pairs;
	}

	// FormMode=true.  In a <form>.
	let formData = new FormData(formOptions.FormElement); // throws
	for (let [name, value] of formData) {
		if (value == "true" || value == "on") {
			value = true;
		}
		if (value == "false" || value == "unchecked") {
			value = false;
		}

		// Remove prefix, if set.
		if (!isEmpty(formOptions.prefix)) {
			name = name.substring(formOptions.prefix.length);
		}

		if (!isEmpty(value)) {
			pairs[name] = value;
		}
	}
	return pairs;
};


/**
 * Clear clears out a form.
 *
 * @param   {FormOptions}   formOptions
 * @returns {void}
 */
function Clear(formOptions) {
	if (!formOptions.Inited) {
		throw new Error("URLFormJS: Init() must be called first to initialize the URLFormJS module.");
	}

	// FormMode clear
	if (formOptions.FormMode) {
		//https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements
		for (let e of FormOptions.FormElement.elements) {
			if (e.type === "checkbox") {
				e.checked = false;
			} else {
				e.value = "";
			}
		}
		return;
	}

	// Normal Mode clear (clear each element individually)
	for (let fp of formOptions.FormParameters) {
		let name = formOptions.prefix + fp.name;
		let id = fp.id
		// If id is empty, assume name is the id on the page.
		if (isEmpty(id)) {
			id = name;
		}

		// Unchecks if type=bool. Otherwise sets value of the element to "";
		if (fp.type == "bool") {
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
	// Clear the share URL.  
	var u = new URL(window.location.origin + window.location.pathname)
	setShareURL(u.href, formOptions);
}

/**
 * IsEmpty returns whether or not the initialized form is empty.
 * 
 * @param   {FormOptions}   formOptions
 * @returns {Boolean}  Whether or not the form is empty.
 * @throws  {Error}    Fails if form is not of type HTMLFormElement.
 */
function IsEmpty(formOptions) {
	return isEmpty(GetForm(formOptions));
}

/**
 * GetDefaultFormOptions returns the Initialized default form options.
 * NOTE: Exporting DefaultFormOptions directly will make it to where the
 * UMD format block needs to be at the bottom of the file, after initialization.
 * 
 * @returns {FormOptions}
 */
function GetDefaultFormOptions() {
	return DefaultFormOptions;
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