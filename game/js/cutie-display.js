// This script handles displaying cuties and stuff like that.

!function() {
  // Load cutie renders
  var cutieM, cutieL, cutieR;
  cc.render.tick(function() {
    // middle cutie
    cc.cuties.m(function(cutie) {
      if(cutieM != cutie.cutie) {
        cutieM = cutie.cutie;

        // Fetch classes

        var cutieClasses = ' cutie-' + cutie.cutie;
        cutieClasses += ' rarity-' + cutie.rarity;


        // Get CSS
        cc.util.getcss('game/cuties/' + cutie.cutie + '/cutie.css');


        // Main Cutie Display

        // Remove all classes from cutieM and add them back
        $('#cutie-m').removeClass().addClass('cutie-view' + cutieClasses);

        // Load cutie html
        $('#cutie-m .cutie-embed').load('game/cuties/' + cutie.cutie + '/cutie.html #cutie');


        // Cutie Card Display

        $('#cutie-bar-m').removeClass().addClass('cutie-bar-slot' + cutieClasses);
        $('#cutie-bar-m .cutie-card').html('&#' + cutie.cutie + ';');
      }
    });

    // left cutie
    // massive if statement checks if it's not defined
    if(!cc.cuties.l(function(cutie) {
      if(cutieL != cutie.cutie) {
        cutieL = cutie.cutie;

        // Fetch classes

        var cutieClasses = ' cutie-' + cutie.cutie;
        cutieClasses += ' rarity-' + cutie.rarity;


        // Get CSS
        cc.util.getcss('game/cuties/' + cutie.cutie + '/cutie.css');


        // Main Cutie Display

        // Remove all classes from cutieL and add them back
        $('#cutie-l').removeClass().addClass('cutie-view' + cutieClasses);

        // Load cutie html
        $('#cutie-l .cutie-embed').load('game/cuties/' + cutie.cutie + '/cutie.html #cutie');


        // Cutie Card Display

        $('#cutie-bar-l').removeClass().addClass('cutie-bar-slot' + cutieClasses);
        $('#cutie-bar-l .cutie-card').html('&#' + cutie.cutie + ';');
      }
    }) && cutieL) {
      cutieL = undefined;

      // Main Cutie Display

      // Remove all classes from cutieL and add them back
      $('#cutie-l').removeClass().addClass('cutie-view');

      // Unload cutie
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

        // Fetch classes

        var cutieClasses = ' cutie-' + cutie.cutie;
        cutieClasses += ' rarity-' + cutie.rarity;


        // Get CSS
        cc.util.getcss('game/cuties/' + cutie.cutie + '/cutie.css');


        // Main Cutie Display

        // Remove all classes from cutieR and add them back
        $('#cutie-r').removeClass().addClass('cutie-view' + cutieClasses);

        // Load cutie html
        $('#cutie-r .cutie-embed').load('game/cuties/' + cutie.cutie + '/cutie.html #cutie');


        // Cutie Card Display

        $('#cutie-bar-r').removeClass().addClass('cutie-bar-slot' + cutieClasses);
        $('#cutie-bar-r .cutie-card').html('&#' + cutie.cutie + ';');
      }
    }) && cutieR) {
      cutieR = undefined;

      // Main Cutie Display

      // Remove all classes from cutieR and add them back
      $('#cutie-r').removeClass().addClass('cutie-view');

      // Unload cutie
      $('#cutie-r .cutie-embed').html('');


      // Cutie Card Display

      $('#cutie-bar-r').removeClass().addClass('cutie-bar-slot');
      $('#cutie-bar-r .cutie-card').html('');
    }
  });
}();
