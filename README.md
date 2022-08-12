# UrlFormJS 

![URLFormJS](./urlformjs.png)

Sitcky URL Forms forms with sharable links.  Supports query parameters and
fragment query parameters

## [Demo](https://cyphrme.github.io/URLFormJS/?first_name=Bob&last_name=Smith&email_address=bob%40something.com&phone_number=1234567890&subscribe_latest_news=true)


# Query Parameters, Fragment Anchors, and Fragment Query Parameters
UrlFormJS supports normal URL query parameters for stickiness.  It also supports
fragment query parameters.  

Unlike query parameters, fragments are not sent to the server from the browser,
which makes fragments ideal for sensitive information.  We recommend
applications use fragment query parameters over query parameters when
possible.   

If query parameter and fragment query parameter are set to the same value, the
fragment query parameter takes precedence.  

Fragment query parameters are located after the first `#`, then after the next
`?` and before any additional `:~:`

In the URL:

		foo://example.com:8042/over/there?name=ferret#nose?name=bob
		\_/   \______________/\_________/ \_________/ \___________/
		|           |            |            |            |
	scheme     authority       path        query       fragment

Where `nose?name=bob` is the fragment, `nose` is the fragment anchor, and
`?name=bob` is the fragment query.  In this example, since the query parameter
and the fragment query parameter have the same key name of "name", the URL form
value of "bob" will take precedence over "ferret".  

See [RFC 3986 for query
parameters](https://www.rfc-editor.org/rfc/rfc3986#section-3.5)
https://en.wikipedia.org/wiki/URI_fragment

Fragment query parameters are "non-standard", but we hope if enough people find
it useful to standardize them through an RFC or other means.  


# Install
URLFormJS can be added into a project as a submodule with the following command:

``` sh
git submodule add git@github.com:Cyphrme/URLFormJS.git urlformjs
```

To update the submodule:

```sh
git submodule update --remote
```

Alternatively, download `urlform.min.js` or `urlform.js`.

# Development
Issue submissions and pull requests are welcome.

To generate the minified file, use `esbuild` to run the following:

```sh
esbuild urlform.js --bundle --format=esm --minify --outfile=urlform.min.js
```

Before submitting pull request, please ensure tests are passing and the form
behavior is correct.

## Testing
Testing uses (BrowserTestJS)[https://github.com/Cyphrme/BrowserTestJS]:

```
cd /URLFormJS/BrowserTestJS/
go run server.go
```

Then go to `localhost:8082` and check the results.


## Probably out of scope for this library:
- JSON Schema validation. 
- Form validation.  
- Field requirements/limitations. 

### Logo license
"you are free to use your logo for promotional purposes"
https://support.freelogodesign.org/hc/en-us/categories/360003253451-Copyrights

----------------------------------------------------------------------
# Attribution, Trademark notice, and License
URLFormJS is released under The 3-Clause BSD License. 

"Cyphr.me" is a trademark of Cypherpunk, LLC. The Cyphr.me logo is all rights
reserved Cypherpunk, LLC and may not be used without permission.