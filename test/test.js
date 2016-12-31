var onepath = require('..')();
var should = require('should')

var CWD = process.cwd().replace(/\/$/, '') // remove trailing slash

describe('#test.js', function(){

	console.log('  CWD', CWD)

	describe('onepath(.)', function(){
		it('. === CWD', function(){
			should(onepath('.')).equal(CWD)
		})
		it('./ === CWD', function(){
			should(onepath('./')).equal(CWD)
		})
		it('./../onepath === CWD', function(){
			should(onepath('./../onepath')).equal(CWD)
		})
		it('../onepath === CWD', function(){
			should(onepath('../onepath')).equal(CWD)
		})
	})
	describe('onepath(~)', function(){
		it('~ === __dirname', function(){
			should(onepath('~')).equal(__dirname)
		})
		it('~/folder/file === __dirname/folder/file', function(){
			should(onepath('~/folder/file')).equal(__dirname + '/folder/file')
		})
		it('~/folder/file/.. === __dirname/folder', function(){
			should(onepath('~/folder/file/..')).equal(__dirname + '/folder')
		})
	})
	describe('onepath({})', function(){
		it('DESC', function(){
			should(onepath('{cwfdasfhdasfhipsd}')).equal('')
			should(onepath('{cwfdasfhdasfhipsd}/x')).equal('/x')
			should(onepath('{cwfdasfhdasfhipsd}/x/y')).equal('/x/y')
		})
	})
	describe('onepath({{}})', function(){
		it('DESC', function(){
			should(onepath('{{cwfdasfhdasfhipsd}}')).equal('')
			should(onepath('{{cwfdasfhdasfhipsd}}/x')).equal('/x')
			should(onepath('{{cwfdasfhdasfhipsd}}/x/y')).equal('/x/y')
		})
	})
	describe('onepath({{ENV}})', function(){
		it('DESC', function(){
			process.env.SOME_PATH = '/1/2/3/4'
			should(onepath('{{SOME_PATH}}')).equal('/1/2/3/4')
			should(onepath('{{SOME_PATH}}/x')).equal('/1/2/3/4/x')
			should(onepath('{{SOME_PATH}}/x/y')).equal('/1/2/3/4/x/y')
		})
	})
	describe('onepath.set(KEY, PATH)', function(){
		it('set("A", "/dir/dir/file") === onepath({A})', function(){
			onepath.set('A', '/dir/dir/file')
			should(onepath('{A}')).equal('/dir/dir/file')
		})
		it('set("B", "/x/y/z") === onepath({B})', function(){
			onepath.set('B', '/x/y/z')
			should(onepath('{B}')).equal('/x/y/z')
		})
		it('onepath({A}/folder/folder/dir) === /dir/dir/file/folder/folder/file', function(){
			onepath.set('A', '/dir/dir/file')
			should(onepath('{A}/folder/folder/dir')).equal('/dir/dir/file/folder/folder/dir')
		})
		it('onepath({A}/folder/folder/dir) === /dir/dir/file/folder/folder/file', function(){
			onepath.set('A', '/dir/dir/file')
			should(onepath('{A}/folder/folder/dir')).equal('/dir/dir/file/folder/folder/dir')
		})
		it('onepath({A}/{B}) = /dir/dir/file/x/y/z', function(){
			should(onepath('{A}/{B}')).equal('/dir/dir/file/x/y/z')
			should(onepath('{A}{B}')).equal('/dir/dir/file/x/y/z')
			should(onepath('{A}{B}/..')).equal('/dir/dir/file/x/y')
		})
	})
	describe('onepath.unset(KEY)', function(){
		it('set and verify unset', function(){
			onepath.set('A', '/x/y/z')
			should(onepath('{A}')).equal('/x/y/z')
			onepath.unset('A')
			should(onepath('{A}')).equal('')
		})
	})
})
