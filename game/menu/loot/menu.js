!function() {
  var leaveOk = false;
  function leave(script, state) {
    leaveOk = true;
    cc.menu(script, state);
  }

  var script = 'loot', dir = 'menu/' + script + '/',
  menu = cc.menu[script] = function(element, state) {
    cc.util.getcss(dir + 'menu.css');

    // Return home if state is missing loot lists
    if($.type(state.loot) !== 'array' || state.loot.length < 1) {
      leave('home');
    } else {
      var loot = state.loot;
      var looting;
      element.load(cc.util.l(dir + 'menu.html'), function() {
        // Grab loot element as template and add event
        var buttonOriginal = $('.menu-loot-button').remove();
        buttonOriginal.click(function(ev) {
          if(looting) {
            return;
          } else {
            looting = true;
          }

          // Disable buttons and get index of button
          var index = $('.menu-loot-button').prop('disabled', true).index(this);

          // Pick loot
          cc.util.shuffle(loot);
          var looted = loot[index];

          // Need special actions?
          if($.inArray('m cutieLootCooldown', looted, 2) > 1) {
            // Set cooldown to 23 hours
            cc.cuties.m(function(cutie) {
              cutie.cutieLootCooldown($.now() + 82800000);
            })
          }

          cc.effect.lightBurst({mouseEvent: ev}).done(function() {
            leave('showcase', cc.loot(looted[1]));
          });
        });

        // Add them to loot-wrap
        $.each(loot, function() {
          $('#menu-loot-wrap').append(buttonOriginal.clone(true));
        });
      });
    }
  };

  menu.open = function(open) {
    if(open === false) {
      return false;
    }
  }

  menu.exit = function(script, state) {
    return leaveOk;
  }
}();
