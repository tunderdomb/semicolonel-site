function drawTextAlongArc(context, str, centerX, centerY, radius, angle) {
  var len = str.length, s;
  context.save();
  context.translate(centerX, centerY);
  context.rotate(-1 * angle / 2);
  context.rotate(-1 * (angle / len) / 2);
  for(var n = 0; n < len; n++) {
    context.rotate(angle / len);
    context.save();
    context.translate(0, -1 * radius);
    s = str[n];
    context.fillText(s, 0, 0);
    context.restore();
  }
  context.restore();
}
!function(  ){
//  debugger
  var canvas = document.getElementById('myCanvas'),
    context = canvas.getContext('2d'),
    centerX = canvas.width / 2,
    centerY = canvas.height - 30,
    angle = Math.PI * 0.8,
    radius = 150;

  context.font = '30pt Calibri';
  context.textAlign = 'center';
  context.fillStyle = 'blue';
  context.strokeStyle = 'blue';
  context.lineWidth = 4;
  drawTextAlongArc(context, 'Text along arc path', centerX, centerY, radius, angle);

// draw circle underneath text
  context.arc(centerX, centerY, radius - 10, 0, 2 * Math.PI, false);
  context.stroke();

}(  )
