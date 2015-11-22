// Handles the menu

!function() {
  // Initialize menu data
  var data = cc.ls.d.menu || cc.ls.d.write('menu', {}).menu;

  // Menu opening
  $('#cutie-bar-m').click(function() {
    // Nice and simple
    if(!cc.preBurst && !cc.burstReady) {
      data.write('active', !data.active);
      $('body').toggleClass('menu-active');
    }
  });
  // Load menu open state
  if(data.active) {
    $('body').addClass('menu-active');
  }

}();
