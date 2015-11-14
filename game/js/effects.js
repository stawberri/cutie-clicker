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
  $(window).on('deviceorientation', function(ev) {
    // Throttle how much this executes
    if($.now() < lastParallaxTime + 10) return;

    // Need to use body size, since document includes everything, and I have no idea what window is doing
    var mouseX = (ev.originalEvent.gamma / 90);
    var mouseY = (ev.originalEvent.beta / 90);

    parallax(mouseX, mouseY);

    // Throttle based on last completion time.
    lastParallaxTime = $.now();
  });
}();
