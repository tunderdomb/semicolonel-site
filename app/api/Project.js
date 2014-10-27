var path = require("path")

module.exports = Project

function Project(  ){
  this.name = ""
  this.type = ""
  this.description = ""
  this.banner = null
  this.visible = true
  this.article = null
  this.links = []
  this.tags = []
  this.dir = null
  this.path = null
}

Project.prototype.setName = function( name ){
  this.name = name
  return this
}

Project.prototype.setType = function( type ){
  this.type = type
  return this
}

Project.prototype.describe = function( description ){
  this.description = description
  return this
}

Project.prototype.setBanner = function( banner ){
  this.banner = banner
  return this
}

Project.prototype.addLink = function( title, url, external ){
  this.links.push({title: title, url: url, external: !!external})
  return this
}

Project.prototype.tag = function( tag ){
  if( Array.isArray(tag) ) this.tags = this.tags.concat(tag)
  else this.tags.push(tag)
  return this
}

Project.prototype.hide = function(){
  this.visible = false
  return this
}

Project.prototype.setArticle = function( article ){
  this.article = article
  return this
}

Project.prototype.setDir = function( dir ){
  this.path = dir
  this.dir = path.basename(dir)
  return this
}