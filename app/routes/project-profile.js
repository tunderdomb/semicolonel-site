var projects = require("../api/projects")
module.exports = function( app, manifest, page ){
  projects.cache = !manifest.env.development
  return function( req, res, next, done ){
    projects.full(req.params.project, function( err, project ){
      if( err ) return done(err)
      done(null, {project: project})
    })
  }
}