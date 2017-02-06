/**
* Provides a sane path resolution utility.
*
* @module onepath
*/
const path = require('path');
const fs = require('fs');

// Patterns used to parse enviroment and custom variables from a path query
const REG_ENV_VAR = /{{(.*?)}}/g;  // e.g: {{EnvVariableName}/somefile.js
const REG_CUSTOM_VAR = /{(.*?)}/g; // e.g: {CustomVariableName}/somefile.js

/**
* Hash of key to pathQuery Strings, used to share know paths across instances
* @private
*/
const keys = {};

// So to load config only once
let configLoaded = false;

/**
* Look for a `./onepath.json`, if it exists load its keys
* @private
*/
const loadConfig = (pathQuery) => {
  try {
    const json = fs.readFileSync(onepath(pathQuery), 'utf8');
    try {
      const config = JSON.parse(json);
      if (config && typeof config === 'object' && !Array.isArray(config)) {
        Object.keys(config).forEach(key => {
          if (config[key] && typeof config[key] === 'string') {
            keys[key] = config[key];
          }
        });
      } else {
        console.warn('Found invalid config file: ./onepath.json');
      }
    } catch(e) {}
  } catch(e) {}
};

/**
* Uses `Error` to trace a calling function
* @private
* @return {Array} of `CallSite` instances. (methods: #getFileName(), #getLineNumber(), etc)
*/
function getStack() {
  // Save original Error.prepareStackTrace
  const origPrepareStackTrace = Error.prepareStackTrace;

  // Override with function that just returns `stack`
  Error.prepareStackTrace = function (_, stack) { return stack; };

  // Create a new `Error`, which automatically gets `stack`
  const error = new Error();

  // Evaluate `error.stack`, which calls our new `Error.prepareStackTrace`
  const stack = error.stack;

  // Restore original `Error.prepareStackTrace`
  Error.prepareStackTrace = origPrepareStackTrace;

  // Remove this caller from stack
  stack.shift();

  return stack;
}

// Export a function that needs to be executed in order call `process.cwd`
module.exports = () => {
  // Get callers' filename. Index zero SHOULD be this function/caller.
  const _filename = getStack()[1].getFileName();

  // Load config once
  if (!configLoaded) {
    loadConfig('./onepath.json');
    configLoaded = true;
  }

  /**
  * A sane path resolution utility
  * @param pathQuery {String}
  * @return {String}
  */
  const onepath = (pathQuery) => {  

    pathQuery = typeof pathQuery === 'string' ? pathQuery.trim() : '';

    // Relative
    if (pathQuery[0] === '~') {
      pathQuery =  `${path.dirname(_filename)}${pathQuery[1] === '/' ? '' : '/'}${pathQuery.slice(1)}`;
    }

    // Enviroment Variable
    if (pathQuery.indexOf('{{') !== -1) {
      pathQuery = pathQuery.replace(REG_ENV_VAR, (match, envKey) => onepath(process.env[envKey]) || '');
    }

    // Custom Variable
    if (pathQuery.indexOf('{') !== -1) {
      pathQuery = pathQuery.replace(REG_CUSTOM_VAR, (match, key) => onepath(keys[key]) || '');
    }

    return pathQuery ? path.resolve(pathQuery) : '';
  };

  /**
  * @method require
  * @param pathQuery {String}
  * @return {Mixed}
  */
  onepath.require = (pathQuery) => {
    pathQuery = ('' + pathQuery).trim();
    console.log('req', onepath(pathQuery))
    return require(onepath(pathQuery));
  }

  /**
  * @method set
  * @param key {String}
  * @param pathQuery {String}
  */
  onepath.set = (key, pathQuery) => {
    pathQuery = ('' + pathQuery).trim();
    keys[key] = pathQuery;
  };

  /**
  * @method unset
  * @param key {String}
  */
  onepath.unset = (key) => {
    keys[key] = '';
  };

  // Expose path methods, since `path` is already required here.
  // @todo: Proxy methods so paths handled can interpert (~) 
  // relative paths.
  onepath.basename = path.basename.bind(path);
  onepath.delimiter = path.delimiter;
  onepath.dirname = path.dirname.bind(path);
  onepath.extname = path.extname.bind(path);
  onepath.format = path.format.bind(path);
  onepath.isAbsolute = path.isAbsolute.bind(path);
  // @todo: isRelative for (~)
  onepath.join = path.join.bind(path);
  onepath.normalize = path.normalize.bind(path);
  onepath.parse = path.parse.bind(path);
  onepath.posix = path.posix;
  onepath.normalize = path.normalize.bind(path);
  onepath.relative = path.relative.bind(path);
  onepath.resolve = path.resolve.bind(path);
  onepath.sep = path.sep;
  onepath.win32 = path.win32;

  // expose initialized utility
  return onepath;
};
