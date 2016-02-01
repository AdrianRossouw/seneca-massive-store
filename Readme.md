![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> A [Seneca.js][] data storage plugin

# seneca-massive-store
Lead Maintainer: [Adrian Rossouw](https://github.com/adrianrossouw)

[![Build Status][travis-badge]][travis-url]
[![Gitter][gitter-badge]][gitter-url]

A storage engine that uses [massive.js][] to persist data into a postgresql database.

- __Version:__ 0.0.1
- __Tested on:__ Seneca 1.0
- __Node:__ 0.10, 0.12, 4
- __License:__ [MIT][]


If you're using this module, and need help, you can:

- Post a [github issue][],
- Tweet to [@senecajs][],
- Ask on the [Gitter][gitter-url].

If you are new to Seneca in general, please take a look at [senecajs.org][]. We have everything from
tutorials to sample apps to help get you up and running quickly.


## Install
To install, simply use npm. Remember you will need to install [Seneca.js][] if you haven't already.

```
npm install seneca
npm install seneca-massive-store
```

## Test
To run tests, simply use npm:

```
npm run test
```

## Quick Example

```js
var seneca = require('seneca')()
seneca.use(require('seneca-massive-store'), {
  connection: {
    db: 'massive_test'
  }
})

seneca.ready(function() {
  var apple = seneca.make$('fruit')
  apple.name = 'Pink Lady'
  apple.price = 0.99
  apple.save$(function (err, apple) {
    console.log("apple.id = " + apple.id)
  })
})
```

## Usage
You don't use this module directly. It provides an underlying data storage engine for the Seneca entity API:

```js
var entity = seneca.make$('typename')
entity.someproperty = "something"
entity.anotherproperty = 100

entity.save$(function (err, entity) { ... })
entity.load$({id: ... }, function (err, entity) { ... })
entity.list$({property: ... }, function (err, entity) { ... })
entity.remove$({id: ... }, function (err, entity) { ... })
```

### Query Support
The standard Seneca query format is supported:

- `.list$({f1:v1, f2:v2, ...})` implies pseudo-query `f1==v1 AND f2==v2, ...`.

- `.list$({f1:v1,...}, {sort$:{field1:1}})` means sort by f1, ascending.

- `.list$({f1:v1,...}, {sort$:{field1:-1}})` means sort by f1, descending.

- `.list$({f1:v1,...}, {limit$:10})` means only return 10 results.

- `.list$({f1:v1,...}, {skip$:5})` means skip the first 5.

- `.list$({f1:v1,...}, {fields$:['fd1','f2']})` means only return the listed fields.

Note: you can use `sort$`, `limit$`, `skip$` and `fields$` together.


## Testing with Docker

With docker installed run the following commands:

```
docker build -t massive-store --no-cache .
docker run -i  massive-store
```

## Native Driver
As with all seneca stores, you can access the native driver, in this case, the `massive.js` `db`
object using `entity.native$(function (err, db) {...})`.

## Contributing
The [Senecajs org][] encourage open participation. If you feel you can help in any way, be it with
documentation, examples, extra testing, or new features please get in touch.

## License
Copyright Adrian Rossouw and other contributors 2015, Licensed under [MIT][].

[travis-badge]: https://travis-ci.org/AdrianRossouw/seneca-massive-store.svg
[travis-url]: https://travis-ci.org/AdrianRossouw/seneca-massive-store
[gitter-badge]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/senecajs/seneca

[MIT]: ./LICENSE
[Senecajs org]: https://github.com/senecajs/
[Seneca.js]: https://www.npmjs.com/package/seneca
[senecajs.org]: http://senecajs.org/
[massive.js]: https://github.com/robconery/massive-js
[github issue]: https://github.com/AdrianRossouw/seneca-massive-store/issues
[@senecajs]: http://twitter.com/senecajs
