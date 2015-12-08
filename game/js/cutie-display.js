// This script handles displaying cuties and stuff like that.

!function() {
  // Set game title
  var oldTitle = '';
  cc.loop.draw(function(now) {
    cc.cuties.m(function(cutie) {
      var title = 'Cutie Clicker';

      if(cc.ls.d.burst) {
        title = cutie.glyph + ' Clicker';
      }

      if(oldTitle !== title) {
        $('head title').html(title);
        oldTitle = title;
      }
    });
  });


  function cutieCard(element, defaultClass, cutie) {
    if(cutie) {
      return cutie.renderCutieCard(element, defaultClass);
    } else {
      return cc.cuties.clearCutieCard(element, defaultClass);
    }
  }

  // Get classes to apply to cutie
  function cutieClasses(cutie) {
    return cutie.renderCutieClasses();
  }

  // Current (main game) cuties display
  // Cutie cards and main display
    var cutieM, cutieL, cutieR;
    var cutieClassM, cutieClassL, cutieClassR;
    cc.loop.tick(function() {
      // middle cutie
      // There's always a cutie here, so no need to check for that.
      cc.cuties.m(function(cutie) {
        // Has this cutie changed?
        if(cutieM != cutie.cutie) {
          cutieM = cutie.cutie;

          // Get CSS
          cc.util.getcss('cuties/' + cutie.cutie + '/cutie.css');

          // Main Cutie Display
          $('#cutie-m .cutie-embed').load(cc.util.l('cuties/' + cutie.cutie + '/cutie.html #cutie'));

          // Cutie Card Display
          cutieCard('#cutie-bar-m', 'cutie-bar-slot', cutie);

          // Burst mode
          $('#burst-xp-gauge').removeClass().addClass('rarity-' + cutie.rarity);
          $('#burst-xp-gauge .glyph').html(cutie.glyph);
        }

        var thisClass = cutieClasses(cutie);
        if(cutieClassM != thisClass) {
          cutieClassM = thisClass;
          $('#cutie-m').removeClass().addClass('cutie-view' + thisClass);
          $('#cutie-bar-m').removeClass().addClass('cutie-bar-slot' + thisClass);
        }
      });

      // left cutie
      // massive if statement checks if it's not defined
      if(!cc.cuties.l(function(cutie) {
        if(cutieL != cutie.cutie) {
          cutieL = cutie.cutie;

          // Get CSS
          cc.util.getcss('cuties/' + cutie.cutie + '/cutie.css');

          // Main Cutie Display
          $('#cutie-l .cutie-embed').load(cc.util.l('cuties/' + cutie.cutie + '/cutie.html #cutie'));

          // Cutie Card Display
          cutieCard('#cutie-bar-l', 'cutie-bar-slot', cutie);
        }

        var thisClass = cutieClasses(cutie);
        if(cutieClassL != thisClass) {
          cutieClassL = thisClass;
          $('#cutie-l').removeClass().addClass('cutie-view' + thisClass);
          $('#cutie-bar-l').removeClass().addClass('cutie-bar-slot' + thisClass);
        }

      }) && cutieL) {
        cutieL = undefined;
        cutieClassL = undefined;

        // Main Cutie Display
        $('#cutie-l').removeClass().addClass('cutie-view');
        $('#cutie-l .cutie-embed').empty();

        // Cutie Card Display
        cutieCard('#cutie-bar-l', 'cutie-bar-slot');
      }

      // right cutie
      // massive if statement checks if it's not defined
      if(!cc.cuties.r(function(cutie) {
        if(cutieR != cutie.cutie) {
          cutieR = cutie.cutie;

          // Get CSS
          cc.util.getcss('cuties/' + cutie.cutie + '/cutie.css');

          // Main Cutie Display
          $('#cutie-r .cutie-embed').load(cc.util.l('cuties/' + cutie.cutie + '/cutie.html #cutie'));

          // Cutie Card Display
          cutieCard('#cutie-bar-r', 'cutie-bar-slot', cutie);
        }

        var thisClass = cutieClasses(cutie);
        if(cutieClassR != thisClass) {
          cutieClassR = thisClass;
          $('#cutie-r').removeClass().addClass('cutie-view' + thisClass);
          $('#cutie-bar-r').removeClass().addClass('cutie-bar-slot' + thisClass);
        }

      }) && cutieR) {
        cutieR = undefined;
        cutieClassR = undefined;

        // Main Cutie Display
        $('#cutie-r').removeClass().addClass('cutie-view');
        $('#cutie-r .cutie-embed').empty();


        // Cutie Card Display
        cutieCard('#cutie-bar-r', 'cutie-bar-slot');
      }
    });
}();
