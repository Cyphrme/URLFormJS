// urlform.js
var DefaultFormOptions = {
  prefix: "",
  shareURLBtn: "#shareURLBtn",
  shareURL: "#shareURL",
  shareURLArea: "#shareURLArea"
};
var sanitizedFormOptions;
var shareButton;
function Init(params, formOptions) {
  sanitizedFormOptions = {};
  sanitizedFormOptions = sanitizeFormOptions(formOptions);
  shareButton = document.querySelector(sanitizedFormOptions.shareURLBtn);
  if (shareButton != null) {
    shareButton.addEventListener("click", () => shareURI(params));
  }
}
async function PopulateFromURI(params, formOptions) {
  if (isEmpty(params)) {
    return;
  }
  var url = new URL(window.location.href);
  let pairs = {};
  for (var pair of url.searchParams.entries()) {
    pairs[pair[0]] = pair[1];
  }
  var frag = window.location.hash.substring(1);
  if (!isEmpty(frag)) {
    let p = frag.split("?");
    if (!isEmpty(p[1])) {
      let fqs = p[1].split("&");
      fqs.forEach((q) => {
        let fqp = q.split("=");
        if (fqp[1] === void 0) {
          pairs[fqp[0]] = null;
          return;
        }
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
function PopulateFromValues(params, values, formOptions) {
  if (!isEmpty(params)) {
    setGUI(params, values, sanitizeFormOptions(formOptions));
  }
}
function setGUI(params, values, formOpts) {
  for (const parameter in params) {
    let name = params[parameter].name;
    let id = params[parameter].id;
    let type = params[parameter].type;
    let value = values[name];
    let funcTrue = params[parameter].funcTrue;
    name = formOpts.prefix + name;
    if (isEmpty(id)) {
      id = name;
    }
    if (func !== void 0) {
      params[parameter].func();
    }
    if (type == "bool" && funcTrue !== void 0 && value !== void 0 && (value === "" || value === "true" || value === true)) {
      params[parameter].funcTrue();
    }
    if (!isEmpty(value)) {
      if (type == "bool" && (value == "true" || value === true)) {
        let e2 = document.getElementById(id);
        if (e2 != null) {
          e2.checked = true;
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
function sanitizeFormOptions(formOptions) {
  if (formOptions.FormJs_Sanitized === true) {
    return;
  }
  let formOpts = {
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
function shareURI(params) {
  var url = new URL(window.location.href);
  for (const parameter in params) {
    var name = params[parameter].name;
    var id = params[parameter].id;
    var type = params[parameter].type;
    let htmlID = name;
    if (!isEmpty(id)) {
      htmlID = id;
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
      url.searchParams.delete(name);
    }
  }
  if (isEmpty(url.hash.substring(1))) {
    url.hash = "";
  }
  let shareUrl = document.querySelector(sanitizedFormOptions.shareURL);
  if (shareUrl != null) {
    shareUrl.innerHTML = url.href.link(url.href);
  }
  let shareArea = document.querySelector(sanitizedFormOptions.shareURLArea);
  if (shareArea != null) {
    shareArea.innerHTML = url.href;
  }
  return url;
}
function Serialize(form) {
  return JSON.stringify(Parse(form));
}
function Parse(form) {
  var formData = new FormData(form);
  var pairs = {};
  for (let [name, value] of formData) {
    if (value == "true" || value == "on") {
      value = true;
    }
    if (value == "false" || value == "unchecked") {
      value = false;
    }
    if (name.substring(0, 6) == "input_") {
      name = name.substring(6);
    }
    if (!isEmpty(value)) {
      pairs[name] = value;
    }
  }
  return pairs;
}
function Clear(params, formOpts) {
  sanitizeFormOptions(formOpts);
  for (const parameter in params) {
    let name = formOpts.prefix + params[parameter].name;
    let id = params[parameter].id;
    let type = params[parameter].type;
    if (isEmpty(id)) {
      id = name;
    }
    if (type == "bool") {
      let e2 = document.getElementById(id);
      if (e2 != null) {
        e2.checked = false;
      }
      continue;
    }
    let e = document.getElementById(id);
    if (e != null) {
      e.value = "";
    }
  }
}
function IsEmpty(form) {
  return isEmpty(Parse(form));
}
function isEmpty(thing) {
  if (typeof thing === "function") {
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
  return false;
}
function isBool(bool) {
  if (bool === false || bool === "false" || bool === void 0 || bool === "undefined" || bool === "" || bool === 0 || bool === "0" || bool === null || bool === "null" || bool === "NaN" || Number.isNaN(bool) || bool === Object(bool)) {
    return false;
  }
  return true;
}
export {
  Clear,
  DefaultFormOptions,
  Init,
  IsEmpty,
  Parse,
  PopulateFromURI,
  PopulateFromValues,
  Serialize
};
