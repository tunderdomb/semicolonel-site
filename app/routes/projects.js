var projects = require("../api/projects")
module.exports = function( app, manifest, page ){
  projects.cache = !manifest.env.development
  return function( req, res, next, done ){
    projects.index(function( err, projects ){
      if( err ) return done(err)
      done(null, {projects: projects})
    })
  }
}