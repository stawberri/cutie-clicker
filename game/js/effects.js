// Screen effects!

!function() {
  // Parallax handling
  function parallax(mouseX, mouseY) {
    // Ensure range is okay
    if(mouseX < -1) mouseX = -1;
    else if(mouseX > 1) mouseX = 1;
    if(mouseY < -1) mouseY = -1;
    else if(mouseY > 1) mouseY = 1;

    cc.util.cssrule('.parallax-1')({
      transform: 'translate(' + (-10 * mouseX) + 'px,' + (-10 * mouseY) + 'px)'
    });
    cc.util.cssrule('.parallax--1')({
      transform: 'translate(' + (10 * mouseX) + 'px,' + (10 * mouseY) + 'px)'
    });
    cc.util.cssrule('.parallax-2')({
      transform: 'translate(' + (-8 * mouseX) + 'px,' + (-8 * mouseY) + 'px)'
    });
  }

  var lastParallaxTime;
  $(window).on('mousemove', function(ev) {
    // Throttle how much this executes
    if($.now() < lastParallaxTime + 10) return;

    // Need to use body size, since document includes everything, and I have no idea what window is doing
    var mouseX = (ev.pageX/($('body').width() - 1));
    var mouseY = (ev.pageY/($('body').height() - 1));

    mouseX = 2 * (mouseX - .5);
    mouseY = 2 * (mouseY - .5);

    parallax(mouseX, mouseY);

    // Throttle based on last completion time.
    lastParallaxTime = $.now();
  });
  var tiltCenter = {gamma: 0, beta: 0};
  function tiltAdjustment(orig, orib) {
    // Begin by normalizing.
    var originalGamma = (orig / 15);
    var originalBeta = (orib / 15);

    // Adjust for annoying orientation issues
    if(window.orientation == 90) {
      gamma = -originalBeta;
      beta = originalGamma;
    } else if(window.orientation == -90) {
      gamma = originalBeta;
      beta = -originalGamma;
    } else {
      gamma = -originalGamma;
      beta = -originalBeta;
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
    // Throttle how much this executes
    if($.now() < lastParallaxTime + 10) return;

    var mouse = tiltAdjustment(ev.originalEvent.gamma, ev.originalEvent.beta);

    parallax(mouse.x, mouse.y);

    // Throttle based on last completion time.
    lastParallaxTime = $.now();
  });
}();
