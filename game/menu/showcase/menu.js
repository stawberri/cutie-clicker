!function() {
  var script = 'showcase', dir = 'menu/' + script + '/',
  menu = cc.menu[script] = function(element, state) {
    cc.util.getcss(dir + 'menu.css');
    element.load(cc.util.l(dir + 'menu.html'), function() {
      // Load in stuff from state
      switch(state.type) {
        case 'cutie':
          // Get cutie information
          cc.cuties(state.index, function(cutie) {
            // Load css
            cc.util.getcss('cuties/' + cutie.cutie + '/cutie.css');

            // Dump in classes
            element.find('#menu-showcase-wrap').addClass('menu-showcase-cutie' + cutie.renderCutieClasses());

            // Add cutie card
            cutie.renderCutieCard(element.find('#menu-showcase-cutie-card'));

            // Fade in
            element.find('#menu-showcase-wrap').removeClass('menu-showcase-go')[0].offsetHeight;
            setTimeout(function() {
              element.find('#menu-showcase-wrap').addClass('menu-showcase-go');
            }, 100);
          });
        break;
      }
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
