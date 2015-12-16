!function() {
  var lastListUpdate, lastMode;
  var cutieTemplate = function() {
    return $();
  }
  var backButtonTemplate = cutieTemplate;
  var buttonAlertTemplate = cutieTemplate;

  var script = 'cuties', dir = 'menu/' + script + '/',
  menu = cc.menu[script] = function(element, state) {
    cc.util.getcss(dir + 'menu.css');
    element.load(cc.util.l(dir + 'menu.html'), function() {
      // Create a template cutie card
      var cutieOriginal = element.find('.menu-cuties-list-button').remove();
      cutieTemplate = function() {
        return cutieOriginal.clone();
      }

      // Create template back button
      var backButtonOriginal = element.find('#menu-cuties-pane-back').remove();
      backButtonTemplate = function() {
        return backButtonOriginal.clone();
      }

      // Create button alert template
      var buttonAlertOriginal = element.find('.menu-cuties-button-alert').remove();
      buttonAlertTemplate = function() {
        return buttonAlertOriginal.clone();
      }

      // Register handlers
      element.find('#menu-cuties-main').on('click.card-button-click', '.menu-cuties-list-button', cutieButtonClick);

      // Reset local state variables
      lastListUpdate = 0;
      lastMode = '';

      // Launch state change
      cc.menu.restate();
    });
  };

  menu.stateChanged = function(state) {
    var mode = state.mode || 'view';
    // Remove old wrapper classes and add new state in
    $('#menu-cuties-wrap').removeClass().addClass('menu-cuties-mode-' + (state.mode || 'view'));

    // Update list
    listUpdate(state);

    // Update pane only if we need to change it.
    if(lastMode != mode) {
      paneChange(state);
      lastMode = mode;
    }

    // Mode actually changed
    var lastDataMode = state.lastMode || '';
    if(lastDataMode != mode) {
      // Clear selections
      cc.cuties.selection('menu', true);

      // Clear substate
      state.substate = {};

      state.lastMode = mode;
    }

    // Process substate
    substateProcess(state);
  }

  function paneChange(state) {
    var paneElement = $('#menu-cuties-pane');
    if(paneElement.length < 1) {
      // Pane doesn't exist for some reason.
      return;
    }

    // Load in new pane
    cc.util.getcss(dir + (state.mode || 'view') + '/pane.css');
    paneElement.load(cc.util.l(dir + (state.mode || 'view') + '/pane.html'), function() {
      if(state.mode && state.mode != 'view') {
        // Need back button
        paneElement.prepend(backButtonTemplate());

        switch(state.mode) {
          case 'delete':
            // Register button handler
            $('#menu-cuties-pane-action-button').click(function() {
              // Get slots of currently equipped cuties
              var m = cc.cuties.m();
              var l = cc.cuties.l();
              var r = cc.cuties.r();

              // Copy selection to another array
              var toDelete = $.map(cc.cuties.selection('menu'), function(value, index) {
                if(value === m || value === l || value === r) {
                  // Prevent equipped cuties from being deleted
                  return;
                } else {
                  return value;
                }
              });

              // Sort numerically, descending
              toDelete.sort(function(a, b) {
                return b - a;
              });

              // Clear selection
              cc.cuties.selection('menu', true);

              // Award empathy
              var empathyDefer = [];
              $.each(toDelete, function(index, value) {
                var defer = $.Deferred();
                empathyDefer.push(defer);
                cc.cuties(value, function(cutie) {
                  cc.stats.empathy(cutie.value());
                  defer.resolve();
                });
              });
              $.when.apply($, empathyDefer).done(function() {
                // Delete them
                $.each(toDelete, function(index, value) {
                  cc.cuties.remove(value);
                });

                // Refresh menu
                cc.menu.restate();
              });
            });
          break;

          case 'equip':
            // Load in current slots if necessary
            var selection = cc.cuties.selection('menu');
            if($.type(selection[0]) !== 'number') {
              selection.write(0, cc.cuties.m());
              selection.write(1, cc.cuties.l());
              selection.write(2, cc.cuties.r());
            }

            // Set up substate buttons
            $('#menu-cuties-equip-left').click(function() {
              cc.menu.state({substate: {equipping: 1}});
            });
            $('#menu-cuties-equip-mid').click(function() {
              cc.menu.state({substate: {equipping: 0}});
            });
            $('#menu-cuties-equip-right').click(function() {
              cc.menu.state({substate: {equipping: 2}});
            });

            // Equip effect timeout
            var equipEffectTimeout;

            $('#menu-cuties-pane-action-button').click(function() {
              var selection = cc.cuties.selection('menu');

              var oldM = cc.cuties.m();
              var oldL = cc.cuties.l();
              var oldR = cc.cuties.r();

              // Set cuties
              cc.cuties.m(selection[0]);

              // Grab all three cuties
              var deferM = $.Deferred();
              var deferL = $.Deferred();
              var deferR = $.Deferred();
              var cutieM, cutieL, cutieR, isL, isR;

              if($.type(selection[0]) === 'number') {
                cc.cuties(selection[0], function(cutie) {
                  cutieM = cutie;
                  deferM.resolve();
                });
              } else {
                // M cutie should be set. Something is wrong.
                return;
              }
              if($.type(selection[1]) === 'number') {
                cc.cuties(selection[1], function(cutie) {
                  isL = true;
                  cutieL = cutie;
                  deferL.resolve();
                });
              } else {
                cutieL = false;
                deferL.resolve();
              }
              if($.type(selection[2]) === 'number') {
                cc.cuties(selection[2], function(cutie) {
                  isR = true;
                  cutieR = cutie;
                  deferR.resolve();
                });
              } else {
                cutieR = false;
                deferR.resolve();
              }

              $.when(deferM, deferL, deferR).done(function() {
                // Left cutie first
                if(isL) {
                  // Check ecchi
                  if(cutieL.isEcchi()) {
                    // Check index overlap
                    if(cutieL.index() != cutieM.index()) {
                      // Check type overlap
                      if(cutieL.cutie != cutieM.cutie) {
                        // Set cutie
                        cc.cuties.l(selection[1]);
                      }
                    }
                  }
                } else {
                  cc.cuties.l(null);
                }

                // Now right cutie
                if(isR) {
                  if(cutieR.isEcchi()) {
                    if(cutieR.index() != cutieM.index() && (!isL || cutieR.index() != cutieL.index())) {
                      if(cutieR.cutie != cutieM.cutie && (!isL || cutieR.cutie != cutieL.cutie)) {
                        cc.cuties.r(selection[2]);
                      }
                    }
                  }
                } else {
                  cc.cuties.r(null);
                }

                // Check for differences
                if(cc.cuties.m() != oldM || cc.cuties.l() != oldL || cc.cuties.r() != oldR) {
                  // Equip cutie bar effect
                  var cutieBar = $('#cutie-bar');
                  cutieBar.removeClass('menu-cuties-mode-equip-changed-animate');
                  cutieBar[0].offsetHeight;
                  cutieBar.addClass('menu-cuties-mode-equip-changed-animate');
                  clearTimeout(equipEffectTimeout);
                  equipEffectTimeout = setTimeout(function() {
                    cutieBar.removeClass('menu-cuties-mode-equip-changed-animate');
                  }, 300);
                }

                // Refresh state
                cc.menu.restate();
              });
            });
          break;

          case 'gift':
            // Clear giftee button
            $('#menu-cuties-pane-giftee').click(function() {
              cc.cuties.selection('menu', true);
              cc.menu.state({substate: {gifting: false}})
            });

            // This was copied off of delete and modified to fit
            $('#menu-cuties-pane-action-button').click(function() {
              // Get slots of currently equipped cuties
              var m = cc.cuties.m();
              var l = cc.cuties.l();
              var r = cc.cuties.r();

              // Copy selection to another array
              var giftee;
              var toDelete = $.map(cc.cuties.selection('menu'), function(value, index) {
                if(index === 0) {
                  // This is our giftee
                  giftee = value;
                  return;
                } else if(value === m || value === l || value === r) {
                  // Prevent equipped cuties from being deleted
                  return;
                } else {
                  return value;
                }
              });

              // Sort numerically, descending
              toDelete.sort(function(a, b) {
                return b - a;
              });

              // Clear selection, but keep giftee
              cc.cuties.selection('menu', [giftee]);

              // Enter giftee
              var leader = $.Deferred();
              var ecchiDefer = [leader];

              cc.cuties(giftee, function(gifteeCutie) {
                // Award ecchi
                $.each(toDelete, function(index, value) {
                  var defer = $.Deferred();
                  ecchiDefer.push(defer);
                  cc.cuties(value, function(cutie) {
                    gifteeCutie.ecchi(cutie.ecchiValue());
                    defer.resolve();
                  });
                });

                leader.resolve();
              })

              $.when.apply($, ecchiDefer).done(function() {
                // Delete them
                $.each(toDelete, function(index, value) {
                  cc.cuties.remove(value);
                });

                // Refresh menu
                cc.menu.restate();
              });
            });
          break;
        }

        // Process substate (again)
        substateProcess(state);
      }
    });
  }

  // This gets called a ton of times!
  function substateProcess(state) {
    switch(state.mode) {
      case 'equip':
        var buttons = $('#menu-cuties-equip-buttons');
        switch(state.substate.equipping) {
          default:
          case 0:
            buttons.removeClass().addClass('equip-mid');
          break;

          case 1:
            buttons.removeClass().addClass('equip-left');
          break;

          case 2:
            buttons.removeClass().addClass('equip-right');
          break;
        }
      break;

      case 'gift':
        var gifteeElement = $('#menu-cuties-pane-giftee');

        if(gifteeElement.length < 1) {
          return;
        }

        // Load giftee
        if(state.substate.gifting) {
          cc.cuties(cc.cuties.selection('menu')[0], function(cutie) {
            gifteeElement.prop('disabled', false);
            cutie.renderCutieCard('#menu-cuties-pane-giftee-card');
          });
        } else {
          $('#menu-cuties-pane-giftee').prop('disabled', true);
          gifteeElement.find('.countdown').removeClass('cv-countdown');
          cc.cuties.clearCutieCard('#menu-cuties-pane-giftee-card');
        }
      break;
    }
  }

  function listUpdate(state) {
    if(lastListUpdate == cc.cuties.listTime) {
      return;
    } else {
      lastListUpdate = cc.cuties.listTime;
    }

    var oldListElement = $('#menu-cuties-list');
    if(oldListElement.length < 1) {
      // List doesn't exist for some reason.
      lastListUpdate = 0;
      return;
    }

    var listElement = $('<div id="menu-cuties-list">');

    var cutieDeferreds = [];
    var cutiesList = cc.cuties.list();
    $.each(cutiesList, function(index, value) {
      // This allows waiting for all cuties to finish
      var defer = $.Deferred();
      cutieDeferreds.push(defer);

      cc.cuties(index, function(cutie) {
        var cutieElement = cutieTemplate();
        cutie.renderCutieCard(cutieElement, 'menu-cuties-list-button');

        // Store cutie object on cutieElement
        cutieElement.data('cutie', cutie);

        cutieElement.appendTo(listElement);

        defer.resolve();
      });
    });

    $.when.apply($, cutieDeferreds).then(function() {
      // All cuties are done
      oldListElement.replaceWith(listElement);
    });
  }

  function cutieButtonClick(ev) {
    var cutieElement = $(this);
    var cutie = cutieElement.data('cutie');
    // Adding a R here to remind myself that this is a Rhaboo state object
    var stateR = cc.menu.state();

    if(stateR.mode && stateR.mode != 'view') {
      switch(stateR.mode) {
        case 'delete':
          // Can't select more than 16 cards
          // (It's fine AT 15 cards, but not more than that)
          if(cc.cuties.selection('menu').length > 15 && cutie.selected('menu') < 0) {
            alertifyButton(cutieElement, '<span class="fa fa-hashtag"></span>', '#000', '#ff7f00');
            return;
          }

          if(!deleteClickChecks(cutieElement, cutie)) {
            return;
          }

          cutie.select('menu');
          if(cutie.selected('menu') > -1) {
            alertifyButton(cutieElement, '<span class="fa fa-trash"></span>', '#ff7f00', '#fff');
          }
        break;

        case 'equip':
          var selection = cc.cuties.selection('menu'), slot, old, slot1, old1, cutie1, slot2, old2, cutie2, color, color1, color2;
          switch(stateR.substate.equipping) {
            default:
            case 0:
              slot = 0;
              old = selection[0];
              color = '#007fff';
              slot1 = 1;
              old1 = selection[1];
              color1 = '#7f00ff';
              slot2 = 2;
              old2 = selection[2];
              color2 = '#00ff7f';

              if(cutie.index() == old) {
                // Can't unequip middle cutie
                return;
              }
            break;

            case 1:
              slot = 1;
              old = selection[1];
              color = '#7f00ff';
              slot1 = 0;
              old1 = selection[0];
              color1 = '#007fff';
              slot2 = 2;
              old2 = selection[2];
              color2 = '#00ff7f';
            break;

            case 2:
              slot = 2;
              old = selection[2];
              color = '#00ff7f';
              slot1 = 0;
              old1 = selection[0];
              color1 = '#007fff';
              slot2 = 1;
              old2 = selection[1];
              color2 = '#7f00ff';
            break;
          }

          if(cutie.index() == old) {
            // Just toggle off slot
            selection.write(slot, null);
            return;
          }

          var is1 = $.type(old1) === 'number';
          var is2 = $.type(old2) === 'number';

          // Load other cuties
          var defer1 = $.Deferred();
          var defer2 = $.Deferred();

          if(is1) {
            cc.cuties(old1, function(cutie) {
              cutie1 = cutie;
              defer1.resolve();
            });
          } else {
            defer1.resolve();
          }

          if(is2) {
            cc.cuties(old2, function(cutie) {
              cutie2 = cutie;
              defer2.resolve();
            });
          } else {
            defer2.resolve();
          }

          $.when(defer1, defer2).done(function() {
            if(is1 && cutie.index() == old1) {
              // Swap with old1
              // If there's a 0, it'd be this slot
              if(slot1 === 0 && $.type(old) !== 'number') {
                alertifyButton(cutieElement, '<span class="fa fa-street-view"></span>', '#000', color1);
                return;
              }
              selection.write(slot1, old);
              selection.write(slot, old1);
              alertifyButton(cutieElement, '<span class="fa fa-street-view"></span>', color, '#fff');
              return;
            } else if(is2 && cutie.index() == old2) {
              // Swap with old2
              selection.write(slot2, old);
              selection.write(slot, old2);
              alertifyButton(cutieElement, '<span class="fa fa-street-view"></span>', color, '#fff');
              return;
            }

            if(is1 && cutie.cutie == cutie1.cutie) {
              // Blocked by cutie 1
              alertifyButton(cutieElement, '<span class="fa fa-street-view"></span>', '#000', color1);
              return
            } else if(is2 && cutie.cutie == cutie2.cutie) {
              // Blocked by cutie 2
              alertifyButton(cutieElement, '<span class="fa fa-street-view"></span>', '#000', color2);
              return
            }

            // Ecchi check last (don't encourage people to get ecchi if what they wanted doesn't work)
            if(slot !== 0 && !cutie.isEcchi()) {
              alertifyButton(cutieElement, '<span class="fa fa-gift"></span>', '#000', '#ff007f');
              return;
            }

            // It's fine!
            alertifyButton(cutieElement, '<span class="fa fa-street-view"></span>', color, '#fff');
            selection.write(slot, cutie.index());
          });
        break;

        case 'gift':
          if(stateR.substate.gifting) {
            if(cutie.selected('menu') === 0) {
              // No selecting giftee
              alertifyButton(cutieElement, '<span class="fa fa-birthday-cake"></span>', '#000', '#ff007f');
              return
            }

            // Can't select more than 16 cards
            // (It's fine AT 15 cards, but not more than that)
            // Note that giftee is #0, so we need to add one
            if(cc.cuties.selection('menu').length > 16 && cutie.selected('menu') < 0) {
              alertifyButton(cutieElement, '<span class="fa fa-hashtag"></span>', '#000', '#ff7f00');
              return;
            }

            if(!deleteClickChecks(cutieElement, cutie)) {
              return;
            }

            // Can't select lv 0 cuties
            if(cutie.love() == 0) {
              alertifyButton(cutieElement, '<span class="fa fa-heart-o"></span>', '#000', '#ffcc00');
              return;
            }

            cutie.select('menu');
            if(cutie.selected('menu') > -1) {
              alertifyButton(cutieElement, '<span class="fa fa-gift"></span>', '#ff7f00', '#fff');
            }
          } else {
            cc.cuties.selection('menu').write(0, cutie.index());
            alertifyButton(cutieElement, '<span class="fa fa-birthday-cake"></span>', '#ff007f', '#fff');

            // Update state
            cc.menu.state({substate: {gifting: true}});
          }
        break;
      }
    } else {
      // View state
      cutie.select('favorite');
      if(cutie.selected('favorite') > -1) {
        alertifyButton(cutieElement, '<span class="fa fa-star"></span>', '#ffcc00', '#fff');
      }
    }
  }

  // Since gifting and delete both delete cuties, check to see if deleting is allowed in a common function
  function deleteClickChecks(cutieElement, cutie) {
    // Can't select equipped cards
    // Positions 0, 1, or 2
    var slot = cutie.slot();
    if(slot > -1 && slot < 3) {
      switch(slot) {
        case 0:
          alertifyButton(cutieElement, '<span class="fa fa-street-view"></span>', '#000', '#007fff');
        break;
        case 1:
          alertifyButton(cutieElement, '<span class="fa fa-street-view"></span>', '#000', '#7f00ff');
        break;
        case 2:
          alertifyButton(cutieElement, '<span class="fa fa-street-view"></span>', '#000', '#00ff7f');
        break;
      }
      return;
    }
    // Can't select favorited cards
    if(cutie.selected('favorite') > -1) {
      alertifyButton(cutieElement, '<span class="fa fa-star"></span>', '#000', '#ffcc00');
      return;
    }

    return true;
  }

  menu.draw = function(now) {
    // Update cutie card displays
    $('.menu-cuties-list-button').each(function(index, element) {
      var cutieElement = $(element);
      var cutie = cutieElement.data('cutie');

      var stateR = cc.menu.state();

      // Sorting stuff
      var sortIndex = cutie.index();
      var lastIndex = cutieElement.data('lastIndex');
      if(sortIndex !== lastIndex) {
        cutieElement.css('order', sortIndex);
        cutieElement.find('.sort-data').html(function() {
          return '# ' + (sortIndex + 1);
        });
        cutieElement.data('lastIndex', sortIndex);
      }

      // Info display stuff
      switch(stateR.mode) {
        default:
          var infoOne = '<span class="cs cs-love"></span> ' + cutie.love();
          if(cutieElement.find('.info-1').html() != infoOne) {
            cutieElement.find('.info-1').html(infoOne);
          }
          var infoTwo = '<span class="cs cs-excitement"></span> ' + cutie.targetxp();
          if(cutieElement.find('.info-2').html() != infoTwo) {
            cutieElement.find('.info-2').html(infoTwo);
          }
        break;

        case 'delete':
          var infoOne = '<span class="cs cs-love"></span> ' + cutie.love();
          if(cutieElement.find('.info-1').html() != infoOne) {
            cutieElement.find('.info-1').html(infoOne);
          }

          var infoTwo = '<span class="cs cs-empathy"></span> +' + cutie.value();
          if(cutieElement.find('.info-2').html() != infoTwo) {
            cutieElement.find('.info-2').html(infoTwo);
          }
        break;

        case 'equip':
          var infoOne = '<span class="cs cs-love"></span> ' + cutie.love();
          if(cutieElement.find('.info-1').html() != infoOne) {
            cutieElement.find('.info-1').html(infoOne);
          }

          if(stateR.substate.equipping > 0) {
            var ecchiTime = cutie.ecchi();
            var infoTwo = '<span class="cs cs-ecchi"></span> <span class="cv-countdown" data-direction="down" data-time="' + ecchiTime + '" data-after=\'<span class="fa fa-times-circle"></span>\'></span>';
            var infoTwoRegex = new RegExp('data-time="' + ecchiTime + '"');
            if(cutieElement.find('.info-2').html().search(infoTwoRegex) < 0) {
              cutieElement.find('.info-2').html(infoTwo);
            }
          } else {
            var cooldown = String(cutie.cutieLootCooldown());
            var infoTwo = '<span class="fa fa-user-plus"></span> <span class="cv-countdown" data-direction="down" data-time="' + cooldown + '" data-after=\'<span class="fa fa-check-circle-o"></span>\'></span>';
            var infoTwoRegex = new RegExp('data-time="' + cooldown + '"');
            if(cutieElement.find('.info-2').html().search(infoTwoRegex) < 0) {
              cutieElement.find('.info-2').html(infoTwo);
            }
          }

          // Remove selection if cutie isn't ecchi
          if(!cutie.isEcchi() && cutie.selected('menu') > 0) {
            cutie.select('menu');
          }
        break;

        case 'gift':
          if(stateR.substate.gifting) {
            var infoOne = '<span class="cs cs-love"></span> ' + cutie.love();
            if(cutieElement.find('.info-1').html() != infoOne) {
              cutieElement.find('.info-1').html(infoOne);
            }

            if(cutie.selected('menu') == 0) {
              var infoTwo = '<span class="fa fa-birthday-cake"></span>';

              // While we're here, update cutie info in pane
              var ecchiValue = $('#menu-cuties-pane-giftee-ecchi .countdown')
              ecchiValue.attr({
                'data-time': cutie.ecchi(),
                'data-direction': 'down',
                'data-after': '0'
              }).addClass('cv-countdown');
            } else {
              var infoTwo = '<span class="cs cs-ecchi"></span> +' + cc.util.timeString(cutie.ecchiValue());
            }
            if(cutieElement.find('.info-2').html() != infoTwo) {
              cutieElement.find('.info-2').html(infoTwo);
            }
          } else {
            var infoOne = '<span class="cs cs-love"></span> ' + cutie.love();
            if(cutieElement.find('.info-1').html() != infoOne) {
              cutieElement.find('.info-1').html(infoOne);
            }

            var ecchiTime = cutie.ecchi();
            var infoTwo = '<span class="cs cs-ecchi"></span> <span class="cv-countdown" data-direction="down" data-time="' + ecchiTime + '" data-after=\'0\'></span>';
            var infoTwoRegex = new RegExp('data-time="' + ecchiTime + '"');
            if(cutieElement.find('.info-2').html().search(infoTwoRegex) < 0) {
              cutieElement.find('.info-2').html(infoTwo);
            }
          }
        break;
      }

      // Selection stuff
      var selectionIndex = cutie.selected('menu');
      var selected = selectionIndex > -1;
      var lastSelected = cutieElement.data('selected');
      if(selectionIndex !== lastSelected) {
        if(selected) {
          cutieElement.find('.selection-wrapper').removeClass('selected-' + lastSelected).addClass('selected selected-' + selectionIndex);
        } else {
          cutieElement.find('.selection-wrapper').removeClass('selected selected-' + lastSelected);
        }
        cutieElement.data('selected', selectionIndex);
      }

      // Favorite stuff (copied from above)
      selectionIndex = cutie.selected('favorite');
      selected = selectionIndex > -1;
      lastSelected = cutieElement.data('favorite');
      if(selectionIndex !== lastSelected) {
        if(selected) {
          cutieElement.find('.fav-wrapper').removeClass('favorite-' + lastSelected).addClass('favorite favorite-' + selectionIndex);
        } else {
          cutieElement.find('.fav-wrapper').removeClass('favorite favorite-' + lastSelected);
        }
        cutieElement.data('favorite', selectionIndex);
      }
    });
  };

  function alertifyButton(button, text, background, foreground) {
    text = text || '';
    background = background || '#000';
    foreground = foreground || '#fff';

    var element = $(button);
    var alert = buttonAlertTemplate();

    alert.find('.color-square, .color-circle').css('background', background);
    alert.find('.alert-text').css('color', foreground).html(text);

    alert.appendTo(element);
    alert[0].offsetHeight;
    alert.addClass('go');

    setTimeout(function() {
      alert.remove();
    }, 1000);
  }
}();
