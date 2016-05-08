# [onepath]()

> A sane path resolution utility

```
npm i onepath --save
```

[onepath]() was created to unify path resolution across node instances.

## Modifiers

- `.` A dot prefix is  a path relative to the working directory e.g `process.cwd()`
- `~` A tilde prefix is a path relative to the file that called the onepath utility
- `{KEY}` Are is a path that was set with `onepath.set`
- `{{ENV}}` Are is a paht that was set as enviroment variable

## API

*String* **onepath**(*String* pathQuery)
Returns a resolved path.

*Mixed* **onepath.require**(*String* pathQuery)
Require a module using onepath.

**onepath.set**(*String* key, *String* pathQuery)
Set a path key that can be included in single braces
example: 

	onepath.set('VIEW_FOLDER', './lib/views')
	onepath('{VIEW_FOLDER}/elements/sample.html') 

Returns *./lib/views/elements/sample.html*

**onepath.unset**(*String* key)
Removes a path key that was previously set

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
var CONFIG_DIR = process.NODE_ENV.CONFIG_DIR
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
