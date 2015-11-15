// This script handles displaying cuties and stuff like that.

!function() {
  // Get classes to apply to cutie
  function cutieClasses(cutie) {
    var classesString = ' cutie-' + cutie.cutie;
    classesString += ' rarity-' + cutie.rarity;
    return classesString;
  }

  // Current (main game) cuties display
    var cutieM, cutieL, cutieR;
    var cutieClassM, cutieClassL, cutieClassR;
    cc.render.tick(function() {
      // middle cutie
      // There's always a cutie here, so no need to check for that.
      cc.cuties.m(function(cutie) {
        // Has this cutie changed?
        if(cutieM != cutie.cutie) {
          cutieM = cutie.cutie;

          // Get CSS
          cc.util.getcss('game/cuties/' + cutie.cutie + '/cutie.css');

          // Main Cutie Display
          $('#cutie-m .cutie-embed').load('game/cuties/' + cutie.cutie + '/cutie.html #cutie');

          // Cutie Card Display
          $('#cutie-bar-m .cutie-card').html('&#' + cutie.cutie + ';');
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
          cc.util.getcss('game/cuties/' + cutie.cutie + '/cutie.css');

          // Main Cutie Display
          $('#cutie-l .cutie-embed').load('game/cuties/' + cutie.cutie + '/cutie.html #cutie');

          // Cutie Card Display
          $('#cutie-bar-l .cutie-card').html('&#' + cutie.cutie + ';');
        }

        var thisClass = cutieClasses(cutie);
        if(cutieClassL != thisClass) {
          cutieClassL = thisClass;
          $('#cutie-l').removeClass().addClass('cutie-view' + thisClass);
          $('#cutie-bar-l').removeClass().addClass('cutie-bar-slot' + thisClass);
        }

      }) && cutieL) {
        cutieL = undefined;

        // Main Cutie Display

        // Remove all classes from cutieL and add them back
        $('#cutie-l').removeClass().addClass('cutie-view');
        $('#cutie-l .cutie-embed').html('');

        // Cutie Card Display
        $('#cutie-bar-l').removeClass().addClass('cutie-bar-slot');
        $('#cutie-bar-l .cutie-card').html('');
      }

      // right cutie
      // massive if statement checks if it's not defined
      if(!cc.cuties.r(function(cutie) {
        if(cutieR != cutie.cutie) {
          cutieR = cutie.cutie;

          // Get CSS
          cc.util.getcss('game/cuties/' + cutie.cutie + '/cutie.css');

          // Main Cutie Display
          $('#cutie-r .cutie-embed').load('game/cuties/' + cutie.cutie + '/cutie.html #cutie');

          // Cutie Card Display
          $('#cutie-bar-r .cutie-card').html('&#' + cutie.cutie + ';');
        }

        var thisClass = cutieClasses(cutie);
        if(cutieClassR != thisClass) {
          cutieClassR = thisClass;
          $('#cutie-r').removeClass().addClass('cutie-view' + thisClass);
          $('#cutie-bar-r').removeClass().addClass('cutie-bar-slot' + thisClass);
        }

      }) && cutieR) {
        cutieR = undefined;

        // Main Cutie Display

        // Remove all classes from cutieR and add them back
        $('#cutie-r').removeClass().addClass('cutie-view');
        $('#cutie-r .cutie-embed').html('');


        // Cutie Card Display
        $('#cutie-bar-r').removeClass().addClass('cutie-bar-slot');
        $('#cutie-bar-r .cutie-card').html('');
      }
    });
}();
