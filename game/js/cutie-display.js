// This script handles displaying cuties and stuff like that.

!function() {
  // Load cutie renders
  var cutieM, cutieL, cutieR;
  cc.render.tick(function() {
    // middle cutie
    cc.cuties.m(function(cutie) {
      if(cutieM != cutie.cutie) {
        cutieM = cutie.cutie;

        // Remove all classes from cutieM and add them back
        $('#cutie-m').removeClass().addClass('cutie-view cutie-' + cutie.cutie + ' rarity-' + cutie.rarity);

        // Load cutie html
        $('#cutie-m .cutie-embed').load('game/cuties/' + cutie.cutie + '/cutie.html');
      }
    });

    // left cutie
    // massive if statement checks if it's not defined
    if(!cc.cuties.l(function(cutie) {
      if(cutieL != cutie.cutie) {
        cutieL = cutie.cutie;

        // Remove all classes from cutieL and add them back
        $('#cutie-l').removeClass().addClass('cutie-view cutie-' + cutie.cutie);

        // Load cutie html
        $('#cutie-l .cutie-embed').load('game/cuties/' + cutie.cutie + '/cutie.html');
      }
    }) && cutieL) {
      cutieL = undefined;

      // Remove all classes from cutieL and add them back
      $('#cutie-l').removeClass().addClass('cutie-view');

      // Unload cutie
      $('#cutie-l .cutie-embed').html();
    }

    // right cutie
    // massive if statement checks if it's not defined
    if(!cc.cuties.r(function(cutie) {
      if(cutieR != cutie.cutie) {
        cutieR = cutie.cutie;

        // Remove all classes from cutieR and add them back
        $('#cutie-r').removeClass().addClass('cutie-view cutie-' + cutie.cutie);

        // Load cutie html
        $('#cutie-r .cutie-embed').load('game/cuties/' + cutie.cutie + '/cutie.html');
      }
    }) && cutieR) {
      cutieR = undefined;

      // Remove all classes from cutieR and add them back
      $('#cutie-r').removeClass().addClass('cutie-view');

      // Unload cutie
      $('#cutie-r .cutie-embed').html();
    }
  });
}();
