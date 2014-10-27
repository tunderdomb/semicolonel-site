var path = require("path")
var fs = require("fs")
var marked = require('marked')

module.exports = function( app, manifest, page ){
  return function( req, res, next, done ){
    var articleFile = path.join(process.cwd(), "pages/bio/article.md")
    fs.readFile(articleFile, "utf8", function( err, contents ){
      if( err ) return next(err)
      done(null, {
        article: marked(contents)
      })
    })
  }
}