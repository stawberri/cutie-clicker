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

}();
