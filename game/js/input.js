// This script processes general input tasks

!function() {
  // Main click handler
  var recentClickTimeout;

  $('#cutie-clicker').on('mousedown touchstart', function(ev) {
    ev.preventDefault();

    clearTimeout(recentClickTimeout);

    // Update click counter
    cc.stats.clicks.add(1);

    // Award excitement
    cc.cuties.m(function(cutie) {
      cc.stats.excitement('1');

      // Add event classes
      $('html').addClass('ce-recent-click ce-mousedown');
    });
  });

  $('#cutie-clicker').on('mouseup touchend', function(ev) {
    ev.preventDefault();

    // Add event classes
    $('html').removeClass('ce-mousedown');

    recentClickTimeout = setTimeout(function() {
      $('html').removeClass('ce-recent-click');
    }, 250);
  });

  // Skill buttons
  $('#cutie-bar-l, #cutie-bar-r').click(function(ev) {
    if(cc.ls.d.menu.active) {
      return;
    }

    var buttonElement = $(this), index;
    switch(buttonElement.attr('id')) {
      case 'cutie-bar-l':
        index = cc.cuties.l();
      break;

      case 'cutie-bar-r':
        index = cc.cuties.r();
      break;
    }

    if($.type(index) !== 'number') {
      // No cutie.
      buttonElement.removeClass('primed');
      return;
    }

    cc.cuties(index, function(cutie) {
      // Are we primed?
      if(buttonElement.hasClass('primed')) {
        // Use skill
        if(cc.stats.mpcost(cutie.skillCost(), true)) {
          cutie.skillUse();
        }
      } else {
        $('html').on('mousedown touchstart', function(ev2) {
          if(!buttonElement.is(ev2.target)) {
            $('html').off(ev2);
            buttonElement.removeClass('primed');
          }
        });

        buttonElement.addClass('primed');
      }
    });
  });
}();
