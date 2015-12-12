!function() {
  var lastListUpdate, lastMode;
  var cutieTemplate = function() {
    return $();
  }
  var backButtonTemplate = cutieTemplate;

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
              // Delete them all
              var cutieIndex;
              // While there's still more cuties to delete
              // Fetch cutie while checking
              while($.type(cutieIndex = cc.cuties.selection('menu').shift()) !== 'undefined') {
                if(cutieIndex === m || cutieIndex === l || cutieIndex === r) {
                  // Prevent equipped cuties from being deleted
                  continue;
                }

                cc.cuties.remove(cutieIndex);
              }
              // Refresh state
              cc.menu.restate();
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
          // Can't select more than 16 people
          if(cc.cuties.selection('menu').length > 15) {
            return;
          }
          // Can't select equipped people
          // Positions 0, 1, or 2
          var slot = cutie.slot();
          if(slot > -1 && slot < 3) {
            return;
          }
          // Can't select favorited cuties
          if(cutie.selected('favorite') > -1) {
            return;
          }
          cutie.select('menu');
        break;

        case 'equip':
          cc.cuties.selection('menu').write(0, cutie.index());
        break;
      }
    } else {
      // View state
      cutie.select('favorite');
    }
  }

  menu.draw = function(now) {
    // Update cutie card displays
    $('.menu-cuties-list-button').each(function(index, element) {
      var cutieElement = $(element);
      var cutie = cutieElement.data('cutie');

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
      var infoOne = (function() {
        return '<span class="cs cs-love"></span> ' + cutie.love();
      })();
      if(cutieElement.find('.info-1').html() != infoOne) {
        cutieElement.find('.info-1').html(infoOne);
      }
      var infoTwo = (function() {
        return '<span class="cs cs-excitement"></span> ' + cutie.targetxp();
      })();
      if(cutieElement.find('.info-2').html() != infoTwo) {
        cutieElement.find('.info-2').html(infoTwo);
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
}();
