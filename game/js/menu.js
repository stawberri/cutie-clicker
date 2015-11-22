// Handles the menu

!function() {
  // Initialize menu data
  var data = cc.ls.d.menu || cc.ls.d.write('menu', {}).menu;

  // Menu opening
  $('#cutie-bar-m').click(function() {
    // Nice and simple
    data.write('active', !data.active);
    $('body').toggleClass('menu-active');
  });

  // Update class with variable
  cc.loop.tick(function() {
    if(data.active) {
      if(cc.ls.d.burst) {
        // If burst mode is active, deactivate menu
        data.active = false;
        $('body').removeClass('menu-active');
      } else if(!$('body').hasClass('menu-active')) {
        // Burst mode isn't active, but menu isn't open for some reason.
        $('body').addClass('menu-active');
      }
    } else {
      if($('body').hasClass('menu-active')) {
        // Menu shouldn't be active.
        $('body').removeClass('menu-active');
      }
    }
  });

  // Forward clicks on middle of top bar to cutie card
  $('#menu-close-button').click(function() {
    if(data.active) {
      // This doesn't prevent default, so be sure to check for the menu being active!
      $('#cutie-bar-m').click();
    }
  }).on('mousedown touchstart', function(ev) {
    ev.preventDefault();

    // Fake a click on cutie-bar-m
    $('#cutie-bar-m').addClass('fake-click');

    // Have to detect if player releases mouse anywhere.
    // Still doesn't work if they release it ouside of window
    $('body').one('mouseup touchend', function(ev) {
      ev.preventDefault();
      $('#cutie-bar-m').removeClass('fake-click');

      // But this doesn't click if player released mouse over cutie-bar-m, so fix that.
      if($('#cutie-bar-m').is(ev.target)) {
        $('#cutie-bar-m').click();
      }
    });
  });

}();
