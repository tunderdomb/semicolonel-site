!function( Processing, images, program ){
  var sketch = new Processing.Sketch()

  // preload images
  !function( img ){
    for( var name in img ){
      if( img.hasOwnProperty(name) ){
        if( Array.isArray(img[name]) ){
          img[name].forEach(function( img ){
            sketch.imageCache.add(img)
          })
        }
        else{
          sketch.imageCache.add(img[name])
        }
      }
    }
  }(images);

  sketch.attachFunction = function( P ){
    for( var name in images ){
      if( images.hasOwnProperty(name) ){
        if( Array.isArray(images[name]) ){
          images[name] = images[name].map(function( img ){
            return P.loadImage(img)
          })
        }
        else{
          images[name] = P.loadImage(images[name])
        }
      }
    }
    program(images, P)
  }

  var canvas = document.getElementById("background-canvas")
// attaching the sketch to the canvas
  new Processing(canvas, sketch)

}(window.Processing, {
  // images
//  sky: "static/img/blue-sky.jpg",
//  sky: "static/img/21335-clouds-and-blue-sky-1920x1200-digital-art-wallpaper.jpg",
//  sky: "static/img/night-sky-hd-wallpaper.jpg",
//  nightSky: "static/img/night-sky-hd-wallpaper.jpg",
//  earth: "static/img/icons/31_cloud_weather.png",
  earth: "static/img/icons/colored_earth.png",
//  cloud: "static/img/icons/white_cloud.png",
  cloud: "static/img/icons/transparent_white_cloud.png",
//  clouds: [
//    "static/img/clouds/cloud1.png",
//    "static/img/clouds/cloud2.png",
//    "static/img/clouds/cloud3.png",
//    "static/img/clouds/cloud4.png",
//    "static/img/clouds/cloud5.png",
//    "static/img/clouds/cloud6.png",
//    "static/img/clouds/cloud7.png",
//    "static/img/clouds/cloud8.png",
//    "static/img/clouds/cloud9.png",
//    "static/img/clouds/cloud10.png",
//    "static/img/clouds/cloud11.png"
//  ],
  sun: "static/img/icons/yellow_sun.png"
}, function( images, P ){
  // 2nd dimension of perlin noise
  var yoff = 0.0
  var waterMinHeight = 100
    , waterMaxHeight = 250

  var clouds
    , cloudCount = 10

  P.setup = function(){
    P.size(1920, 1080)
    clouds = (function( clouds, count ){
      while( count-- ){
        var position = new Point(random(P.width), random(P.height))
          , img = images.cloud
          , cloud = new Cloud(position, img)
          , scale = Math.random() + .25
        cloud.scale(scale)
        clouds.push(cloud)
      }
      return clouds
    }([], cloudCount))

//    P.noLoop()
  }

  P.draw = function(){
    P.background(255, 255, 255, 0)

    // sky
//    drawSky()
    drawClouds()

    // water
//    drawGlobeWater(100)
    drawLevelWater()
  }

  function drawSky(){
    var time = new Date(Date.now())
    var hour = time.getHours()
    var minutes = time.getMinutes()
    var dayTime = (hour * 60 + minutes) / (60 * 24)

    var sky
    if( hour > 6 && hour < 20 ){
      sky = images.sky
    }
    else{
      sky = images.nightSky
    }

//    P.image(sky)

    var earth = images.earth
//    P.image(earth, P.width/2-earth.width/2, P.height-earth.height-waterMinHeight/2)
    P.image(earth, 10, 100, earth.width / 1.5, earth.height / 1.5)

    var sun = images.sun
    var sunAngle = dayTime * 180 - 180
      , sunDistance = 450
      , x = sunDistance * Math.cos(sunAngle * Math.PI / 180)
      , y = sunDistance * Math.sin(sunAngle * Math.PI / 180)
    // position the sun slightly above water
    x += P.width / 2 - sun.width / 2
    y += P.height - sun.height - waterMinHeight
    P.image(sun, x, y)
  }

  // Cloud
  function Cloud( position, img ){
    this.img = img
    this.width = img.width
    this.height = img.height
    this.position = position
    this.velocity = new Point(0, 0)
    this.wanderAngle = 0
    this.maxTravelSpeed = Math.random() * 1.4
  }

  Cloud.prototype.update = function(){
    this.wander()
    this.move()
    this.checkBounds()
    this.draw()
  }
  Cloud.prototype.checkBounds = function(){
    // relocate upon leaving vertical edges
    if( this.position.x > P.width ){
      this.position.x = 0 - this.width
    }
    else if( this.position.x + this.width < 0 ){
      this.position.x = P.width
    }
    // keep within horizontal edges
//    if( this.position.y+this.img.height > P.height ){
//      this.position.y = P.height-this.img.height
//    }
//    else if( this.position.y < 0 ){
//      this.position.y = 0
//    }
    if( this.position.y > this.height * 2 ){
      this.position.y = this.height * 2
    }
    else if( this.position.y < this.height ){
      this.position.y = this.height
    }
  }
  Cloud.prototype.wander = function(){
    var wanderRadius = .5
    var wanderDistance = 0.1
    var angleChange = 0.0

    var wanderForce = this.velocity.clone()
    wanderForce.multiply(wanderDistance)
//    circleCenter.add(this.position)

    // Calculate the displacement force
    var displacement = new Point(0, -1)
//    var displacement = new Point(wanderRadius * Math.cos(60), wanderRadius * Math.sin(60))
    displacement.multiply(wanderRadius)

    // Randomly change the vector direction
    // by making it change its current angle
    displacement.angle = this.wanderAngle

    this.wanderAngle += Math.random() * (angleChange * 2) - angleChange

    wanderForce.add(displacement)
//    wanderForce.truncate(this.maxTravelSpeed)
//    this.velocity.add(wanderForce)

    this.steer(wanderForce)
  }
  Cloud.prototype.steer = function( target ){
    target.truncate(this.maxTravelSpeed)
    var wanderForce = new Point(target.x - this.velocity.x, target.y - this.velocity.y)
    this.velocity.add(wanderForce)
  }
  Cloud.prototype.move = function(){
    this.position.add(this.velocity)
  }
  Cloud.prototype.scale = function( k ){
    this.width = this.img.width * k
    this.height = this.img.height * k
  }
  Cloud.prototype.draw = function(){
    P.image(this.img, this.position.x, this.position.y, this.width, this.height)
  }

  // Point
  function Point( x, y ){
    this.x = x
    this.y = y
    this._angle = 0
  }

  Point.prototype = {
    get zero(){
      return this.x === 0 && this.y === 0
    },
    get length(){
      var l = this.x * this.x + this.y * this.y
      return Math.sqrt(l)
    },
    set angle( angle ){
      this._angle = angle
      var length = this.length
      this.x = Math.cos(angle) * length
      this.y = Math.sin(angle) * length
    },
    get angle(){
      return this._angle
    },
    set length( length ){
      if( this.zero ){
        var angle = this.angle || 0
        this.x = Math.cos(angle) * length
        this.y = Math.sin(angle) * length
      }
      else{
        var scale = length / this.length
        this.multiply(scale)
      }
      return length
    }
  }

  Point.prototype.clone = function(){
    return new Point(this.x, this.y)
  }
  Point.prototype.truncate = function( maxLength ){
    var l = this.length
    if( l > maxLength ) this.length = maxLength
    return this
  }
  Point.prototype.multiply = function( k ){
    this.x *= k
    this.y *= k
    return this
  }
  Point.prototype.add = function( p ){
    this.x += p.x
    this.y += p.y
    return this
  }

  function random( min, max ){
    if( max == undefined ){
      max = min
      min = 0
    }
    return Math.random() * (max - min + 1) + min
  }

  function drawClouds(){
    clouds.forEach(function( cloud ){
      cloud.update()
    })
  }

  function drawGlobeWater( sides ){
    P.pushMatrix()
    var displayX = 0.04
      , displaceY = 0.004

    var i = -1
      , sideAngle = 360 / sides
      , angle
      , radius
      , x
      , y
      , prevX
      , prevY
      , firstX
      , firstY

    var xoff = 0.0

    P.translate(P.width / 2, P.height - waterMinHeight)
    P.rotate(90)
    P.stroke(15, 164, 220)
//    P.stroke(0)
    P.fill(64, 157, 224)
    P.beginShape()
    while( ++i < sides ){
      angle = i * sideAngle

      radius = P.map(P.noise(xoff, yoff), 0, 1, waterMinHeight, waterMaxHeight)

      x = radius * Math.cos(angle * Math.PI / 180)
      y = radius * Math.sin(angle * Math.PI / 180)
      firstX = firstX || x
      firstY = firstY || y

//      P.line(0, 0, x, y)
      P.vertex(x, y)
//      P.curveVertex(x, y)
      if( prevX != undefined && prevY != undefined ){
//        P.line(prevX, prevY, x, y)
      }
      else{
//        firstX = x
//        firstY = y
      }
//      prevX = x
//      prevY = y
      xoff += displayX
//      if( i >= sides / 2 ){
//        xoff -= displayX
//      }
//      else {
//        xoff += displayX
//      }
    }
    yoff += displaceY
//    P.curveVertex(firstX, firstY)
    P.endShape(P.CLOSE)
//    P.line(x, y, firstX, firstY)

//    P.endShape(P.CLOSE)

//    P.fill(64, 157, 224)
//    P.beginShape()
//    P.vertex(0, 50)
//    P.vertex(50, 50)
//    P.vertex(50, 0)
//    P.vertex(0, 0)
//    P.endShape(P.CLOSE)

    P.popMatrix()
  }

  function drawLevelWater(){
    P.pushMatrix()

//    P.fill(9, 120, 203)
//    P.stroke(9, 120, 203)
    P.fill(24, 109, 150)
    P.stroke(24, 109, 150)
//    P.fill(65, 149, 198)
//    P.stroke(65, 149, 198)
    P.fill(250)
    P.stroke(0)
    P.beginShape()

    // Option #1: 2D Noise
    // var xoff = 0
    // Option #2: 1D Noise
    var xoff = -yoff

    // Iterate over horizontal pixels
    for( var x = 0; x <= P.width; x += 10 ){
      // Calculate a y value according to noise, map to
      // Option #1: 2D Noise
      var y = P.map(P.noise(xoff, yoff), 0, 1, waterMinHeight, waterMaxHeight)
      // Option #2: 1D Noise
      // var y = P.map(P.noise(xoff), 0, 1, 200,300)

      // Set the vertex
      P.vertex(x, P.height - y)
      // Increment x dimension for noise
      xoff += 0.05
    }
    // increment y dimension for noise
    yoff += 0.01
    P.vertex(P.width, P.height)
    P.vertex(0, P.height)
    P.endShape(P.CLOSE)

    P.popMatrix()
  }
})