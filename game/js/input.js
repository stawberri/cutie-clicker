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
      cc.stats.excitement('2');

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
}();
