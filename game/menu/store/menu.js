!function() {
  var script = 'store', dir = 'menu/' + script + '/',
  menu = cc.menu[script] = function(element) {
    cc.util.getcss(dir + 'menu.css');
    element.load(cc.util.l(dir + 'menu.html'), function() {
      $('#menu-store-buy-cutie').click(function(ev) {
        if(cc.stats.mpcost('1000', true)) {
          // Disable button
          $(this).prop('disabled', true)

          var index = cc.cuties.add('77');
          cc.effect.lightBurst({
            x: ev.pageX - $(window).scrollLeft(),
            y: ev.pageY - $(window).scrollTop()
          }).done(function() {
            // Empty out menu to prevent flashing
            element.empty();
            cc.menu('showcase', {type: 'cutie', index: index});
          });
        }
      })
    });
  };
}();
