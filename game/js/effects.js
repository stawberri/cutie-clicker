// Screen effects!

!function() {
  // Parallax handling
  var parallaxMouse = {x: 0, y: 0};
  function parallax(mouseX, mouseY) {
    parallaxMouse.x = mouseX;
    parallaxMouse.y = mouseY;
  }
  cc.render.draw(function() {
    mouseX = parallaxMouse.x;
    mouseY = parallaxMouse.y;

    // Ensure range is okay
    if(mouseX < -1) mouseX = -1;
    else if(mouseX > 1) mouseX = 1;
    if(mouseY < -1) mouseY = -1;
    else if(mouseY > 1) mouseY = 1;

    var xMult = $('body').width();
    var yMult = $('body').height();

    xMult *= .005 * mouseX;
    yMult *= .005 * mouseY;

    cc.util.cssrule('.parallax-0')({
      transform: 'translate(' + (1 * xMult) + 'px,' + (1 * yMult) + 'px)'
    });
    cc.util.cssrule('.parallax--0')({
      transform: 'translate(' + (-1 * xMult) + 'px,' + (-1 * yMult) + 'px)'
    });
    cc.util.cssrule('.parallax-1')({
      transform: 'translate(' + (2 * xMult) + 'px,' + (2 * yMult) + 'px)'
    });
    cc.util.cssrule('.parallax--1')({
      transform: 'translate(' + (-2 * xMult) + 'px,' + (-2 * yMult) + 'px)'
    });
    cc.util.cssrule('.parallax-2')({
      transform: 'translate(' + (4 * xMult) + 'px,' + (4 * yMult) + 'px)'
    });
    cc.util.cssrule('.parallax--2')({
      transform: 'translate(' + (-4 * xMult) + 'px,' + (-4 * yMult) + 'px)'
    });
    cc.util.cssrule('.parallax-3')({
      transform: 'translate(' + (8 * xMult) + 'px,' + (8 * yMult) + 'px)'
    });
    cc.util.cssrule('.parallax--3')({
      transform: 'translate(' + (-8 * xMult) + 'px,' + (-8 * yMult) + 'px)'
    });
    cc.util.cssrule('.parallax-4')({
      transform: 'translate(' + (16 * xMult) + 'px,' + (16 * yMult) + 'px)'
    });
    cc.util.cssrule('.parallax--4')({
      transform: 'translate(' + (-16 * xMult) + 'px,' + (-16 * yMult) + 'px)'
    });
  });

  $(window).on('mousemove', function(ev) {
    // Need to use body size, since document includes everything, and I have no idea what window is doing
    var mouseX = (ev.pageX/($('body').width() - 1));
    var mouseY = (ev.pageY/($('body').height() - 1));

    mouseX = 2 * (mouseX - .5);
    mouseY = 2 * (mouseY - .5);

    parallax(mouseX, mouseY);
  });
  var tiltCenter = {gamma: 0, beta: 0};
  function tiltAdjustment(orig, orib) {
    // Begin by normalizing.
    var originalGamma = (orig / 30);
    var originalBeta = (orib / 30);

    // Adjust for annoying orientation issues
    if(window.orientation == 90) {
      gamma = originalBeta;
      beta = -originalGamma;
    } else if(window.orientation == -90) {
      gamma = -originalBeta;
      beta = originalGamma;
    } else {
      gamma = originalGamma;
      beta = originalBeta;
    }

    // Recenter gamma and beta
    centeredGamma = gamma - tiltCenter.gamma;
    centeredBeta = beta - tiltCenter.beta;

    // Perform nudging
    if(centeredGamma < -1) tiltCenter.gamma = gamma + 1;
    else if(centeredGamma > 1) tiltCenter.gamma = gamma - 1;
    if(centeredBeta < -1) tiltCenter.beta = beta + 1;
    else if(centeredBeta > 1) tiltCenter.beta = beta - 1;

    return {x: centeredGamma, y: centeredBeta};
  }
  $(window).on('deviceorientation', function(ev) {
    var virtualMouse = tiltAdjustment(ev.originalEvent.gamma, ev.originalEvent.beta);

    parallax(virtualMouse.x, virtualMouse.y);
  });
}();
