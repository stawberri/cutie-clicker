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
          var buttons = $('.menu-loot-button').prop('disabled', true)
          var index = buttons.index(this);

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

          // Start looted animation
          var animateIndex = 0;
          var interval = setInterval(function() {
            if(animateIndex == loot.length) {
              buttons.eq(index).html(loot[index][0]);

              animateIndex++;
            } else if(animateIndex == loot.length + 1) {
              clearInterval(interval);
              cc.effect.lightBurst({mouseEvent: ev}).done(function() {
                leave('showcase', cc.loot(looted[1]));
              });
            } else {
              if(animateIndex == index) {
                if(animateIndex == loot.length - 1) {
                  // Special case - player clicked on last card
                  buttons.eq(animateIndex).html(loot[animateIndex][0]);
                  animateIndex += 2;
                  return;
                } else {
                  animateIndex++;
                }
              }

              buttons.eq(animateIndex).html(loot[animateIndex][0]);
              animateIndex++;
            }
          }, 500);
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
