var glob = require("glob")
var path = require("path")
var fs = require("fs")
var marked = require('marked')
var Project = require("./Project")

var projects = {}
module.exports = projects

var projectIndex = null

//projects.cache = true

projects.get = function( projectDir, cb ){
  projects.index(function( err, projectIndex ){
    if( err ) return cb(err)
    projectIndex.some(function( project ){
      if( project.dir == projectDir ){
        cb(null, project)
        return true
      }
      return false
    })
  })
}
projects.add = function( req, res, next ){}
projects.index = function( cb ){
  if( projectIndex ) return cb(null, projectIndex)
  glob("projects/*", function( err, projects ){
    if( err ) return cb(err)
    projects = projects.map(function( dirName ){
      var project = new Project()
      var projectDir = path.resolve(dirName)
      project.setDir(projectDir)
      var dataFile = path.join(projectDir, "data.js")
      try{
        require(dataFile)(project)
      }
      catch( e ){
        return cb(e)
      }
      return project
    })
//    if( projects.cache ) projectIndex = projects
    cb(null, projects)
  })
}
projects.full = function( projectDir, cb ){
  projects.get(projectDir, function( err, project ){
    if( err ) return cb(err)
//    if( project.cache && project.article ) return cb(null, project)
    var articleFile = path.join(project.path, "article.md")
    fs.readFile(articleFile, "utf8", function( err, contents ){
      if( err ) return cb(err)
      project.setArticle(marked(contents))
      cb(null, project)
    })
  })
}