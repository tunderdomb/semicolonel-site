Shapely is a slim data model for the browser and node.

It's api facilitates the getter-setter model that looks
like this in a nutshell:

```js
var thing = shapely(function init(){})
thing.has("name")
var aThing = thing()
aThing.name("John")
aThing.name() === "John"
```

It comes with some built in validators too.