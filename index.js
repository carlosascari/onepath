/**
* Sane path resolution utility
*
* @module onepath
*/
module.exports = onepath
var path = require('path')
var keys = {}
var trace = {}

/**
* @method trace_caller
* @param signature {String}
* @return {String}
*/
function trace_caller(signature)
{
	Error.captureStackTrace(trace)
	var stack = trace.stack
	trace.stack = undefined
	var onepathLineStart = stack.indexOf('at onepath ')
	var onepathLineEnd = stack.indexOf('\n', onepathLineStart)
	var callerLineStart = stack.indexOf('at ', onepathLineEnd)
	var callerLineEnd = stack.indexOf('\n', callerLineStart)
	return stack.substring(callerLineStart, callerLineEnd).match(/\((.*?)\:.*\)/)[1]
}

/**
* @method onepath
* @param pathQuery {String}
* @return {String}
*/
function onepath(pathQuery)
{
	pathQuery = ('' + pathQuery).trim()
	
	// Relative to caller
	if (pathQuery[0] === '~')
	{
		pathQuery = path.dirname(trace_caller('at onepath ')) + (pathQuery[1] === '/' ? '' : '/')  + pathQuery.slice(1)
	}

	// Insert enviroment paths
	if (pathQuery.indexOf('{{') !== -1)
	{
		pathQuery = pathQuery.replace(
			/{{(.*?)}}/g,
			function(match, envKey)
			{
				return process.env[envKey] || ''
			}
		)
	}

	// Insert stored paths
	if (pathQuery.indexOf('{') !== -1)
	{
		pathQuery = pathQuery.replace(
			/{(.*?)}/g,
			function(match, key)
			{
				return keys[key] || ''
			}
		)
	}

	return pathQuery ? path.resolve(pathQuery) : ''
}

/**
* @method require
* @param pathQuery {String}
* @return {Mixed}
*/
onepath.require = function(pathQuery)
{
	pathQuery = ('' + pathQuery).trim()

	if (pathQuery[0] === '~')
	{
		pathQuery = path.dirname(trace_caller('onepath.require ')) + (pathQuery[1] === '/' ? '' : '/')  + pathQuery.slice(1)
	}

	return require(onepath(pathQuery))
}

/**
* @method set
* @param key {String}
* @param pathQuery {String}
*/
onepath.set = function(key, pathQuery)
{
	pathQuery = ('' + pathQuery).trim()

	if (pathQuery[0] === '~')
	{
		pathQuery = path.dirname(trace_caller('onepath.set ')) + (pathQuery[1] === '/' ? '' : '/')  + pathQuery.slice(1)
	}

	keys[key] = onepath(pathQuery)
}

/**
* @method unset
* @param key {String}
*/
onepath.unset = function(key)
{
	keys[key] = ''
}
