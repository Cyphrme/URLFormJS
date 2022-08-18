# UrlFormJS 

![URLFormJS](./urlformjs.png)

Sitcky URL Forms forms with sharable links.  Supports **query** parameters and
**fragment query** parameters.

## [Demo](https://cyphrme.github.io/URLFormJS/#?first_name=Bob&last_name=Smith&email_address=bob@something.com&phone_number=1234567890&subscribe_latest_news=true:~:text=Bob)


# Query Parameters, Fragment Anchors, and Fragment Query Parameters
UrlFormJS supports normal URL **query** parameters for stickiness.  

It also supports **fragment query** parameters.  Unlike query parameters,
fragments are not sent to the server from the browser, which makes fragments
**ideal for sensitive information**.  We recommend applications use fragment
query parameters over query parameters when possible.   

If query parameter and fragment query parameter are set to the same key name,
the fragment query parameter takes precedence.  

Fragment query parameters are located after the first `#`, then after the next
`?` and before any additional `:~:` (text fragments should have the '?'
character URL escaped).

In the URL:

    foo://example.com:8042/over/there?name=ferret#nose?name=bob
    \_/   \______________/\_________/ \_________/ \___________/
     |           |            |            |            |
    scheme    authority      path         query      fragment


Where `nose?name=bob` is the fragment, `nose` is the fragment anchor, and
`?name=bob` is the fragment query.  In this example, since the query parameter
and the fragment query parameter have the same key name of "name", the value of
"bob" will take precedence over "ferret".  

See [RFC 3986 for query
parameters](https://www.rfc-editor.org/rfc/rfc3986#section-3.5) and [Wikipedia](https://en.wikipedia.org/wiki/URI_fragment).

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
Issue submissions and pull requests are welcome.  Before submitting pull
request, please ensure tests are passing and that the test form behavior is
correct.

We have a single page test that's useful.  Since it uses js modules it needs an
http server.  Use server.go for this.

```
go run server.go
```

To generate the minified file, use `esbuild` to run the following:

```sh
esbuild urlform.js --bundle --format=esm --minify --outfile=urlform.min.js
```

## Tests
Testing uses [BrowserTestJS](https://github.com/Cyphrme/BrowserTestJS]):

```
cd /urlformjs/browsertestjs/
go run server.go
```

Then go to `localhost:8082` for the results.

# Fragment Directive/Text Fragment Chrome bugs
Chrome and potentially other browsers are removing anything after fragment
directives from the URL when using 'window.location'.  This library gracefully
handles this bug.  See notes on getFragment and [stack
overflow](https://stackoverflow.com/a/73366996/1923095).

[Demonstrates of Firefox working and Chrome
breaking](https://cyphrme.github.io/URLFormJS/fragment_text_demonstration.html)


# Quag

We found it useful to name a super set of query and fragment, dubbed `quag`.
The quag includes `?` and `#`.

    foo://example.com:8042/over/there?name=ferret#nose?name=bob
    \_/   \______________/\_________/ \_________/ \___________/
     |           |            |            |            |
    scheme    authority      path         query       fragment
                                     \_________________________/
                                                  | 
                                                 quag

# Probably out of scope for this library:
- JSON Schema validation. 
- Form validation.  
- Field requirements/limitations. 

### Logo license
["you are free to use your logo for promotional purposes"](https://support.freelogodesign.org/hc/en-us/categories/360003253451-Copyrights)

----------------------------------------------------------------------
# Attribution, Trademark notice, and License
URLFormJS is released under The 3-Clause BSD License. 

"Cyphr.me" is a trademark of Cypherpunk, LLC. The Cyphr.me logo is all rights
reserved Cypherpunk, LLC and may not be used without permission.
