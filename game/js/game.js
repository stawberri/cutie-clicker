!function() {
  var tickInterval = 100; // 10fps
  var drawInterval = 40; // 25fps

  // Create a cc.render to deal with rendering type stuff
  // Also does general processing type stuff. Oops.
  cc.render = {};

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
      setTimeout(doTick, tickInterval);
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
      setTimeout(doDraw, drawInterval);
    }
    doDraw();
    cc.render.draw = draw;

  // Grab stuff from other scripts
    // Cutie rendering
    $.getScript('game/js/cutie-display.js');
    // Click button and associated processing
    $.getScript('game/js/clicks.js');
    // Visual effects
    $.getScript('game/js/effects.js');

    // Update cutie bar display
    tick(function() {
      cc.cuties.m(function(cutie) {
        var msg = '';
        msg += 'id: ' + cutie.cutie;
        msg += '<br>';
        msg += 'Lv: ' + cutie.lv();
        msg += '<br>';
        msg += 'tXP: ' + cutie.targetxp();
        msg += '<br>';
        msg += '-';
        msg += '<br>';
        msg += 'C: ' + cc.stats.clicks();
        msg += '<br>';
        msg += 'XP: ' + cc.stats.xp();
        $('#click-counter').html(msg);
      });
    });
}();
