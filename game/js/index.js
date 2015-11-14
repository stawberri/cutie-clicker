!function() {
  var tickInterval = 100;

  // Create a queue that runs over and over again. Passes time to each function.
  var tickQueue = [];
  function tick(func) {
    // Add func to queue
    tickQueue.push(func);
  }
  // Create function that runs queue
  function doTick() {
    var now = $.now();

    $.each(tickQueue, function(index, func) {
      func(now);
    });

    setTimeout(doTick, tickInterval);
  }
  doTick();

  // #layer-cutie
    // Load cutie renders
    var cutieM, cutieL, cutieR;
    tick(function() {
      // middle cutie
      cc.cuties.m(function(cutie) {
        if(cutieM != cutie.cutie) {
          cutieM = cutie.cutie;

          // Remove all classes from cutieM and add them back
          $('#cutie-m').removeClass().addClass('cutie-view cutie-' + cutie.cutie);

          // Load cutie html
          $('#cutie-m .cutie-embed').load('game/cuties/' + cutie.cutie + '/cutie.html');
        }
      });

      // left cutie
      // massive if statement checks if it's not defined
      if(!cc.cuties.l(function(cutie) {
        if(cutieL != cutie.cutie) {
          cutieL = cutie.cutie;

          // Remove all classes from cutieL and add them back
          $('#cutie-l').removeClass().addClass('cutie-view cutie-' + cutie.cutie);

          // Load cutie html
          $('#cutie-l .cutie-embed').load('game/cuties/' + cutie.cutie + '/cutie.html');
        }
      }) && cutieL) {
        cutieL = undefined;

        // Remove all classes from cutieL and add them back
        $('#cutie-l').removeClass().addClass('cutie-view');

        // Unload cutie
        $('#cutie-l .cutie-embed').html();
      }

      // right cutie
      // massive if statement checks if it's not defined
      if(!cc.cuties.r(function(cutie) {
        if(cutieR != cutie.cutie) {
          cutieR = cutie.cutie;

          // Remove all classes from cutieR and add them back
          $('#cutie-r').removeClass().addClass('cutie-view cutie-' + cutie.cutie);

          // Load cutie html
          $('#cutie-r .cutie-embed').load('game/cuties/' + cutie.cutie + '/cutie.html');
        }
      }) && cutieR) {
        cutieR = undefined;

        // Remove all classes from cutieR and add them back
        $('#cutie-r').removeClass().addClass('cutie-view');

        // Unload cutie
        $('#cutie-r .cutie-embed').html();
      }
    });

  // #layer-ui
    // Fetch clicks script to handle click button
    $.getScript('game/js/clicks.js');

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
