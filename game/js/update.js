// Update storage data

!function() {
  // Current data version
  var dataStorageVersion = 4;

  // Process persistent data
  cc.init.addAction('<span class="fa fa-database"></span>', 'persistent data update', function(done) {
    cc.ls = Rhaboo.persistent('cc-ls');

    // Check localStorage version
    switch(cc.ls.v) {
      default: // there isn't a version
        // Move people to https://cc.aideen.pw/ if they aren't already there.
        // This is here and not in init, because this ensures players won't lose data.
        if(location.protocol + location.host != 'https:cc.aideen.pw' && !cc.f) {
          // Attempt to record that redirection is needed. It's okay if this fails--players will just have to keep coming back here
          try {window.localStorage.setItem('cc-redirecthttps', 1);} catch(e) {}
          location.replace('https://cc.aideen.pw' + location.pathname + location.search + location.hash);
          return;
        }

        cc.ls.erase('d');
        cc.ls.write('d', {});

        // Default contains a break, since presumably defaults are set properly in their code
      break;

      case 1:
      case 2:
        if(cc.ls.d.cuties) {
          cc.cuties(0, function(cutie) {
            if(cutie.data.xp) {
              cc.ls.d.write('xp', cutie.data.xp);
              cutie.data.erase('xp');
            }
          });
        }
      case 3:
        if(cc.ls.d.menu && cc.ls.d.menu.script == 'stats') {
          cc.ls.d.menu.write('script', 'home');
        }
      case dataStorageVersion:
    }

    // Update version
    cc.ls.write('v', dataStorageVersion);

    done();
  });
}();
