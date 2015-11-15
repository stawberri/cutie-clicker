// This script handles displaying cuties and stuff like that.

!function() {
  // Get classes to apply to cutie
  function cutieClasses(cutie) {
    var classesString = ' cutie-' + cutie.cutie;
    classesString += ' rarity-' + cutie.rarity;
    return classesString;
  }

  // Get cutie card html
  // Doesn't update classes automatically though.
  function cutieCard(element, defaultClass, cutie) {
    element = $(element);
    defaultClass = defaultClass || '';

    if(element.length < 1) {
      return;
    }

    // Create .cutie-card if it doesn't already exist.
    var cutieCardElement = element.find('.cutie-card');
    if(cutieCardElement.length < 1) {
      cutieCardElement = $('<div class="cutie-card">').appendTo(element);
    }

    if(cutie) {
      element.removeClass().addClass(defaultClass + cutieClasses(cutie));

      cutieCardElement.html('&#' + cutie.cutie + ';');
    } else {
      element.removeClass().addClass(defaultClass);
      cutieCardElement.html('');
    }
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
          cutieCard('#cutie-bar-m', 'cutie-bar-slot', cutie);
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
        $('#cutie-l .cutie-embed').html('');

        // Cutie Card Display
        cutieCard('#cutie-bar-l', 'cutie-bar-slot');
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
        $('#cutie-r .cutie-embed').html('');


        // Cutie Card Display
        cutieCard('#cutie-bar-r', 'cutie-bar-slot');
      }
    });
}();
