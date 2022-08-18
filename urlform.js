"use strict";

/**
 * URLFormJS is used for sticky forms and sharable URL links. URLFormJS also use
 * `Fragments` heavily. See README. `Init()` must be called to initialize the 
 * module. Certain elements, such as the ShareURL Button, if being
 * used, must specify the Element's id on the page in `FormOptions`, before
 * calling `Init()`.
 * 
 * Calling 'ObjectifyForm' and 'SerializeForm' requires 'id' to be set in
 * 'FormOptions', which should be the HTMLFormElement's id in the GUI.
 *
 * `DefaultFormOptions` is exported, for READ ONLY capabilities of seeing
 * default `FormOptions`.
 *
 * `FormOptions` shows the options for the initialized form.
 *
 * `FormParameters` shows the parameters/fields for the initialized form.
 *
 * TODO: Long term: make this library work with many instances of form.
 */

/**
 * NOTE - Problems with JSDOC: The JSDOc type "any" is a bug on anything with
 * the type Object.  This bug does not appear to be ever fixed. See
 * https://github.com/microsoft/TypeScript/issues/18396
 * 
 * Since 'object' is diluted in meaning by JSDoc, '{}' is used to denote a 
 * key:value object in JSDoc.
 * See: https://github.com/microsoft/TypeScript/issues/50321#issuecomment-1217224937
 * 
 * Also, JSDoc will use the '@alias' when a variable is typed with '@type' and
 * exported. The "hover over" outside this module will reference this typedef
 * and classifies the type as a member of the typedef. Any export that shares a
 * name with a typedef will show jsdoc "alias" for both the typedef and the
 * variable.  The typedef's docs works as expected outside of the module. 
 * 
 * For some reason, exporting 'DefaultFormOptions' will properly type the object
 * but the typedef docs are not carried with it. (Jared) I can't find a clear
 * explanation for why this is the case. The closest I can find is the
 * following: When using the 'exports' object in modules, the '@module' tag is
 * not needed, and automatically recognizes the object's members are being
 * exported: https://jsdoc.app/tags-exports.html
 */

/**
 * Useful examples:
 * 
 * Where '!' needs to be percent encoded to work properly in the text fragment.
 * https://localhost:8082/#a:~:text=Hello&text=World&text=!%20news&?first_name=Hello&last_name=World&phone_number=!
 * 
 * Malformed text fragment (missing '&').
 * https://localhost:8082/#anchor:~:text=hello?first_name=Hello&last_name=World
 * 
 * Correct text fragment (present '&').
 * https://localhost:8082/#anchor:~:text=hello&?first_name=Hello&last_name=World
 * 
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
	SerializeForm,
	Objectify,
	ObjectifyForm,
	Clear,
	ClearForm,
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
 *                  be a query parameter, or a fragment query. Defaults to empty
 *                  string, which will inherit the 'defaultQueryLocation' from
 *                  the form wide options.
 * @typedef  {Object}        FormParameter
 * @property {String}        name
 * @property {String}        [id]
 * @property {ParamType}     [type=string]
 * @property {Function}      [func]
 * @property {Function}      [funcTrue]
 * @property {QueryLocation} [queryLocation=""]
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
 * - "fragment": The query is preceeded by '#' and '?'.
 * - "query":    The query is preceeded by '?'.
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
 * - id:                   HTMLFormElement ID on the page for the initialized form.
 * 
 * - prefix:               Form input prefix which will be prepended to name.
 * 
 * - shareURLBtn:          Button element for sharing the form in the URL.
 * 
 * - shareURL:             Will share the link as a URL.
 * 
 * - shareURLArea:         Will share the link as a text.
 * 
 * - defaultQueryLocation: Whether form link generates as a fragment query, or a
 *                         regular query. Defaults to fragment query, which is
 *                         the recommended use, if possible. Can only be either
 *                         'fragment' or 'query', and not empty.
 * 
 * - preserveExtra:        Whether or not to preserve extra query parameters.
 *                         Default is set to false, and does not preserve extra
 *                         parameters.
 * 
 * - callback:             Function that's executed each time the form is
 *                         processed.
 * 
 * - cleanURL:             If set to `true`, does not preserve any extra
 *                         information from the URL that is not in the
 *                         initialized form.
 * @typedef  {Object}               FormOptions
 * @property {String}               [id]
 * @property {String}               [prefix]
 * @property {String}               [shareURLBtn]
 * @property {String}               [shareURL]
 * @property {String}               [shareURLArea]
 * @property {QueryLocation}        [defaultQueryLocation="fragment"]
 * @property {Boolean}              [preserveExtra=false]
 * @property {Function}             [callback]
 * @property {Boolean}              [cleanURL]
 *
 * 
 * Properties that are intended for use within this module.
 * 
 * The following definitions preclude 'URLFormJS_' for brevity.
 * - Sanitized:          Whether 'FormOptions' has been sanitized.
 * - Inited:             Whether URLFormJS module was initialized.
 * - HasForm:            Whether 'FormOptions' includes a form 'id' and is found in the GUI.
 * - FormElement:        Form element in GUI, specified by 'id' in 'FormOptions'.
 * - ShareURLBtnElement: Share URL button element in GUI.
 * @protected {Boolean}             URLFormJS_Sanitized=false
 * @protected {Boolean}             URLFormJS_Inited=false
 * @protected {Boolean}             URLFormJS_HasForm=false
 * @protected {HTMLFormElement}     URLFormJS_FormElement
 * @protected {HTMLButtonElement}   URLFormJS_ShareURLBtnElement
 */

/**
 * Query is the Query string.  Everything after first ? and before first #.
 * @typedef {String}    Query
 */

/**
 * Fragment is the Fragment string without `#`.  Everything after the first #.
 * @typedef {String}    Fragment
 */

/**
 * QuagPairs is an Object of key:value pairs for both Query Parameters and
 * Fragment Query Parameters. `quag` is the superset of `query` and `fragment`.
 * 'object' is diluted in meaning by JSDoc, and using '{}' will denote a key:val
 * object. See: https://github.com/microsoft/TypeScript/issues/50321#issuecomment-1217224937
 * @typedef {{}}   QuagPairs
 */

/**
 * FragmentParts holds the fragment parts from the URL. All parts may be nil.
 * 
 * - before:   Everything after '#' and if exists everything before the first '?'.
 * - query:    Everything after `before` and before the next ':~:' (or other fragment scheme delimiter).
 * - after:    Everything after `query`.
 * @typedef  {Object}    FragmentParts
 * @property {String}    before
 * @property {String}    query
 * @property {String}    after
 */

/**
 * QuagParts holds the parsed query and fragment portion of the URL.  See README on `quag`.
 *
 * - query:           The string URL query component. Does not contain any fragment.
 * - queryPairs:      key:value object containing the queries.
 * - fragment:        Fragment string is everything after '#' (full fragment).
 * - fragmentParts:   FragmentParts object containing fragment string, before, query, and after.
 * - fragmentPairs:   key:value object containing the fragment queries.
 * - pairs:           key:value object containing `queryPairs` and `fragmentPairs`.
 * @typedef  {Object}           QuagParts
 * @property {Query}            query
 * @property {QuagPairs}        queryPairs
 * @property {Fragment}         fragment
 * @property {QuagPairs}        fragmentPairs
 * @property {FragmentParts}    fragmentParts
 * @property {QuagPairs}        pairs
 */

/**
 * ExtraParameters holds the extra fields given in a URL that are not in the
 * initialized form.
 * Object properties will be in key:value objects.
 * 
 * - query:     Extra query parameters given in the URL, not in the form.
 * - queryKeys: Extra Query parameter keys from the `query` object.
 * - frag:      Extra fragment query parameters given in the URL, not in the form.
 * - fragKeys:  Extra Frag query parameter keys from the `frag` object.
 * @typedef   {Object}        ExtraParameters
 * @property  {QuagPairs}     query
 * @property  {Array<String>} queryKeys
 * @property  {QuagPairs}     frag
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
	defaultQueryLocation: "fragment",
	preserveExtra: false,
	callback: null,
	cleanURL: false,

	// Module protected fields
	/**
	 * Global state for whether FormOptions has been sanitized.
	 * @protected */
	URLFormJS_Sanitized: false,
	/**
	 * Global state for whether URLFormJS module has been initialized.
	 * @protected */
	URLFormJS_Inited: false,
	/**
	 * Global state for whether FormOptions has 'id' set, and the HTMLFormElement
	 * was found in the GUI.
	 * @protected */
	URLFormJS_HasForm: false,
	/**
	 * Global HTMLFormElement per FormOptions.
	 * @protected */
	URLFormJS_FormElement: HTMLFormElement,
	/**
	 * Global Share URL Button per FormOptions.
	 * @protected */
	URLFormJS_ShareURLBtnElement: HTMLButtonElement,
};

/** Global FormOptions state, set by InitForm (which calls sanitizeFormOptions)
 * @type {FormOptions} */
var FormOptions;

/** Global FormParameters state, set by InitForm
 * @type {FormParameters} */
var FormParameters;

/**
 * Initializes the globals and event listeners for the URLFormJS module.
 * If 'formOptions' is empty, the default options will be used.
 * 
 * @param   {FormParameters} params          FormParameters object.
 * @param   {FormOptions}    [formOptions]   FormOptions object.
 * @returns {void}
 */
function Init(params, formOptions) {
	FormParameters = params;
	FormOptions = {};
	FormOptions = sanitizeFormOptions(formOptions);
	FormOptions.URLFormJS_ShareURLBtnElement = document.querySelector(FormOptions.shareURLBtn);
	if (FormOptions.URLFormJS_ShareURLBtnElement != null) {
		FormOptions.URLFormJS_ShareURLBtnElement.addEventListener('click', () => shareURI()); // Must be anonymous, otherwise passes pointer event object.
	}
	if (!isEmpty(FormOptions.id)) {
		FormOptions.URLFormJS_FormElement = document.getElementById(FormOptions.id);
		if (FormOptions.URLFormJS_FormElement !== null) {
			FormOptions.URLFormJS_HasForm = true;
		}
	}
	FormOptions.URLFormJS_Inited = true;
}

/**
 * PopulateFromURI populates the GUI from the URI, if any of the form params
 * are supplied in the URI Query.
 *
 * @returns {void}
 * @throws  {Error} Fails if Init() has not been called for the URLFormJS module.
 */
function PopulateFromURI() {
	if (!FormOptions.URLFormJS_Inited) {
		throw new Error("URLFormJS: Init() must be called first to initialize the URLFormJS module.");
	}
	PopulateFromValues(getQuagParts().pairs);
	shareURI();
}

/**
 * Populates the form initialized in `Init()` from the given values. Values are
 * the given values to populate the form.
 * 
 * @param   {QuagPairs} values          A key:value pair JSON object.
 * @returns {void}
 */
function PopulateFromValues(values) {
	if (!FormOptions.URLFormJS_Inited) {
		throw new Error("URLFormJS: Init() must be called first to initialize the URLFormJS module.");
	}
	setGUI(values);
}

/**
 * getQueryParts returns QuagParts generated from the current URL.
 * See `QuagParts` docs.
 * 
 * @returns {QuagParts}
 */
function getQuagParts() {
	let QuagParts = {
		query: window.location.search,
		queryPairs: getQueryPairs(),
		fragment: getFragment(),
		fragmentParts: getFragmentParts(),
		fragmentPairs: getFragmentQueryPairs(),
	};

	QuagParts.pairs = {
		...QuagParts.queryPairs,
		...QuagParts.fragmentPairs,
	};

	return QuagParts;
}

/**
 * getQueryPairs returns URL query parameters as a key:value pair object.
 *
 * @returns {QuagPairs}       Object. key:value pairs.
 */
function getQueryPairs() {
	var url = new URL(window.location.href);
	let pairs = {};
	for (var pair of url.searchParams.entries()) {
		pairs[pair[0]] = pair[1];
	}
	return pairs;
}

/**
 * Returns URL fragment query parameters as a key:value pair object.
 *
 * @returns {QuagPairs}       Object. key:value pairs.
 */
function getFragmentQueryPairs() {
	let fq = getFragmentParts().query;
	var pairs = {};
	if (!isEmpty(fq)) {
		fq.split('&').forEach((q) => {
			let pair = q.split('=');
			if (pair[1] === undefined) {
				pairs[pair[0]] = null;
				return; // In anonymous func.
			}
			// Browsers automatically escape values. 'unescape' deprecated.
			pairs[pair[0]] = decodeURI(pair[1]);
		});
	}
	return pairs;
}

/**
 * getFragment returns URL fragment.  See notes in function.
 * The URL fragment does not include '#'.
 *
 * @returns {String}
 */
function getFragment() {
	var frag = window.location.hash.split("#"); // May not work in chrome, see note below.

	// Chrome removes ':~:' (fragment directives (for text fragments)), and
	// anything after the text fragment. Thus, calling 'window.location.hash' with
	// a URL of:
	// https://localhost:8082/#:~:text=hello?first_name=asdf&last_name=hello will
	// result: '#a'. And calling 'window.location.hash' with a URL of:
	// https://localhost:8082/#?first_name=asdf&last_name=hello:~:text=hello will
	// result: '#?first_name=asdf&last_name=hello'. Firefox sees and preserves the
	// text fragment. See:
	// https://stackoverflow.com/a/73366996/1923095
	// and https://github.com/WICG/scroll-to-text-fragment/issues/193#issuecomment-1219640246
	//
	// FireFox's way of handling the text fragment using 'window.location'is
	// correct and the following performs a secondary check for other browsers
	// (Chrome) that have changed the behavior of 'window.location'.
	//
	// Use 'performance' package for browsers other than 'Firefox', to properly
	// handle text fragments MDN recommends never using user agent or browsers to
	// determine logic, but this is the only way in Chrome to guaranteed to be
	// given the full URL now that Chrome may remove parts of the URL.  (WTF).  
	if (!navigator.userAgent.includes('Firefox')) {
		frag = performance.getEntriesByType('navigation')[0].name.split("#");
	}

	if (frag.length < 2) {
		return "";
	}
	return frag[1];
}

/**
 * getFragmentParts returns before, query, and after from the URL fragment.
 *
 * @returns {FragmentParts}
 */
function getFragmentParts() {
	let parts = { // Initialize to avoid "undefined"
		before: "",
		query: "",
		after: "",
	};
	let ss = getFragment().split('?');
	// Check if fragment has 'query' and 'before'.
	if (ss.length > 1) {
		parts.before = ss[0];
		parts.query = ss[1];
	} else {
		parts.before = ss[0];
		return parts;
	}

	// Check for after. Fragment queries supports ending delimiters for other
	// common schemes, such as the delimiter of `:~:` for fragment directives .
	// Ignore anything after these ending delimiters.
	// TODO future: support other scheme starting delimiters and perhaps `?` for
	// fragment queries.
	if (!isEmpty(parts.query)) {
		let s = parts.query.split(':~:');
		if (s.length > 1) {
			parts.query = s[0];
			parts.after = ':~:' + s[1];
		}
	}

	return parts;
}

/**
 * Does the processing and checking for a parameter in the params form.
 * Sets GUI for each param, and executes funcTrue() per param, if applicable.
 * Form wide options are also executed (e.g. 'callback' in 'FormOptions').
 *
 * @param   {QuagPairs} kv    Object. key:value pair JSON object.
 * @returns {void}
 */
function setGUI(kv) {
	try {
		for (let fp of FormParameters) {
			// Set as vars to avoid mutability.
			let name = fp.name;
			let value = kv[name];
			let id = fp.id;

			// If id is empty, assume name is the id on the page.
			if (isEmpty(id)) {
				id = FormOptions.prefix + name;
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
	} finally {
		//// Form wide options

		// Callback if any.
		if (!isEmpty(FormOptions.callback)) {
			FormOptions.callback();
		}
	}
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
 * @returns {FormOptions}              FormOptions
 * @throws  {Error}       fails if FormOptions or 'id' in options is empty.
 */
function sanitizeFormOptions(formOptions) {
	// Not making a copy will modify the original, even though it's a const.
	let defaultFormOpts = {
		...DefaultFormOptions
	};
	// If no options given, use default.
	if (isEmpty(formOptions)) {
		return defaultFormOpts;
	}
	// If FormOptions has already been sanitized, do nothing.
	if (!isEmpty(formOptions.URLFormJS_Sanitized) && formOptions.URLFormJS_Sanitized === true) {
		return;
	}

	//// Sanitize
	if (!isEmpty(formOptions.id)) {
		defaultFormOpts.id = formOptions.id;
	}
	if (!isEmpty(formOptions.prefix)) {
		defaultFormOpts.prefix = formOptions.prefix;
	}
	if (!isEmpty(formOptions.shareURLArea)) {
		defaultFormOpts.shareURLArea = formOptions.shareURLArea;
	}
	if (!isEmpty(formOptions.shareURL)) {
		defaultFormOpts.shareURL = formOptions.shareURL;
	}
	if (!isEmpty(formOptions.shareURLBtn)) {
		defaultFormOpts.shareURLBtn = formOptions.shareURLBtn;
	}
	if (!isEmpty(formOptions.defaultQueryLocation)) {
		defaultFormOpts.defaultQueryLocation = formOptions.defaultQueryLocation;
	}
	if (defaultFormOpts.defaultQueryLocation !== "query") {
		defaultFormOpts.defaultQueryLocation = DefaultFormOptions.defaultQueryLocation;
	}
	if (!isEmpty(formOptions.preserveExtra)) {
		defaultFormOpts.preserveExtra = formOptions.preserveExtra;
	}
	if (!isEmpty(formOptions.callback)) {
		defaultFormOpts.callback = formOptions.callback;
	}
	if (!isEmpty(formOptions.cleanURL)) {
		defaultFormOpts.cleanURL = formOptions.cleanURL;
	}
	/** @protected */
	defaultFormOpts.URLFormJS_Sanitized = true;
	return defaultFormOpts;
}

/**
 * Generates a share URL, populates the GUI, and returns the URL.
 * Fragment queries will take precedence over query parameters.
 * 
 * @returns {URL}             Javascript URL object.
 */
function shareURI() {
	let q = getQuagParts();
	let fragKeys = Object.keys(q.fragmentPairs);
	var url = new URL(window.location.origin + window.location.pathname);

	for (let fp of FormParameters) {
		let name = fp.name;
		let id = fp.id;

		// `name` is default id for html element. `id` overrides `name` for html
		// elements ids.
		let htmlID = name;
		if (!isEmpty(id)) {
			htmlID = id;
		}

		var elem = document.getElementById(FormOptions.prefix + htmlID);
		let value;
		if (elem !== null) {
			value = elem.value;
			if (fp.type === "bool") {
				if (elem.checked) {
					value = "true";
				} else {
					value = "";
				}
			}
		}

		// Inherit default query location if empty, not set, or not a recognized
		// 'QueryLocation'.
		if ((fp.queryLocation === "" || isEmpty(fp.queryLocation) || (fp.queryLocation !== "fragment" || fp.queryLocation !== "query"))) {
			fp.queryLocation = FormOptions.defaultQueryLocation;
		}

		// Sets value if populated, otherwise removes the name from the query param.
		// If 'queryLocation' is set to "fragment" on a form wide basis, all values
		// will be part of the fragment query.
		let e = isEmpty(value);
		if (!e && (fp.queryLocation === "fragment" || fragKeys.includes(name))) {
			q.fragmentPairs[name] = value;
		} else if (!e) {
			url.searchParams.set(name, value);
		} else {
			// Cleans out value from string in case it is set in the URI already.
			// (e.g. bools on false will not be cleared)
			url.searchParams.delete(name);
			delete q.fragmentPairs[name];
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
	url.hash = quagPartsToURLHash(q, extras);

	// URI Link
	let shareUrl = document.querySelector(FormOptions.shareURL);
	if (shareUrl !== null) {
		shareUrl.innerHTML = url.href.link(url.href);
	}

	// Text Area 
	let shareArea = document.querySelector(FormOptions.shareURLArea);
	if (shareArea !== null) {
		shareArea.innerHTML = url.href;
	}

	return url;
};

/**
 * Returns the extra fields that are not specified in the initialized form
 * from both query params and fragment queries.
 * 
 * @returns {ExtraParameters}      Object. ExtraParameters object.
 */
function getExtraParameters() {
	let qp = getQuagParts();

	/** @type {ExtraParameters} */
	let extras = {
		query: {},
		frag: {},
		queryKeys: [],
		fragKeys: [],
	};

	let queryKeys = Object.keys(qp.queryPairs);
	let fragKeys = Object.keys(qp.fragmentPairs);

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
			extras.frag[key] = qp.pairs[key];
			extras.fragKeys.push(key);
		}
	}

	return extras;
}

/**
 * Returns a fragment query string from a fragment query key:value object.
 * Returns empty string if 'qp.fragmentParts' object is empty.
 * 
 * @param   {QuagParts}       qp          Object. QuagParts
 * @param   {ExtraParameters} extras      Object. ExtraParameters.
 * @returns {String}                      String. Fragment query string (#?...).
 */
function quagPartsToURLHash(qp, extras) {
	if (isEmpty(qp.fragmentParts)) {
		return "";
	}
	let fqs = "#";
	if (!isEmpty(qp.fragmentParts.before)) {
		fqs += qp.fragmentParts.before;
	}
	fqs += "?";
	var last = Object.keys(qp.fragmentPairs).length - 1;
	var i = 0;
	var suffix = "&";
	if (last === 0) {
		suffix = "";
	}
	for (let key in qp.fragmentPairs) {
		if (i === (last)) {
			suffix = "";
		}
		i++;
		if (extras.fragKeys.includes(key)) {
			continue;
		}
		fqs += key + "=" + qp.fragmentPairs[key] + suffix;
	}

	// Set extras back in query params, if given and 'cleanURL' is false in 'FormOptions'.
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
	fqs += qp.fragmentParts.after;
	return fqs;
}


/**
 * Serialize serializes the initialized FormParameters that are populated in the
 * GUI into a JSON string.
 * 
 * @returns {String}
 */
function Serialize() {
	return JSON.stringify(Objectify());
};

/**
 * SerializeForm serializes the initialized 'HTMLFormelement' into a JSON
 * string.
 *
 * @returns {String}
 * @throws  {Error}   Fails if form is not of type HTMLFormElement.
 */
function SerializeForm() {
	return JSON.stringify(ObjectifyForm());
};

/**
 * Objectify makes the initialized FormParameters that are populated in the GUI
 * into a JSON object.
 * 
 * @returns {QuagPairs}
 */
function Objectify() {
	if (!FormOptions.URLFormJS_Inited) {
		throw new Error("URLFormJS: Init() must be called first to initialize the URLFormJS module.");
	}
	var pairs = {};
	for (let fp of FormParameters) {
		let htmlID = fp.name;
		if (!isEmpty(fp.id)) {
			htmlID = fp.id;
		}
		var elem = document.getElementById(FormOptions.prefix + htmlID);
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
};

/**
 * ObjectifyForm makes the initialized formElement in the GUI into a JSON
 * object.
 *
 * @returns {QuagPairs}
 * @throws  {Error}        Fails if form is not of type HTMLFormElement.
 */
function ObjectifyForm() {
	if (!FormOptions.URLFormJS_Inited) {
		throw new Error("URLFormJS: Init() must be called first to initialize the URLFormJS module.");
	}
	if (!FormOptions.URLFormJS_HasForm) {
		throw new Error("URLFormJS: Could not find the HTMLFormElement in the GUI. Current 'id' in 'FormOptions': " + FormOptions.id);
	}
	var formData = new FormData(FormOptions.URLFormJS_FormElement); // throws
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
	if (!FormOptions.URLFormJS_Inited) {
		throw new Error("URLFormJS: Init() must be called first to initialize the URLFormJS module.");
	}

	for (let fp of FormParameters) {
		let name = FormOptions.prefix + fp.name;
		let id = fp.id
		// If id is empty, assume name is the id on the page.
		if (isEmpty(id)) {
			id = name;
		}

		// Clears the GUI. Unchecks checkbox elements if type=bool and otherwise
		// sets the value of the element to "";
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
}

/**
 * ClearForm clears out a form from the HTMLFormElement set at initialization.
 * 
 * Form elements:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements
 * Alternative to using HTMLFormElements.elements:
 * https://stackoverflow.com/questions/4431162/get-all-the-elements-of-a-particular-form/4431190#4431190
 * @returns {void}
 * @throws  {Error}        Fails if form is not of type HTMLFormElement.
 */
function ClearForm() {
	if (!FormOptions.URLFormJS_Inited) {
		throw new Error("URLFormJS: Init() must be called first to initialize the URLFormJS module.");
	}
	if (!FormOptions.URLFormJS_HasForm) {
		throw new Error("URLFormJS: Could not find the HTMLFormElement in the GUI. Current 'id' in 'FormOptions': " + FormOptions.id);
	}

	for (let e of FormOptions.URLFormJS_FormElement.elements) {
		if (e.type === "checkbox") {
			e.checked = false;
		} else {
			e.value = "";
		}
	}
}

/**
 * IsEmpty returns whether or not the initialized form is empty.
 * 
 * @returns {Boolean}  Boolean. Whether or not the form is empty.
 * @throws  {Error}    Error.   Fails if form is not of type HTMLFormElement.
 */
function IsEmpty() {
	return isEmpty(Objectify());
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