# UrlFormJS 

![URLFormJS](./urlformjs.png)

Sitcky URL Forms forms with sharable links.

URLFormJS can be added directly into a project as a submodule with the following
command:

``` sh
git submodule add git@github.com:Cyphrme/URLFormJS.git
```

To update the submodule

When changes are made to URLFormJS, a project can update the changes by running
the following command from the directory where the project's .gitmodules lives:

```sh
git submodule update --remote
```


Alternatively, download `urlform.min.js` or clone the repo into the desired
project.

`urlform.js` is the human readable code, and can be used/called directly, but it
is recommended to use `urlform.min.js` (minified) when running production/live
code.


## Example simple user form
The following example is a simple user form using FormJS that includes:

- First name
- Middle name
- Last name
- Email address
- Phone number
- Subscribe to latest news 

## HTML

``` HTML
	<div>
	<form id="ExampleUserForm">
		<div>
			<input type="text" id="input_first_name" name="first_name" placeholder="First Name">
		</div>
		<div>
			<input type="text" id="input_middle_name" name="middle_name" placeholder="Middle Name">
		</div>
		<div>
			<input type="text" id="input_last_name" name="last_name" placeholder="Last Name">
		</div>
		<div>
			<input type="text" id="input_email_address" name="email_address" placeholder="Email Address">
		</div>
		<div>
			<input type="text" id="input_phone_number" name="phone_number" placeholder="Phone Number">
		</div>
		<div>
			<label for="input_subscribe_latest_news">Subscribe to the latest news</label>
			<input type="checkbox" id="input_subscribe_latest_news" name="subscribe_latest_news">
		</div>
	</form>

	<button id="ShareURLBtn" class="btn mt-3 btn-primary">Share URL</button>
	<div>
		<p><span id="ShareURL"></span></p>
	</div>

</div>
```

## Javascript

``` Javascript 
const FormOptions = {
	"prefix": 'input_',
	"shareURLBtn": "#ShareURLBtn",
	"shareURL": "#ShareURL",
	}

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
		"type":"bool",
	},
];

```

It's as simple as that!  Now your project is setup to use FormJS.

# FormJS API

The following functions are exposed from FormJS:
- InitForm
- PopulateFromValues
- PopulateFromURI
-	Serialize
-	Parse
- ClearForm
- IsFormEmpty

`values` in the following context of the functions refers to a Javascript
key:value object.

FormJS may also refer to this object as `pairs`.

InitForm is used to initialize the FormOptions you want to use for the form,
and should be called when the page/DOM is loaded, if the form requires FormOptions
other than the Defaults.
InitForm will also set the event listener on the ShareURL button, if it exists
on the page.

PopulateFromValues will populate the form values on the page, from the given
FormParameters, Values, and FormOptions.

PopulateFromURI will do the same thing as PopulateFromValues, but use uri query
parameters as the values.

Serialize will return a serialized JSON string from the form.

Parse will return a parsed JSON object from the form.

ClearForm will clear the form's values, and set the checkboxes to unchecked.

IsFormEmpty will return true if the form is empty, and false otherwise.

# Example
## [See live example](https://cyphrme.github.io/URLFormJS/)


# Development, Bug Reporting, and Feature Requests
Issue submissions and pull requests are welcome.  


## Testing
To run the example/testing server, you must first have Go installed on your local
machine and run the following two commands:

```
cd /urlformjs/browsertestjs/
go run server.go
```


Then go to `localhost:8082` and check the results.

Before submitting pull request, please run the tests to make sure that they are
all passing, and will not break current implementations.


## Probably out of scope for this library:
- Look into JSON Schema validation. 
- Form validation.  
- Field requirements/limitations. 