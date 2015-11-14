!function() {
  var tickInterval = 100;

  // Create a cc.render to deal with rendering type stuff
  cc.render = {};

  // Create a queue that runs over and over again. Passes time to each function.
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
        msg += 'LV ' + cutie.lv() + ' - ';
        msg += cc.stats.xp() + '/' + cutie.targetxp() + 'XP ';
        $('#click-counter').html(msg);
      });
    });
}();
