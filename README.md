# [onepath]()

> A sane path resolution utility

```
npm i onepath --save
```

## Quick Usage

```
const onepath = require('onepath')();

// Directory where onepath was called
console.log('~', onepath('~'));

// Current working directory
console.log('.', onepath('.'));

// $HOME$ enviroment variable used to get a users' home folder path
console.log('HOME', onepath('{{HOME}}')); 

// Set a custom variable
onepath.set('someFolder', '~/../someFolder/someOtherFolder');

// Use custom variable 
console.log('someFolder', onepath('{someFolder}')); 

// Remove custom variable
onepath.unset('someFolder');
```

[onepath]() was created to unify path resolution across node instances.

## Modifiers

- `.` A dot prefix is a path relative to the working directory e.g `process.cwd()`
- `~` A tilde prefix is a path relative to the file that called the [onepath]() utility
- `{KEY}` Is a path that was set with `onepath.set`
- `{{ENV}}` Is a path that was set as an enviroment variable

## API

*String* **onepath**(*String* pathQuery)
Returns a resolved path.

*Mixed* **onepath.require**(*String* pathQuery)
Require a module using onepath.

**onepath.set**(*String* key, *String* pathQuery)
Set a path key that can be included with single braces
example: 

	onepath.set('VIEW_FOLDER', './lib/views')
	onepath('{VIEW_FOLDER}/elements/sample.html') 

Returns *./lib/views/elements/sample.html*

**onepath.unset**(*String* key)
Removes a path key that was previously set

## Config (onepath.json)

[onepath]() will try to read a json file in the current working directory: `./onepath.json`

And use the contents as custom variables:

**Example** *onepath.json*
```
{
	"bin": "./project/bin",
	"images": "./project/assets/images",
	"engine_plugins": "~/plugins"
}
```

*e.g:*
```
const onepath = require('onepath')();
console.log(onepath('{images}/logo.png'));
```

--------------

### Use Cases

No more `../../../../hell`.

**Instead of:**

```
var path = require('path')
var relativeModule = path.join(__dirname, 'relative-module.js')
```

**This:**

```
var relativeModule = require(onepath('~/relative-module.js'))
```

**OR**

```
var relativeModule = onepath.require('~/relative-module.js')
```

--------------

**Instead of:**

```
var path = require('path')
var CONFIG_DIR = process.env.CONFIG_DIR
var knex = require(path.join(CONFIG_DIR, 'knexfile.js'))
```

**This:**

```
onepath.set('CONFIG_DIR', '/path/to/config')
var knex = onepath.require('{CONFIG_DIR}/knexfile.js')
```

**OR**

```
var knex = onepath.require('{{CONFIG_DIR}}/knexfile.js')
```

[MIT License]()
