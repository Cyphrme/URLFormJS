// URLFormJS is used for sticky forms and sharable URL links.  See README. 
'use strict'

/**
 * FormParameter are the options for a form's field/parameter.
 *
 * Example:
 * {
 *  "name": "send_news_and_updates",
 *  "id":   "input_send_news_and_updates',
 *  "type": "bool",
 *  "funcTrue": ()=> ToggleVisible(document.querySelector("#advancedOptions"))
 * }
 *
 * name           Parameter name in the URI.  Is used as the default value for
 *                  id.
 *
 * id             Id of the HTML element if it differs from the name. Example,
 *                  URI parameter "retrieve" and HTML id "Retrieve".
 *
 * type           Type of the parameter (bool/string/number). Defaults to
 *                  string. For 'bool', if the parameter is present in the URL
 *                  and has a function set in 'funcTrue', the function will be
 *                  executed. (e.g. https://localhost/?send_news_and_updates)
 *                  using the example above will execute the 'ToggleVisible'
 *                  function. Negative flags specify an explicit value and are
 *                  only supported on bool types. e.g. `&foo` with a default
 *                  value of `false` will be overwritten to true. A url with
 *                  no query params with a form parameter `foo` having a default
 *                  value of `true` will populate the element with `true`.
 *
 * func           Called if set on each call to SetForm
 *                  (Populate and PopulateFromValues).
 *
 * funcTrue       Execute if param is true. e.g. `"funcTrue": () => {
 *                  ToggleVisible(document.querySelector("#advancedOptions"))}`
 *
 * queryLocation  Option for overriding the param in the URL link to either
 *                  be a query parameter, or a fragment query. Defaults to empty
 *                  string, which will inherit the 'defaultQueryLocation' from
 *                  the form wide options.
 * 
 * nonFormValue   Values that do not appear in the form, but may appear in the
 *                 URL.  URL non-form values will be sticky, e.g. they must be
 *                 manually removed from the URL if already set in the URL.
 *                 Otherwise, ShareURL will preserve all set non-form values.  
 * 
 * saveSetting    Save and use this setting from local storage.  Will be
 *                  overwritten by URL flag values if present.
 * 
 * defaultValue   Element is populated with the specified default value on page
 *                  loads (unless otherwise specified).
 * @typedef  {Object}        FormParameter
 * @property {String}        name
 * @property {String}        [id]
 * @property {ParamType}     [type=string]
 * @property {Function}      [func]
 * @property {Function}      [funcTrue]
 * @property {QueryLocation} [queryLocation=""]
 * @property {NonFormValue}  [nonFormValue]
 * @property {Boolean}       [saveSetting=false]
 * @property {Boolean}       [defaultValue=false]
 * 
 */

/**
 * ParamType is the type for a given FormParameter.
 *
 * A ParamType may be one of the following:
 * - "string":  String and default type.
 * - "bool":    Boolean used for checkboxes.
 * - "number":  Number will convert text values to number and sanitize NaN.
 * - "":        Uses the default.
 * @typedef {"string" | "bool" | "number" | ""} ParamType
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
 * - prefix:               Form input prefix which will be prepended to name.
 * 
 * - clearBtn:             Button element for clearing the form and
 *                         queries/fragments in the URL.
 * 
 * - shareURL:             Element ID of <a> for share link.
 * 
 * - shareURLBtn:          Button element triggers generating share link.
 * 
 * - shareURLArea:         Element ID of text area for share link.
 * 
 * - defaultQueryLocation: Link sets parameter in query or fragment query.
 *                         Defaults to fragment query (recommended).
 * 
 * - callback:             Function that's executed each time the form is
 *                         processed.
 * 
 * - cleanURL:             If set to `true`, does not preserve any extra
 *                         information from the URL that is not in the
 *                         initialized form. Defaults to false.
 * 
 * Read only:
 * - FormParameters           Set by Init(). (Allows FormOptions to encapsulate
 *                            FormParameters.)
 * - Sanitized:               Whether 'FormOptions' has been sanitized.
 * - Inited:                  Whether URLFormJS module was initialized.
 * - ShareURLBtnElement:      Share URL button element in GUI.
 * - ClearBtnElement:         Clear the `shareURL` and form in GUI.
 * 
 * "Form mode" parameters:
 * - formID:               HTMLFormElement ID of <form>. Sets `formMode` to true
 *                         if populated. 
 * 
 * Form Mode read only
 * - FormMode:          Use `<form>` mode.  FormOptions must include a form
 *                      'id' found in the GUI.
 * - FormElement:       Form element in GUI, specified by 'id' in 'FormOptions'.
 * @typedef  {Object}               FormOptions
 * @property {FormParameters}       FormParameters
 * @property {String}               [prefix]
 * @property {String}               [clearBtn]
 * @property {String}               [shareURLBtn] 
 * @property {String}               [shareURL]
 * @property {String}               [shareURLArea]
 * @property {QueryLocation}        [defaultQueryLocation="fragment"]
 * @property {Function}             [callback]
 * @property {Boolean}              [cleanURL=false]
 * 
 * // Read only Values (Set internally by library)
 * @property {Boolean}              Sanitized=false
 * @property {Boolean}              Inited=false
 * @property {HTMLButtonElement}    ShareURLBtnElement
 * @property {HTMLButtonElement}    ClearBtnElement
 * 
 * // Form Mode
 * @property {String}               [formID]
 * // Form Mode Read Only
 * @property {Boolean}              FormMode=false
 * @property {HTMLFormElement}      FormElement
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
 * object. See:
 * https://github.com/microsoft/TypeScript/issues/50321#issuecomment-1217224937
 * @typedef {{}}   QuagPairs
 */

/**
 * Fragment holds the fragment parts from the URL. All parts may be nil.
 * Includes extras.
 * 
 * TODO future: support other scheme starting delimiters and perhaps `?` for
 * fragment queries.
 * 
 * - fragment:   The whole fragment string (everything included).
 * - pairs:      key:value object containing the fragment queries. Does not
 *               include extras.
 * - extras:     key:value that appear in fragment query but not in form.
 * - before:     Everything after '#' and if exists everything before the first
 *               '?'.
 * - query:      Everything after `before` and before the next fragment scheme
 *               delimiter, i.e. ':~:'. This is the "middle part".  This is the
 *               fragment query.
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
 * Query holds the fragment parts from the URL. All parts may be nil.
 * Includes extras.
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
 * QuagParts holds the query and fragment from the existing URL.  See README on
 * `quag`.
 *
 * - pairs:      All pairs.  key:value object containing `query.pairs` and
 *               `fragment.pairs`.
 * - fragment:   Fragment object.
 * - query:      Query Object.
 * @typedef  {Object}    QuagParts
 * @property {QuagPairs} pairs
 * @property {Query}     query
 * @property {Fragment}  fragment
 */

/** @type {QueryLocation} */
const QueryLocationQuery = "query"

/** @type {QueryLocation} */
const QueryLocationFragment = "fragment"

/**
 * DefaultFormOptions where all options are set to their default case.
 * @type {FormOptions} 
 */
const DefaultFormOptions = {
	FormParameters: [],
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
	ShareURLBtnElement: HTMLButtonElement,
	ClearBtnElement: HTMLButtonElement,

	// Form Mode
	formID: "",
	FormMode: false,
	FormElement: HTMLFormElement,
}


/**
 * Initializes the globals and event listeners for the URLFormJS module.
 * If 'formOptions' is empty, defaults are used.
 * 
 * @param   {FormOptions}    formOptions
 * @returns {FormOptions} 
 */
function Init(formOptions) {
	// console.log(formOptions)
	let formOpt = {}
	formOpt = sanitizeFormOptions(formOptions)

	formOpt.ShareURLBtnElement = document.querySelector(formOpt.shareURLBtn)
	if (formOpt.ShareURLBtnElement != null) {
		formOpt.ShareURLBtnElement.addEventListener('click', () => ShareURI(formOpt)) // Must be anonymous, otherwise passes pointer event object.
	}
	formOpt.ClearBtnElement = document.querySelector(formOpt.clearBtn)
	if (formOpt.ClearBtnElement != null) {
		formOpt.ClearBtnElement.addEventListener('click', () => {
			Clear(formOpt)
		})
	}
	// Form Mode
	if (!isEmpty(formOpt.formID)) {
		formOpt.FormElement = document.getElementById(formOpt.formID)
		if (formOpt.FormElement !== null) {
			formOpt.FormMode = true
		}
	}

	// Force page reload when fragment changes. Chrome as of 03/01/2023 does not
	// refresh page on first enter, but the second enter and the following
	// corrects this errant behavior.
	// Related events: [locationchange, hashchange]
	window.addEventListener('hashchange', function () {
		window.location.reload()
	})

	formOpt.Inited = true
	return formOpt
}


/**
 * SetURLNoReload sets the full URL, without reloading. Helper function for both
 * explicitly setting a URL without reloading, and syntax. This function also
 * serves as code as documentation.
 * @param   {String}    url   Full URL
 * @returns {void}
 */
function SetURLNoReload(url) {
	window.history.pushState({}, '', url)
}

/**
 * Populate populates the GUI from the URI and saved setting.
 * @param   {FormOptions}    formOptions
 * @returns {void}
 * @throws  {Error}           If Init() has not been called.
 */
function Populate(formOptions) {
	// Get local storage settings.  If set, URI should overwrite.  
	let savedPairs = {}
	for (let fp of formOptions.FormParameters) {
		if (fp.saveSetting) {
			savedPairs[fp.name] = getSavedSetting(fp.name, formOptions)
		}
	}

	let uriPairs = GetQuagParts(formOptions).pairs
	let pairs = {
		...savedPairs,
		...uriPairs,
	}
	PopulateFromValues(pairs, formOptions)
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
		throw new Error("URLFormJS: Init() must be called first to initialize the URLFormJS module.")
	}
	SetForm(quagPairs, formOptions)
	ShareURI(formOptions)
}

/**
 * getFragmentString returns URL fragment as a string, not including '#'.
 * See notes in function.
 *
 * @returns {Fragment.string}
 */
function getFragmentString() {
	let fParts = window.location.hash.split("#") // May not work in chrome, see note below.

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
		fParts = performance.getEntriesByType('navigation')[0].name.split("#")
	}

	if (fParts.length == 1) { // only "#"
		return ""
	}
	// Always decode URL, even if not URL encoded.
	return decodeURIComponent(fParts[1])
}


/**
 * SetForm sets GUI for each parameter, and executes funcTrue() per parameter,
 * if applicable. See docs in 'FormOptions'. Form wide options are also executed
 * (e.g. 'callback' in 'FormOptions').
 *
 * @param   {QuagPairs}    kv
 * @param   {FormOptions}  formOptions
 * @returns {void}
 */
function SetForm(kv, formOptions) {
	try {
		for (let fp of formOptions.FormParameters) {
			// Set as vars to avoid mutability.
			let id = fp.id
			let name = fp.name

			let value = fp.defaultValue
			let hasNegative = (kv["-" + name] !== undefined) // Don't use `isEmpty`.
			if (hasNegative && fp.type == "bool") {
				value = false
			} else if (!isEmpty(kv[name])) {
				value = kv[name]
			}

			// Run func if set
			if (!isEmpty(fp.func)) {
				fp.func()
			}

			// If id is empty, assume name is the id on the page.
			if (isEmpty(id)) {
				id = formOptions.prefix + name
			}

			// Sanitize bool `true` to string true and sanitize flags. Flag values for
			// bool may be `true` or empty. Empty as a flag is interpreted as true.
			if (value === true || (fp.type === "bool" && value === "")) {
				value = "true"
			}

			// Run `funcTrue`. Value may be "true", or empty "" (flag).
			if (fp.type == "bool" && value === "true") {
				if (!isEmpty(fp.funcTrue)) {
					fp.funcTrue()
				}
			}

			// Finally Set Gui
			let e = document.getElementById(id)
			if (e == null) {
				continue
			}
			if (fp.type == "bool" && value == "true") {
				e.checked = true
			}

			// Set GUI Non-bool inputs.
			if (!isEmpty(value) && fp.type !== "bool") {
				e.value = value
			}

			if (fp.saveSetting) { // Set Action listener for savables.
				e.addEventListener("input", (e) => {
					if (fp.type == "bool") {
						setSavedSetting(name, e.target.checked, formOptions)
					} else {
						setSavedSetting(name, e.target.value, formOptions)
					}
				})
			}

		}
	} finally {
		//// Form wide options

		// Callback if any.
		if (!isEmpty(formOptions.callback)) {
			formOptions.callback()
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
	return localStorage.getItem(formOptions.localStorageNamespace + formOptions.prefix + name)
}

/**
 * Sets the setting. 
 * @param   {string}       name
 * @param   {string}       value
 * @param   {FormOptions}  formOptions
 * @returns {void}
 */
function setSavedSetting(name, value, formOptions) {
	console.log("URLFormJS - Saving setting:", name, value)
	return localStorage.setItem(formOptions.localStorageNamespace + formOptions.prefix + name, value)
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
	}
	// If no options given, use default.
	if (isEmpty(formOptions)) {
		return foc
	}
	// If FormOptions has already been sanitized, do nothing.
	if (!isEmpty(formOptions.Sanitized) && formOptions.Sanitized === true) {
		return
	}

	//// Sanitize
	if (!isEmpty(formOptions.formID)) {
		foc.formID = formOptions.formID
	}
	if (!isEmpty(formOptions.prefix)) {
		foc.prefix = formOptions.prefix
	}
	if (!isEmpty(formOptions.clearBtn)) {
		foc.clearBtn = formOptions.clearBtn
	}
	if (!isEmpty(formOptions.shareURLArea)) {
		foc.shareURLArea = formOptions.shareURLArea
	}
	if (!isEmpty(formOptions.shareURL)) {
		foc.shareURL = formOptions.shareURL
	}
	if (!isEmpty(formOptions.shareURLBtn)) {
		foc.shareURLBtn = formOptions.shareURLBtn
	}
	if (!isEmpty(formOptions.defaultQueryLocation)) {
		foc.defaultQueryLocation = formOptions.defaultQueryLocation
	}
	if (!isEmpty(formOptions.callback)) {
		foc.callback = formOptions.callback
	}
	if (!isEmpty(formOptions.cleanURL)) {
		foc.cleanURL = formOptions.cleanURL
	}
	if (!isEmpty(formOptions.localStorageNamespace)) {
		foc.localStorageNamespace = formOptions.localStorageNamespace
	}

	// Options with limited valid values.  
	if (formOptions.defaultQueryLocation !== QueryLocationQuery) {
		foc.defaultQueryLocation = QueryLocationFragment
	}

	// Sanitize form parameters. (The `for` is pass by reference, not pass by copy.)
	for (let fp of formOptions.FormParameters) {
		// If query location is not a recognized 'QueryLocation', use default.
		if (fp.queryLocation !== QueryLocationFragment && fp.queryLocation !== QueryLocationQuery) {
			fp.queryLocation = foc.defaultQueryLocation
		}
		foc.FormParameters.push(fp)
	}

	foc.Sanitized = true
	return foc
}

/**
 * Generates a share URL from the current URL and form, populates the GUI with
 * share links, and returns the URL encoded URL.
 *
 * Fragment query parameters take precedence over query parameters.
 *
 * @param   {FormOptions}   formOptions
 * @returns {URL}           Javascript URL object.
 */
function ShareURI(formOptions) {
	let q = GetQuagParts(formOptions) // Current URL values.
	let formPairs = GetForm(formOptions) // Current form values.
	var u = new URL(window.location.origin + window.location.pathname)

	// label for outer for loop.  
	loop1: for (let fp of formOptions.FormParameters) {
		let value = encodeURIComponent(formPairs[fp.name])
		// console.log(fp, fp.name, value, q.pairs.hasOwnProperty(fp.name))
		// console.log(fp.name + ": " + value)

		// Sets value if populated.  Otherwise removes from the query/fragment. (A
		// query parameter set in fragment, or a fragment parameter set in Query.
		// Note: bools on false will not have been cleared yet.)
		while (true) {
			if (!isEmpty(value)) {
				break
			}

			// console.log(isEmpty(fp.funcTrue))
			if (q.pairs.hasOwnProperty(fp.name) && fp.nonFormValue) {
				break
			}
			// console.log("Deleting: " + fp.name)

			u.searchParams.delete(fp.name)
			delete q.fragment.pairs[fp.name]
			// console.log("Deleting and continuing", fp.name)
			continue loop1 // Continue "breaks"
		}

		if (fp.type == "bool") { // Always use flag form for bools.  
			value = ""
		}

		// Set to Fragment
		if (fp.queryLocation === QueryLocationFragment) {
			u.searchParams.delete(fp.name)
			q.fragment.pairs[fp.name] = value
			continue
		}

		// Set to Query
		u.searchParams.set(fp.name, value)
		delete q.fragment.pairs[fp.name]
	}

	// Query extras
	if (!isEmpty(q.query.extras) && !formOptions.cleanURL) {
		for (let e in q.query.extras) {
			u.searchParams.set(e, q.query.extras[e])
		}
	}

	// Rebuild fragment query in case new form fields were set.
	u.hash = quagPartsToURLHash(q.fragment, formOptions)
	setShareURL(u.href, formOptions)

	return u
}


/**
 * Sets the URL on share link and share area.  
 * @param   {String}       href
 * @returns voice
 */
function setShareURL(href, formOptions) {
	// URI Link
	let shareUrl = document.querySelector(formOptions.shareURL)
	if (shareUrl !== null) {
		shareUrl.innerHTML = href.link(href)
	}

	// Text Area 
	let shareArea = document.querySelector(formOptions.shareURLArea)
	if (shareArea !== null) {
		shareArea.innerHTML = href
	}
}


/**
 * Generates a URL encoded fragment string from Fragment.
 * 
 * Returns empty string when fragment is empty.
 * 
 * @param   {Fragment}      fragment
 * @param   {FormOptions}   formOptions
 * @returns {String}        Fragment string (#<before>?<middle(fromForm?extras)>[delimiter]<after>).
 */
function quagPartsToURLHash(fragment, formOptions) {
	// URL Fragment has three parts: 1. before fragment query, 2. fragment query, 3.
	// after fragment query.  

	// Concatenate fragment ("#") and before.
	let fqs = "#" + fragment.before

	// Middle.  Build the fragment query.  (Query is the middle).
	var i = Object.keys(fragment.pairs).length
	if (i != 0) {
		fqs += "?" //start fragment query delimiter ("?")
		for (let key in fragment.pairs) {
			i--
			let eq = "="
			let fp = formOptions.FormParameters.find(a => a.name == key)
			if (fragment.pairs[key] == "" && fp.type == "bool") {
				eq = "" // flag style.  No "=" in string if parameter is flag. 
			}
			fqs += key + eq + encodeURIComponent(fragment.pairs[key])
			if (i > 0) {
				fqs += "&" // Add separator on everything except the last.  
			}
		}
	}

	// Extras (still in middle)
	let j = Object.keys(fragment.extras).length
	if (Object.keys(fragment.pairs).length && j > 0) {
		fqs += "&" // Prepend extras with ampersand if fragment is populated. 
	}
	// Append extras back in query params
	if (j > 0 && !formOptions.cleanURL) {
		for (let e in fragment.extras) {
			j--
			fqs += e + "=" + encodeURIComponent(fragment.extras[e])
			if (j > 0) {
				fqs += "&"
			}
		}
	}

	// After.
	fqs += fragment.after
	if (fqs == "#") { // Return empty string if fragment is empty.  
		return ""
	}
	return fqs
}


/**
 * Helper that returns a `k:v,k:v` object from a `k=v&k=v` string.
 * 
 * @param   {String}      s   e.g. `key=value&key=value`.
 * @returns {QuagPairs}       {key:value}
 */
function getPairs(s) {
	if (isEmpty(s)) {
		return {}
	}

	let pairs = {}
	let parts = s.split('&')
	for (const i in parts) {
		let kv = parts[i].split('=')
		let key = kv[0]
		let value = kv[1]
		// If the string begins/ends with "&", there will be an empty element. 
		if (isEmpty(key)) {
			continue
		}
		// Sanitize to string. (Don't use isEmpty as string "true"/"false" are valid.)
		if (value === undefined || value === null) {
			value = ""
		}
		// Browsers automatically escape values. Javascript 'unescape()' is deprecated.
		// 'decodeURI' expects the full URI.
		pairs[key] = decodeURIComponent(value)
	}

	return pairs
}


/**
 * GetQuagParts returns QuagParts generated from the current URL, not the
 * form, and puts values into the correct object based on formOptions.
 * Includes extras.  See docs on `QuagParts`.
 * 
 *  On duplicate the default behavior overwrites query pairs with fragment pairs.
 * 
 * @param   {FormOptions}   formOptions
 * @returns {QuagParts}
 */
function GetQuagParts(formOptions) {
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
		}

		// Check if fragment query has 'before'.
		let ss = frag.string.split('?')
		if (ss.length == 0) {
			frag.query = ss[0]
		} else {
			frag.before = ss[0]
			frag.query = ss[1]
		}

		// Check for after. Fragment queries supports beginning delimiters for other
		// fragment schemes, like fragment directive `:~:`.
		if (!isEmpty(frag.query)) {
			let s = frag.query.split(':~:')
			if (s.length > 1) {
				frag.query = s[0]
				frag.after = ':~:' + s[1]
			}
		}
		frag.pairs = getPairs(frag.query)

		// Javascript deep copy
		return JSON.parse(JSON.stringify(frag))
	}

	let qp = {
		query: {
			string: decodeURIComponent(window.location.search.substring(1)), // substring removes "?"
			pairs: getPairs(window.location.search.substring(1)), // getPairs decodes pair values.
			extras: {},
		},
		fragment: getFragment(),
	}

	qp.pairs = {
		...qp.query.pairs,
		...qp.fragment.pairs,
	}

	// Generate extras and remove any extras from Query and Fragment.  
	let formParams = []
	for (let p of formOptions.FormParameters) {
		formParams.push(p.name)
	}

	// Extra query pairs.
	for (let key of Object.keys(qp.query.pairs)) {
		if (!formParams.includes(key)) {
			qp.query.extras[key] = qp.query.pairs[key]
			delete qp.query.pairs[key]
		}
	}
	// Extra frag pairs.
	for (let key of Object.keys(qp.fragment.pairs)) {
		if (!formParams.includes(key)) {
			qp.fragment.extras[key] = qp.fragment.pairs[key]
			delete qp.fragment.pairs[key]
		}
	}

	return qp
}

/**
 * GetURLKeyValue is a helper that returns k:v from the current URL. 
 *
 * On duplicate the default behavior overwrites query pairs with fragment pairs.
 *
 * @param   {FormOptions}     [formOptions]
 * @returns {QuagParts.pairs}
 */
function GetURLKeyValue(formOptions) {
	if (isEmpty(formOptions)) {
		formOptions = GetDefaultFormOptions()
	}
	let qp = GetQuagParts(formOptions)
	return qp.pairs
}


/**
 * Serialize serializes the initialized FormParameters that are populated in the
 * GUI into a JSON string.
 * 
 * @param   {FormOptions}   formOptions
 * @returns {String}
 */
function Serialize(formOptions) {
	return JSON.stringify(GetForm(formOptions))
}


/**
 * GetForm gets current form values from the GUI into {key:value,key:value}.
 *
 * ReturnPairOnZero: Whether all pairs from 'GetForm' will always be returned.
 * Otherwise, on zero value, the pair will not be returned in the pairs object.
 * 
 * @param   {FormOptions}   formOptions
 * @param   {Boolean}       [ReturnPairOnZero]
 * @returns {QuagPairs}     key/value
 */
function GetForm(formOptions, ReturnPairOnZero) {
	if (!formOptions.Inited) {
		throw new Error("URLFormJS: Init() must be called first to initialize the URLFormJS module.")
	}

	let pairs = {}
	// Normal usage, not FormMode (not in a <form>), select individual ID's.
	if (!formOptions.FormMode) {
		for (let fp of formOptions.FormParameters) {
			let value

			let htmlID = fp.name
			if (!isEmpty(fp.id)) {
				htmlID = fp.id
			}
			let elem = document.getElementById(formOptions.prefix + htmlID)
			if (elem !== null) {
				switch (fp.type) {
					default: // String
						value = elem.value
						// Sanitize undefined
						if (isEmpty(value)) {
							value = ""
						}
						break
					case "bool":
						value = elem.checked
						break
					case "number":
						value = Number(elem.value)
						// Sanitize NaN
						if (isEmpty(value)) {
							value = 0
						}
						break
				}
			}

			if (!isEmpty(value)) {
				pairs[fp.name] = value
			} else if (ReturnPairOnZero) {
				pairs[fp.name] = value
			}
		}
		return pairs
	}

	// FormMode=true.  In a <form>.
	let formData = new FormData(formOptions.FormElement) // throws
	for (let [name, value] of formData) {
		if (value == "true" || value == "on") {
			value = true
		}
		if (value == "false" || value == "unchecked") {
			value = false
		}

		// Remove prefix, if set.
		if (!isEmpty(formOptions.prefix)) {
			name = name.substring(formOptions.prefix.length)
		}

		if (!isEmpty(value)) {
			pairs[name] = value
		} else if (ReturnPairOnZero) {
			pairs[name] = value
		}
	}
	return pairs
}

/**
 * GetFormElements will return a key:value object from teh GUI form using form
 * parameters, and the values are the elements that hold the form parameters'
 * values.
 * 
 * @param   {FormOptions}   formOptions
 * @returns {QuagPairs}     key/value (where value is an HTML Element)
 */
function GetFormElements(formOptions) {
	let kv = {}
	for (let param of formOptions.FormParameters) {
		kv[param.name] = document.getElementById(formOptions.prefix + param.name)
	}
	return kv
}


/**
 * Clear clears out a form.
 *
 * @param   {FormOptions}   formOptions
 * @returns {void}
 */
function Clear(formOptions) {
	if (!formOptions.Inited) {
		throw new Error("URLFormJS: Init() must be called first to initialize the URLFormJS module.")
	}

	// FormMode clear
	if (formOptions.FormMode) {
		//https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements
		for (let e of FormOptions.FormElement.elements) {
			if (e.type === "checkbox") {
				e.checked = false
			} else {
				e.value = ""
			}
		}
		return
	}

	// Normal Mode clear (clear each element individually)
	for (let fp of formOptions.FormParameters) {
		let name = formOptions.prefix + fp.name
		let id = fp.id
		// If id is empty, assume name is the id on the page.
		if (isEmpty(id)) {
			id = name
		}

		// Unchecks if type=bool. Otherwise sets value of the element to ""
		if (fp.type == "bool") {
			let e = document.getElementById(id)
			if (e != null) {
				e.checked = false
			}
			continue
		}

		let e = document.getElementById(id)
		if (e != null) {
			e.value = ""
		}
	}
	// Clear the share URL.  
	var u = new URL(window.location.origin + window.location.pathname)
	setShareURL(u.href, formOptions)
}

/**
 * IsEmpty returns whether or not the initialized form is empty.
 * 
 * @param   {FormOptions}   formOptions
 * @returns {Boolean}  Whether or not the form is empty.
 * @throws  {Error}    Fails if form is not of type HTMLFormElement.
 */
function IsEmpty(formOptions) {
	return isEmpty(GetForm(formOptions))
}

/**
 * GetDefaultFormOptions returns the Initialized default form options.
 * NOTE: Exporting DefaultFormOptions directly will make it to where the
 * UMD format block needs to be at the bottom of the file, after initialization.
 * 
 * @returns {FormOptions}
 */
function GetDefaultFormOptions() {
	return DefaultFormOptions
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
		return false
	}

	if (Array.isArray(thing)) {
		return isEmpty(thing[0])
	}

	if (thing === Object(thing)) {
		if (Object.keys(thing).length === 0) {
			return true
		}
		return false
	}

	if (!isBool(thing)) {
		return true
	}
	return false
}

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
		return false
	}
	return true
}



//////////////////////////////Regex_match_for_truncation_for_umd
// UMD export see https://github.com/Cyphrme/UMD_tutorial
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
		typeof define === 'function' && define.amd ? define(['exports'], factory) :
		(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.URLForm = {}))
})(this, (function (exports) {
	exports.Init = Init
	exports.SetURLNoReload = SetURLNoReload
	exports.PopulateFromValues = PopulateFromValues
	exports.Populate = Populate
	exports.Serialize = Serialize
	exports.GetForm = GetForm
	exports.GetFormElements = GetFormElements
	exports.GetURLKeyValue = GetURLKeyValue
	exports.GetQuagParts = GetQuagParts
	exports.SetForm = SetForm
	exports.Clear = Clear
	exports.IsEmpty = IsEmpty
	exports.GetDefaultFormOptions = GetDefaultFormOptions
	exports.ShareURI = ShareURI
	Object.defineProperty(exports, '__esModule', {
		value: true
	})
}))