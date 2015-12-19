!function() {
  var script = 'stats', dir = 'menu/' + script + '/',
  menu = cc.menu[script] = function(element, state) {
    cc.util.getcss(dir + 'menu.css');
    element.load(cc.util.l(dir + 'menu.html'), function() {
      // Total playtime
      $('#menu-stats-total-play-time .countdown').attr('data-time', cc.util.rhanum(cc.ls.d, 'playedSince')).addClass('cv-countdown');

      // Cutie types
      $('#menu-stats-found-cutie-types .count').html($.map(cc.ls.d.cutieStats, function() {return true}).length);

      // Cutie cards
      $('#menu-stats-total-cutie-cards .count').html(cc.util.rhanum(cc.ls.d, 'totalCuties'));

      // Love
      $('#menu-stats-total-love .count').html(cc.util.rhanum(cc.ls.d, 'totalLv'));
    });
  };
}();
