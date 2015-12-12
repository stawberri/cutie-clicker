!function() {
  var script = 'showcase', dir = 'menu/' + script + '/',
  menu = cc.menu[script] = function(element, state) {
    cc.util.getcss(dir + 'menu.css');
    cc.util.getcss(dir + 'rarity.css');
    element.load(cc.util.l(dir + 'menu.html'), function() {
      // Load in stuff from state
      switch(state.type) {
        case 'cutie':
          cc.util.getcss(dir + 'cutie.css');
          // Get cutie information
          cc.cuties(state.index, function(cutie) {
            // Load css
            cc.util.getcss('cuties/' + cutie.cutie + '/cutie.css');

            // Dump in classes
            element.find('#menu-showcase-wrap').addClass('menu-showcase-cutie' + cutie.renderCutieClasses());

            // Add cutie card
            cutie.renderCutieCard(element.find('#menu-showcase-cutie-card'));
          });
        break;

        case 'empathy':
          cc.util.getcss(dir + 'money.css');
          // Set classes
          element.find('#menu-showcase-wrap').addClass('menu-showcase-empathy rarity-' + state.rarity);

          // Set counter (work on animating it later)
          var startTime = $.now();
          var timeLength = 450;
          var targetTime = startTime + timeLength;
          var halfPi = Math.PI / 2;
          var interval = setInterval(function() {
            var now = $.now();
            var counter = element.find('#menu-showcase-empathy-counter .number');
            if(now > targetTime || counter.length < 1) {
              // Set counter one last time (fails silently if counter is empty, I think).
              counter.html(state.amount);

              clearInterval(interval);
              return;
            }
            var number = (now - startTime) / timeLength;
            number *= halfPi;
            number = Math.sin(number);
            number = SchemeNumber.fn['*'](number, state.amount);
            number = String(SchemeNumber.fn.round(number));

            counter.html(number);
          }, 33);
        break;
      }

      // Fade in
      element.find('#menu-showcase-wrap').removeClass('menu-showcase-go')[0].offsetHeight;
      setTimeout(function() {
        element.find('#menu-showcase-wrap').addClass('menu-showcase-go');
      }, 100);
    });
  };

  menu.open = function(open) {
    if(open === false) {
      setTimeout(function() {
        cc.menu('home');
      }, 300);
    }
  }
}();
