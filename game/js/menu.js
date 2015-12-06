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
  var scrollAttempts = 10;
  function scrollToSaved() {
    if(data.active) {
      $(window).scrollTop(scrollData().top);
      if(Math.abs($(window).scrollTop() - scrollData().top) > 50) {
        // We're not within 50px of our target location.
        if(scrollAttempts > 0) {
          scrollAttempts--;
          setTimeout(scrollToSaved, 100);
          return;
        }
      }
    }
    scrollAttempts = 10;
  }

  // Set up a function to scroll to top
  // affectSave defaults to true.
  function scrollToDefault(affectSave) {
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
        data.write('active', false);
        $(window).scrollTop(0);
        $('html').removeClass('menu-active');
      } else if(!$('html').hasClass('menu-active')) {
        // Burst mode isn't active, but menu isn't open for some reason.
        $('html').addClass('menu-active');
        scrollToSaved();
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
      // Save scroll position
      cc.util.rhanum(data, 'scrolltop', String($(window).scrollTop()));
    }
  });

  // Menu switcher
  // Based off of cutie function
  cc.menu = function(scriptname, state) {
    if($.type(scriptname) === 'undefined' && $.type(data.script) !== 'undefined') {
      // Keep current script
      scriptname = data.script;
      state = data.state;
    } else if($.type(scriptname) === 'undefined') {
      // No script name defined, so set it to default
      scriptname = 'home';
      state = state || {};
    } else {
      // Script name is defined, but make sure state is too.
      state = state || {};
    }

    // Remove menu state class
    $('html').removeClass('menu-script-' + data.script);

    // Empty out menu contents
    $('#menu-content').html('');

    // Scroll to top
    scrollToDefault();

    // Swap over current menu
    data.write('script', scriptname);
    // Set state
    data.write('state', state);

    // Add menu state class
    $('html').addClass('menu-script-' + data.script);

    if($.type(cc.menu[scriptname]) !== 'undefined') {
      // It's loaded already, so just run its init function.
      cc.menu[scriptname]($('#menu-content'), data.state);
    } else {
      // It hasn't loaded yet, so get it loaded.
      cc.getScript('menu/' + scriptname + '/menu.js').done(function() {
        // Go ahead and run its init function
        cc.menu[scriptname]($('#menu-content'), data.state);
      }).fail(function() {console.log(arguments)});
    }
  }

  // Make some variables available for scripts
  // These are functions so that they can update
  cc.menu.script = function() {
    return data.script;
  }
  cc.menu.state = function() {
    return data.state;
  }

  // Easy to use function to open / close / toggle menu
  cc.menu.open = function(open) {
    if($.type(open) === 'boolean') {
      data.write('active', open);
    } else {
      data.write('active', !data.active);
    }
  }

  // Pass tasks, ticks, and draws to menu
  cc.loop.task(function(now) {
    if($.type(cc.menu[data.script]) !== 'undefined') {
      $.isFunction(cc.menu[data.script].task) && cc.menu[data.script].task(now, $('#menu-content'), data.state);
    }
  });
  cc.loop.tick(function(now) {
    if($.type(cc.menu[data.script]) !== 'undefined') {
      $.isFunction(cc.menu[data.script].tick) && cc.menu[data.script].tick(now, $('#menu-content'), data.state);
    }
  });
  cc.loop.draw(function(now) {
    if($.type(cc.menu[data.script]) !== 'undefined') {
      $.isFunction(cc.menu[data.script].draw) && cc.menu[data.script].draw(now, $('#menu-content'), data.state);
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
}();
