!function() {
  var script = 'store', dir = 'menu/' + script + '/',
  menu = cc.menu[script] = function(element) {
    cc.util.getcss(dir + 'menu.css');
    element.load(cc.util.l(dir + 'menu.html'), function() {
      $('#menu-store-buy-cutie').click(function(ev) {
        // If cooldown is still running, don't do anything.
        if(cc.util.rhanum(cc.ls.d, 'dailyShopCutie') > $.now()) {
          return;
        }

        if(cc.stats.mpcost('1000', true)) {
          // Set cooldown to 23 hours
          cc.util.rhanum(cc.ls.d, 'dailyShopCutie', $.now() + 82800000);

          // Disable button
          $(this).prop('disabled', true);

          var index = cc.cuties.add('77');
          cc.effect.lightBurst({
            mouseEvent: ev
          }).done(function() {
            // Empty out menu to prevent flashing
            element.empty();
            cc.menu('showcase', {type: 'cutie', index: index});
          });
        }
      });
    });
  };

  menu.tick = function(now) {
    // Disable button when it's on cooldown
    if(cc.util.rhanum(cc.ls.d, 'dailyShopCutie') > $.now()) {
      $('#menu-store-buy-cutie .countdown').addClass('cv-countdown').attr('data-time', cc.util.rhanum(cc.ls.d, 'dailyShopCutie'));
      $('#menu-store-buy-cutie').prop('disabled', true);
    } else {
      $('#menu-store-buy-cutie').prop('disabled', false);
    }
  };
}();
