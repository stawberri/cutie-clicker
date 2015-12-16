// Screen effects!

!function() {
  cc.effect = {};

  // Parallax handling
    var lastTiltTime = 0;
    var parallaxData = {x: 0, y: 0};
    function parallax(mouseX, mouseY) {
      parallaxData.x = mouseX;
      parallaxData.y = mouseY;
    }
    function parallaxTilt(gamma, beta) {
      parallaxData.gamma = gamma;
      parallaxData.beta = beta;
      lastTiltTime = $.now();
    }
    cc.loop.draw(function(now) {
      var mouseX, mouseY;

      // Tilt or mouse?
      if(now > lastTiltTime + 1000) {
        mouseX = parallaxData.x;
        mouseY = parallaxData.y;
      } else {
        var adjustedData = tiltAdjustment(parallaxData.gamma, parallaxData.beta);
        mouseX = adjustedData.x;
        mouseY = adjustedData.y;
      }

      // Ensure range is okay
      if(mouseX < -1) mouseX = -1;
      else if(mouseX > 1) mouseX = 1;
      if(mouseY < -1) mouseY = -1;
      else if(mouseY > 1) mouseY = 1;

      // var xMult = $('html').width();
      // var yMult = $('html').height();

      var xMult = .5 * mouseX;
      var yMult = .5 * mouseY;

      cc.util.cssrule('.parallax-0')({
        transform: 'translate(' + (1 * xMult) + '%,' + (1 * yMult) + '%)'
      });
      cc.util.cssrule('.parallax--0')({
        transform: 'translate(' + (-1 * xMult) + '%,' + (-1 * yMult) + '%)'
      });
      cc.util.cssrule('.parallax-1')({
        transform: 'translate(' + (2 * xMult) + '%,' + (2 * yMult) + '%)'
      });
      cc.util.cssrule('.parallax--1')({
        transform: 'translate(' + (-2 * xMult) + '%,' + (-2 * yMult) + '%)'
      });
      cc.util.cssrule('.parallax-2')({
        transform: 'translate(' + (4 * xMult) + '%,' + (4 * yMult) + '%)'
      });
      cc.util.cssrule('.parallax--2')({
        transform: 'translate(' + (-4 * xMult) + '%,' + (-4 * yMult) + '%)'
      });
      cc.util.cssrule('.parallax-3')({
        transform: 'translate(' + (8 * xMult) + '%,' + (8 * yMult) + '%)'
      });
      cc.util.cssrule('.parallax--3')({
        transform: 'translate(' + (-8 * xMult) + '%,' + (-8 * yMult) + '%)'
      });
      cc.util.cssrule('.parallax-4')({
        transform: 'translate(' + (16 * xMult) + '%,' + (16 * yMult) + '%)'
      });
      cc.util.cssrule('.parallax--4')({
        transform: 'translate(' + (-16 * xMult) + '%,' + (-16 * yMult) + '%)'
      });
    });

    var lastMouse = {x: 0, y: 0};
    $(window).on('mousemove.parallax', function(ev) {
      // Don't do anything if x and y haven't changed much
      if(Math.abs(ev.pageX - lastMouse.x) < 16 && Math.abs(ev.pageY - lastMouse.y) < 16) {
        return;
      } else {
        lastMouse.x = ev.pageX;
        lastMouse.y = ev.pageY;
      }

      // Need to use body size, since document includes everything, and I have no idea what window is doing
      var mouseX = ((ev.pageX - $(window).scrollLeft())/($('html').width() - 1));
      var mouseY = ((ev.pageY - $(window).scrollTop())/($('html').height() - 1));

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
    var lastTilt = {gamma: 0, beta: 0};
    $(window).on('deviceorientation', function(ev) {
      var gamma = ev.originalEvent.gamma;
      var beta = ev.originalEvent.beta;

      // Don't do anything if gamma and beta haven't changed much
      if(Math.abs(gamma - lastTilt.gamma) < 3 && Math.abs(beta - lastTilt.beta) < 3) {
        return;
      } else {
        lastTilt.gamma = gamma;
        lastTilt.beta = beta;
      }

      parallaxTilt(gamma, beta);
    });

  // Light Burst effect
  var lightBurstTemplate = $('<div class="light-burst">');
  lightBurstTemplate.append('<img class="glow" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">')
  cc.effect.lightBurst = function(settings) {
    settings = $.extend({
      mouseEvent: undefined,
      x: $('html').width() / 2,
      y: $('html').height() / 2
    }, settings);

    if(settings.mouseEvent) {
      settings.x = settings.mouseEvent.pageX - $(window).scrollLeft();
      settings.y = settings.mouseEvent.pageY - $(window).scrollTop();
    }

    var defer = $.Deferred();
    var element = lightBurstTemplate.clone();

    $('#layer-effects').append(element);

    // Set css stuff
    element.css({left: settings.x, top: settings.y})

    // Reflow
    element[0].offsetHeight;

    // Animate
    element.addClass('go');

    // Delete and resolve
    setTimeout(function() {
      defer.resolve();

      // Reflow
      element[0].offsetHeight;

      // Animate
      element.addClass('away');

      setTimeout(function() {
        element.remove();
      }, 300);
    }, 300);

    return defer;
  }
}();
