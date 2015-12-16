!function() {
  var leaveOk = false, looting;
  function leave(script, state) {
    leaveOk = true;
    cc.menu(script, state);
  }

  var script = 'loot', dir = 'menu/' + script + '/',
  menu = cc.menu[script] = function(element, state) {
    cc.util.getcss(dir + 'menu.css');

    if(state.showcase) {
      // Previous loot got interrupted. Immediately skip to showcase.
      leave('showcase', state.showcase);
    } else if($.type(state.loot) !== 'array' || state.loot.length < 1) {
      // Return home. State is missing loot lists
      leave('home');
    } else {
      looting = false;
      element.load(cc.util.l(dir + 'menu.html'), function() {
        // Grab loot element as template and add event
        var buttonOriginal = $('.menu-loot-button').remove();
        buttonOriginal.click(buttonClick);

        // Add them to loot-wrap
        $.each(state.loot, function() {
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

  function buttonClick(ev) {
    if(looting) {
      return;
    } else {
      looting = true;
    }

    // Get loot
    var stateR = cc.menu.state();
    var loot = stateR.loot;

    // Disable buttons and get index of button
    var buttons = $('.menu-loot-button');
    $(this).addClass('chosen');
    buttons.prop('disabled', true);
    var index = buttons.index(this);

    // Pick and perform loot
    cc.util.shuffle(loot);
    var looted = loot[index];
    stateR.write('showcase', cc.loot(looted[1], looted[2]));

    // Need special actions?
    if($.inArray('m cutieLootCooldown', looted, 3) > 1) {
      // Set cooldown to 23 hours
      cc.cuties.m(function(cutie) {
        cutie.cutieLootCooldown($.now() + 82800000);
      })
    }

    // Start looted animation
    var animateIndex = 0;
    var interval = setInterval(function() {
      if(animateIndex == loot.length) {
        buttons.eq(index).find('.card-front').html(loot[index][0]);
        buttons.eq(index).addClass('revealed');

        animateIndex++;
      } else if(animateIndex == loot.length + 1) {
        clearInterval(interval);
        cc.effect.lightBurst({mouseEvent: ev}).done(function() {
          leave('showcase', stateR.showcase);
        });
      } else {
        if(animateIndex == index) {
          if(animateIndex == loot.length - 1) {
            // Special case - player clicked on last card
            buttons.eq(animateIndex).find('.card-front').html(loot[animateIndex][0]);
            buttons.eq(animateIndex).addClass('revealed');
            animateIndex += 2;
            return;
          } else {
            animateIndex++;
          }
        }

        buttons.eq(animateIndex).find('.card-front').html(loot[animateIndex][0]);
        buttons.eq(animateIndex).addClass('revealed');
        animateIndex++;
      }
    }, 500);
  }
}();
