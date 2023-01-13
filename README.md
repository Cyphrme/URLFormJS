# UrlFormJS 

![URLFormJS](./urlformjs.png)

URLFormJS creates sticky forms, stateful applications, and
shareable link using **query** parameters and **fragment query**
parameters.

## [Demo](https://cyphrme.github.io/URLFormJS/#?first_name=Bob&last_name=Smith&email_address=bob@something.com&phone_number=1234567890&subscribe_latest_news=true&country_select=1&uri_settable=true:~:text=Bob)


# Query Parameters, Fragment Anchors, and Fragment Query Parameters
UrlFormJS supports normal URL **query** parameters for stickiness.  

It also supports **fragment query** parameters.  Unlike query parameters,
fragments are not sent to the server from the browser, which makes fragments
**ideal for sensitive information**.  We recommend applications use fragment
query parameters over query parameters when possible.   

    https://example.com:8042/over/there?name=ferret#nose?name=bob
    \_____________________________________________/\____________/
               |                                          |
       Sent to the server                            Kept local

For example, the browser requests only `https://example.com` when supplied the
URL `https://example.com#test` and does not include `#test` in the request.
Example.com is unaware of `#test`.

Fragment query parameters are located after the first `#`, then after the next
`?`.  It is ended by the end of the URL, by the next `?`, or other fragment
scheme like the delimiter `:~:`.  

If query parameter and fragment query parameter are set to the same key name,
the fragment query parameter takes precedence.  

Parts of the URL:

    foo://example.com:8042/over/there?name=ferret#nose?name=bob
    \_/   \______________/\_________/ \_________/ \___________/
     |           |            |            |            |
    scheme    authority      path         query      fragment


Where `nose?name=bob` is the **fragment**, `nose` is the **fragment anchor**,
and `?name=bob` is the **fragment query**.  

In this example, since the query parameter and the fragment query parameter have
the same key name of "name", the value of "bob" will take precedence over
the value "ferret".  


See [RFC 3986 for query
parameters](https://www.rfc-editor.org/rfc/rfc3986#section-3.5) and [Wikipedia](https://en.wikipedia.org/wiki/URI_fragment).

Fragment queries also have the advantage of not having size limits like normal
queries, although this is browser dependent.  

Fragment query parameters are "non-standard", but we hope it is useful enough to
eventually standardize through an RFC or other means.  


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


# `FormOptions` and `FormParameters`
URLFormJS is configured by two configuration objects.  

See `index.js` for an example of `FormParameters`.  The docs are in `urlform.js`.


# Install
URLFormJS can be added into a project as a submodule with the following command:

``` sh
git submodule add git@github.com:Cyphrme/URLFormJS.git urlformjs
```
Or
```
git clone git@github.com:Cyphrme/URLFormJS.git urlformjs
cd urlformjs && git clone git@github.com:Cyphrme/BrowserTestJS.git browsertestjs
```

To update the submodule (or alternatively download just the file `urlform.js`):

```sh
git submodule update --remote
```

If not importing `urlform.js` as a module, the file can be loaded in HTML using:

``` HTML
<script defer src="./urlformjs/urlform.js"></script>
```

`urlform.js` is in ['UMD' format](https://github.com/umdjs/umd) and can be
accessed in Javascript with the following:

``` Javascript
window.urlformjs
```

See `example.js` for an example of initializing `URLFormJS` for a given form.


# Development
Issue submissions and pull requests are welcome.  Before submitting pull
request, please ensure tests are passing and that the test form behavior is
correct.

We have a single page test that's useful.  Since it uses js modules it needs an
http server.  Use server.go for this.

```
go run server.go
```

## UMD Module
See `minify.js` and for more https://github.com/Cyphrme/UMD_tutorial.  In short,
`esbuild` has a bug with UMD so modules exports have to be manually done.  



## Tests
Testing uses [BrowserTestJS](https://github.com/Cyphrme/BrowserTestJS):

```
cd browsertestjs
go run server.go
```

Then go to `localhost:8082` for the results.


#### Demonstration that fragment is not sent off.  
The test server logs requests and can be used to demonstrated that
fragment is not sent to the server by the browser by visiting
`https://localhost:8082?name=bob#test` or using curl:

```
curl -k https://localhost:8082?name=bob#test
```

Note that `?name=bob` appears in the log but `#test` does not.  

# Fragment Directive/Text Fragment Chrome bugs
Chrome and potentially other browsers are removing anything after fragment
directives from the URL when using 'window.location'.  This library gracefully
handles this bug except when the protocol is `file://`.  See notes on
getFragment and [stack overflow](https://stackoverflow.com/a/73366996/1923095).

Note that fragment directives, including text fragments, should have the '?'
character URL escaped.

[Demonstrates of Firefox working and Chrome
breaking](https://cyphrme.github.io/URLFormJS/fragment_text_demonstration.html)


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
