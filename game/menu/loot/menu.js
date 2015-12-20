!function() {
  var leaveOk = false, looting, buttonTemplate;
  function leave(script, state) {
    leaveOk = true;
    cc.menu(script, state);
  }

  var script = 'loot', dir = 'menu/' + script + '/',
  menu = cc.menu[script] = function(element, state) {
    cc.util.getcss(dir + 'menu.css');

    leaveOk = false;

    if(state.showcase) {
      // Previous loot got interrupted. Immediately skip to showcase.
      leave('showcase', state.showcase);
    } else if($.type(state.loot) !== 'array' || !state.loot.length) {
      // Return home. State is missing loot lists
      leave('home');
    } else {
      looting = false;
      element.load(cc.util.l(dir + 'menu.html'), function() {
        // Grab loot element as template and add event
        var buttonOriginal = $('.menu-loot-button').remove();
        buttonOriginal.click(buttonClick);
        buttonTemplate = function() {
          return buttonOriginal.clone(true);
        }

        // Display loot
        if(!state.displayLoot) {
          output = {
            displayLoot: [],
            validLoot: [],
            invalidLoot: [],
            refreshTime: false
          }

          cc.cuties.m(function(cutie) {
            var cutieLootCooldownPending = cutie.cutieLootCooldown() > $.now();

            output.displayLoot = $.map(state.loot, function(value, index) {
              var valid = true;

              if(cutieLootCooldownPending && $.inArray('cutieLootCooldown', value, 3) > 2) {
                valid = false;
                output.invalidLoot.push(value);
              }

              if(valid) {
                output.validLoot.push(value);

                // This gets the current index + 1
                return output.validLoot.length;
              } else {
                return false;
              }
            });

            if(cutieLootCooldownPending) {
              output.refreshTime = cutie.cutieLootCooldown();
            }

            cc.menu.state(output);
          });
        } else {
          cc.menu.restate();
        }
      });
    }
  };

  menu.open = function(open) {
    if(open === false) {
      return false;
    }
  }

  menu.exit = function(script) {
    return leaveOk;
  }

  menu.tick = function(now) {
    var refreshTime = cc.menu.state().refreshTime;
    if(refreshTime && refreshTime <= now) {
      leave('loot', {loot: cc.menu.state().loot});
    }
  }

  menu.stateChanged = function(state) {
    if(state.suppress || !$.isFunction(buttonTemplate) || !state.displayLoot || looting) {
      return;
    }

    // Shuffle loots
    cc.util.shuffle(state.displayLoot);
    cc.util.shuffle(state.validLoot);
    cc.util.shuffle(state.invalidLoot);

    cc.cuties.m(function(cutie) {
      var cutieLootCooldownTime = cutie.cutieLootCooldown();
      var cutieLootCooldownPending = cutieLootCooldownTime > $.now();

      // Add each loot to loot-wrap
      var invalidIndex = 0;
      $.each(state.displayLoot, function(index, value) {
        var buttonElement = buttonTemplate();
        if(!value) {
          var invalidItem = state.invalidLoot[invalidIndex];

          buttonElement.prop('disabled', true);
          buttonElement.addClass('invalid');

          // Why is it invalid?
          var invalidElement = buttonElement.find('.card-invalid');

          if(cutieLootCooldownPending && $.inArray('cutieLootCooldown', invalidItem, 3) > 2) {
            // cutieLootCooldown
            var cooldownCountdown = $('<div class="cv-countdown countdown" data-direction="down"></div>');
            cooldownCountdown.attr('data-time', cutieLootCooldownTime);
            invalidElement.append(cooldownCountdown);
          }

          invalidIndex++;
        }
        $('#menu-loot-wrap').append(buttonElement);
      });
    })
  }

  function buttonClick(ev) {
    if(looting) {
      return;
    } else {
      looting = true;
    }

    // Get loot
    var stateR = cc.menu.state();
    var validLoot = stateR.validLoot;
    var invalidLoot = stateR.invalidLoot;
    var displayLoot = stateR.displayLoot;

    // Disable buttons and get index of button
    var buttons = $('.menu-loot-button');
    var thisElement = $(this);
    buttons.addClass('not-chosen');
    thisElement.removeClass('not-chosen').addClass('chosen');
    buttons.prop('disabled', true);
    var index = buttons.index(thisElement);

    // Pick and perform loot
    cc.util.shuffle(validLoot);
    cc.util.shuffle(invalidLoot);
    var looted = validLoot[displayLoot[index] - 1];
    stateR.write('showcase', cc.loot(looted[1], looted[2]));

    // Need special actions?
    if($.inArray('cutieLootCooldown', looted, 3) > 2) {
      // Set cooldown to 23 hours
      cc.cuties.m(function(cutie) {
        cutie.cutieLootCooldown($.now() + 82800000);
      })
    }

    // Start looted animation
    var animateIndex = 0;
    var invalidIndex = 0;
    var interval = setInterval(function() {
      if(animateIndex == displayLoot.length) {
        // Animate clicked card
        buttons.eq(index).find('.card-front').html(looted[0]);
        buttons.eq(index).addClass('revealed');

        animateIndex++;
      } else if(animateIndex == displayLoot.length + 1) {
        // Exit loot screen
        clearInterval(interval);

        var exitEffectElement = $('#menu-loot-exit-effect');
        var target = thisElement.offset();
        var targetX = target.left + (thisElement.width() / 2);
        var targetY = target.top + (thisElement.height() / 2);
        var movementX = -(targetX - $(window).scrollLeft() - ($(window).width() / 2));
        var movementY = -(targetY - $(window).scrollTop() - ($(window).height() / 2));
        var offset = exitEffectElement.offset();
        var offsetX = targetX - offset.left;
        var offsetY = targetY - offset.top;
        exitEffectElement.css({
          'opacity': 0,
          'transform-origin': offsetX + 'px ' + offsetY + 'px',
          'transform': 'translate(' + movementX + 'px, ' + movementY + 'px) scale(16)'
        });
        setTimeout(function() {
          leave('showcase', stateR.showcase);
        }, 350);

      } else {
        if(animateIndex == index) {
          if(animateIndex == displayLoot.length - 1) {
            // Special case - player clicked on last card
            buttons.eq(animateIndex).find('.card-front').html(looted[0]);
            buttons.eq(animateIndex).addClass('revealed');
            animateIndex += 2;
            return;
          } else {
            animateIndex++;
          }
        }

        var currentIndex = displayLoot[animateIndex];
        if(currentIndex) {
          // Valid loot
          buttons.eq(animateIndex).find('.card-front').html(validLoot[currentIndex - 1][0]);
        } else {
          // Invalid loot
          buttons.eq(animateIndex).find('.card-front').html(invalidLoot[invalidIndex][0]);
          invalidIndex++;
        }
        buttons.eq(animateIndex).addClass('revealed');
        animateIndex++;
      }
    }, 500);
  }
}();
