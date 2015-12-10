// Handles the menu

!function() {
  // Initialize menu data
  var data = cc.ls.d.menu || cc.ls.d.write('menu', {}).menu;

  // Menu opening
  $('#cutie-bar-m').click(function() {
    // Nice and simple
    cc.menu.open();
  }).on('mousedown touchstart', function(ev) {
    if(cc.burstReady && !cc.burstStart && !cc.ls.d.preBurst) {
      ev.preventDefault();

      // Immediately trigger effect.
      $('html').addClass('burst-pre');

      // Burst if burst is ready
      cc.burstStart = true;
    }
  });

  // Set up a thing to scroll back to initial menu position on load
  var scrollBackTimeout;
  var scrollAttempts = 10; // 1 second
  function scrollToSaved() {
    if(data.active) {
      $(window).scrollTop(scrollData().top);
      if(Math.abs($(window).scrollTop() - scrollData().top) > 1) {
        // We're not within 1px of our target location.
        if(scrollAttempts > 0) {
          scrollAttempts--;
          scrollBackTimeout = setTimeout(scrollToSaved, 100);
          return;
        }
      }
    }
    scrollBackTimeout = false;
    scrollAttempts = 10;
  }

  // Set up a function to scroll to top
  // affectSave defaults to true.
  function scrollToDefault(affectSave) {
    if(scrollBackTimeout) {
      clearTimeout(scrollBackTimeout);
      scrollBackTimeout = false;
    }

    if(affectSave !== false) {
      cc.util.rhanum(data, 'scrolltop', '0');
    }

    if(data.active) {
      $(window).scrollTop(0);
    }
  }

  // Update class with variable
  cc.loop.tick(function() {
    if(data.active) {
      if(cc.burstReady && !cc.burstStart && !cc.ls.d.preBurst) {
        // Burst if burst is ready
        cc.burstStart = true;
      } else if(cc.ls.d.burst || cc.ls.d.preBurst || cc.burstStart) {
        // If burst mode is active, deactivate menu
        cc.menu.open(false, true);
        $(window).scrollTop(0);
        $('html').removeClass('menu-active');
      } else if(!$('html').hasClass('menu-active')) {
        // Burst mode isn't active, but menu isn't open for some reason.
        scrollBackTimeout = setTimeout(scrollToSaved, 100);
        $('html').addClass('menu-active');
      }
    } else {
      if($('html').hasClass('menu-active')) {
        // Menu shouldn't be active.
        $(window).scrollTop(0);
        $('html').removeClass('menu-active');
      }
    }
  });

  // Forward clicks on middle of top bar to cutie card
  $('#menu-close-button').click(function() {
    if(data.active) {
      // This doesn't prevent default, so be sure to check for the menu being active!
      $('#cutie-bar-m').click();
    }
  }).on('mousedown touchstart', function(ev) {
    ev.preventDefault();

    // Fake a click on cutie-bar-m
    $('#cutie-bar-m').addClass('fake-click');

    // Have to detect if player releases mouse anywhere.
    // Still doesn't work if they release it ouside of window
    $('html').one('mouseup touchend', function(ev) {
      ev.preventDefault();
      $('#cutie-bar-m').removeClass('fake-click');

      // But this doesn't click if player released mouse over cutie-bar-m, so fix that.
      if($('#cutie-bar-m').is(ev.target)) {
        $('#cutie-bar-m').click();
      }
    });
  });

  // Scroll data fetcher. Only top for now!
  function scrollData(top) {
    if(top) {
      cc.util.rhanum(data, 'scrolltop', top);
    }

    return {
      top: cc.util.rhanum(data, 'scrolltop') ||  cc.util.rhanum(data, 'scrolltop', '0')
    }
  }

  // Scroll handler!
  $(window).scroll(function(ev) {
    if(data.active) {
      // Save scroll position (only if we're not currently scrolling to a saved location)
      if(!scrollBackTimeout) {
        cc.util.rhanum(data, 'scrolltop', String($(window).scrollTop()));
      }
    }
  });

  // Menu switcher
  // Based off of cutie function
  cc.menu = function(scriptname, state) {
    if($.type(scriptname) === 'undefined' && $.type(data.script) !== 'undefined') {
      // Keep current script
      scriptname = data.script;
      state = data.state;
      var noscroll = true;
    } else if($.type(scriptname) === 'undefined') {
      // No script name defined, so set it to default
      scriptname = 'home';
      state = state || {};
    } else {
      // Script name is defined, but make sure state is too.
      state = state || {};
    }

    if(callOnMenu('exit', [scriptname, state]) === false) {
      return;
    }

    function afterLoad() {
      // Create a new menu-content
      var menuContent = $('#menu-content');
      var futureContent = $('<div id="menu-content">');

      // First run its init function
      // Pass in the new state
      if(cc.menu[scriptname](futureContent, state) === false) {
        // New menu doesn't wannya switch in
        return;
      }

      // Empty out content and state
      menuContent.empty();
      data.write('state', {});

      // Remove menu state class
      $('html').removeClass('menu-script-' + data.script);

      // Scroll to top
      if(!noscroll) {
        scrollToDefault();
      }

      // Set current menu and its class
      data.write('script', scriptname);
      $('html').addClass('menu-script-' + scriptname);

      // Then replace content and set state
      menuContent.replaceWith(futureContent);
      cc.menu.state(state);
    }

    if($.type(cc.menu[scriptname]) !== 'undefined') {
      // It's already loaded.
      afterLoad();
    } else {
      // It hasn't loaded yet, so get it loaded.
      cc.getScript('menu/' + scriptname + '/menu.js').done(afterLoad);
    }
  }

  // Calls a function on current menu if it exists (does nothing if it doesn't)
  function callOnMenu(func, args) {
    if($.type(cc.menu[data.script]) !== 'undefined') {
      if($.isFunction(cc.menu[data.script][func])) {
        return cc.menu[data.script][func].apply(cc.menu[data.script], args);
      }
    }
  }

  // Make some variables available for scripts
  // These are functions so that they can update
  cc.menu.script = function(newScript) {
    if(newScript) {
      cc.menu(newScript);
    }

    return data.script;
  }
  cc.menu.state = function(newState) {
    if(newState) {
      replacementState = $.extend({}, data.state, newState);

      // Look through state and remove anything that's null or undefined.
      var removeKeys = [];
      $.each(replacementState, function(key, value) {
        var type = $.type(value);
        if(type === 'null' || type === 'undefined') {
          removeKeys.push(key);
        }
      });
      $.each(removeKeys, function(index, value) {
        delete replacementState[value];
      });

      // Interesting note: stateChanged gets a normal object that's used to update Rhaboo, not a Rhaboo object.
      if(callOnMenu('stateChanged', [replacementState]) !== false) {
        data.write('state', replacementState);
      }
    }

    return data.state;
  }
  // Let state handle what to pass stateChanged
  cc.menu.restate = function() {
    cc.menu.state({});
  }

  // Easy to use function to open / close / toggle menu
  cc.menu.open = function(open, force) {
    if($.type(open) !== 'boolean') {
      open = !data.active;
    }
    // This ordering ensures that menuOpen is always called
    if(callOnMenu('open', [open, force]) !== false || force) {
      data.write('active', open);
    }
  }

  // Pass tasks, ticks, and draws to menu
  cc.loop.task(function(now) {
    if(data.active) {
      callOnMenu('task', [now, $('#menu-content'), data.state]);
    }
  });
  cc.loop.tick(function(now) {
    if(data.active) {
      callOnMenu('tick', [now, $('#menu-content'), data.state]);
    }
  });
  cc.loop.draw(function(now) {
    if(data.active) {
      callOnMenu('draw', [now, $('#menu-content'), data.state]);
    }
  });

  // Load menu right now
  cc.menu();

  // Menu buttons
  $('#menu-top-home').click(function() {
    cc.menu('home');
  });
  $('#menu-top-cuties').click(function() {
    cc.menu('cuties');
  });
  $('#menu-top-items').click(function() {
    cc.menu('items');
  });
  $('#menu-top-store').click(function() {
    cc.menu('store');
  });
  $('#menu-top-tbd').click(function() {
    cc.menu('tbd');
  });
  $('#menu-top-misc').click(function() {
    cc.menu('misc');
  });

  // Menu links
  $('#menu').on('click.menu-link', "a", function(ev) {
    var destination = $(this).attr('href');
    if(destination.search(/^\$/) != -1) {
      // Menu link (starts with $)
      ev.preventDefault();

      var newScript = destination.slice(1);
      var newState = $(this).data('state');

      // Ensure newState is an object.
      if($.type(newState) !== 'object') {
        newState = {};
      }

      // This is true if destination isn't empty
      if(newScript) {
        cc.menu(newScript, newState);
      } else {
        cc.menu.state(newState);
      }
    } else {
      // Non-menu link

      // Only preventDefault for links that don't look like javascript things
      if(destination.search(/^(?:$|#|javascript:)/i) == -1) {
        ev.preventDefault();
        window.open(destination, '_blank');
      }
    }
  });
}();
