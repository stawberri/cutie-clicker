!function() {
  // Create a cc.render to deal with rendering type stuff
  // Also does general processing type stuff. Oops.
  cc.render = {
    tickInterval: 100, // 10fps
    drawInterval: 33 // 30fps
  };

  // Create a queue that runs over and over again. Passes time to each function.
    // This is for things that don't need to be updated that often.
    // Stuff like processing, but also visual stuff that's mostly handled by css.
    var tickQueue = $.Callbacks('memory unique');
    function tick(func) {
      // Add func to queue
      tickQueue.add(func);
    }
    // Run queue
    function doTick() {
      tickQueue.fire($.now());
      setTimeout(doTick, cc.render.tickInterval);
    }
    doTick();
    // Allow other scripts loaded after this one to add tasks.
    cc.render.tick = tick;

  // Same thing for rendering
    // This is for stuff that actually relies on Javascript to be updated.
    var drawQueue = $.Callbacks('memory unique');
    function draw(func) {
      // Add func to queue
      drawQueue.add(func);
    }
    // Run queue
    function doDraw() {
      drawQueue.fire($.now());
      setTimeout(doDraw, cc.render.drawInterval);
    }
    doDraw();
    cc.render.draw = draw;

  // Grab stuff from other scripts
    // Cutie rendering
    $.getScript('game/js/cutie-display.js');
    // Input processing
    $.getScript('game/js/input.js');
    // Visual effects
    $.getScript('game/js/effects.js');
    // Stats processing
    $.getScript('game/js/stats-processing.js');
    // Stats display
    $.getScript('game/js/stats-display.js');
}();
