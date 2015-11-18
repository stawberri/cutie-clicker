!function() {
  // Create a cc.loop to deal with rendering type stuff
  // Also does general processing type stuff. Oops.
  cc.loop = {
    taskInterval: 60000, // 60 seconds
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
      setTimeout(doTick, cc.loop.tickInterval);
    }
    doTick();
    // Allow other scripts loaded after this one to add tasks.
    cc.loop.tick = tick;

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
      setTimeout(doDraw, cc.loop.drawInterval);
    }
    doDraw();
    cc.loop.draw = draw;


  // Same thing for tasks
    // This runs least frequently
    var taskQueue = $.Callbacks('memory unique');
    function task(func) {
      // Add func to queue
      taskQueue.add(func);
    }
    // Run queue
    function doTask() {
      taskQueue.fire($.now());
      setTimeout(doTask, cc.loop.taskInterval);
    }
    doTask();
    cc.loop.task = task;

  // Grab stuff from other scripts
    // Cutie rendering
    cc.getScript('game/js/cutie-display.js');
    // Input processing
    cc.getScript('game/js/input.js');
    // Visual effects
    cc.getScript('game/js/effects.js');
    // Stats processing
    cc.getScript('game/js/stats-processing.js');
    // Stats display
    cc.getScript('game/js/stats-display.js');

  // Check for updates (the one thing this script does)
  // Don't do this locally.
  cc.f||task(function(now) {
    $.get('version.txt', {_: now}, function(data) {
      if($.type(cc.v) === 'string' && $.trim(data) !== cc.v) {
        // There's an update!
        $('#update-available').click(function() {
          location.reload();
        }).addClass('yes');
      }
    }, 'text');
  });
}();
