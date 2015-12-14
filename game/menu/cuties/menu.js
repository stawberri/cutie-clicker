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
    // Clear selections if necessary (based on lastMode)
    var lastDataMode = state.lastMode || '';
    if(lastDataMode != mode) {
      cc.cuties.selection('menu', true);
      state.lastMode = mode;
    }
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
            // Load in current slots
            var selection = cc.cuties.selection('menu');
            selection.write(0, cc.cuties.m());
            // selection.write(1, cc.cuties.l());
            // selection.write(2, cc.cuties.r());


            $('#menu-cuties-pane-action-button').click(function() {
              // Set cuties
              cc.cuties.m(selection[0]);
              // cc.cuties.l(selection[1]);
              // cc.cuties.r(selection[2]);

              $('#menu-cuties-temp-equip-confirm').html('Cutie card #' + (selection[0] + 1) + ' equipped.');

              // Refresh state
              cc.menu.restate();
            });
          break;
        }
      }
    });
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
          // Can't select equipped cards
          // Positions 0, 1, or 2
          var slot = cutie.slot();
          if(slot > -1 && slot < 3) {
            switch(slot) {
              case 0:
                alertifyButton(cutieElement, '<span class="fa fa-street-view"></span>', '#000', '#007fff');
              break;
            }
            return;
          }
          // Can't select favorited cards
          if(cutie.selected('favorite') > -1) {
            alertifyButton(cutieElement, '<span class="fa fa-star"></span>', '#000', '#ffcc00');
            return;
          }
          cutie.select('menu');
        break;

        case 'equip':
          cc.cuties.selection('menu').write(0, cutie.index());
        break;

        case 'gift':
          alertifyButton(cutieElement, '<span class="fa fa-hourglass-half"></span>', '#000', '#ff007f');
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

          var infoTwo = '<span class="cs cs-empathy"></span> ' + cutie.value();
          if(cutieElement.find('.info-2').html() != infoTwo) {
            cutieElement.find('.info-2').html(infoTwo);
          }
        break;

        case 'equip':
          var infoOne = '<span class="cs cs-love"></span> ' + cutie.love();
          if(cutieElement.find('.info-1').html() != infoOne) {
            cutieElement.find('.info-1').html(infoOne);
          }

          if(cutie.cutieLootCooldown() > now) {
            var cooldown = String(cutie.cutieLootCooldown());
            var infoTwo = '<span class="fa fa-user-plus"></span> <span class="cv-countdown" data-time="' + cooldown + '"></span>';
            var infoTwoRegex = new RegExp('class="cv-countdown" data-time="' + cooldown + '"');
            if(cutieElement.find('.info-2').html().search(infoTwoRegex) < 0) {
              cutieElement.find('.info-2').html(infoTwo);
            }
          } else {
            var infoTwo = '<span class="fa fa-user-plus"></span> <span class="fa fa-check-circle-o"></span>';
            if(cutieElement.find('.info-2').html() != infoTwo) {
              cutieElement.find('.info-2').html(infoTwo);
            }
          }
        break;
      }

      // Selection stuff
      var selectionIndex = cutie.selected('menu');
      var selected = selectionIndex > -1;
      var lastSelected = cutieElement.data('selected');
      if(selected !== lastSelected) {
        if(selected) {
          cutieElement.find('.selection-wrapper').addClass('selected selected-' + selectionIndex);
        } else {
          cutieElement.find('.selection-wrapper').removeClass().addClass('selection-wrapper');
        }
        cutieElement.data('selected', selected);
      }

      // Favorite stuff (copied from above)
      selectionIndex = cutie.selected('favorite');
      selected = selectionIndex > -1;
      lastSelected = cutieElement.data('favorite');
      if(selected !== lastSelected) {
        if(selected) {
          cutieElement.find('.fav-wrapper').addClass('favorite favorite-' + selectionIndex);
        } else {
          cutieElement.find('.fav-wrapper').removeClass().addClass('fav-wrapper');
        }
        cutieElement.data('favorite', selected);
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
