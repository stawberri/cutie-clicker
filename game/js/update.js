// Update storage data

!function() {
  // Current data version
  var dataStorageVersion = 8;

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
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        cc.ls.d.erase('tempClickStreakPassive');
        cc.ls.d.erase('tempClickStreakTime');
        if(cc.ls.d.menu && cc.ls.d.menu.script == 'stats') {
          cc.ls.d.erase('menu');
        }
        cc.ls.d.erase('cutieStats');
        if(cc.ls.d.cuties && cc.ls.d.cuties.list && cc.ls.d.cuties.list[0]) {
          var cutie = cc.ls.d.cuties.list[0];

          cutie.write('cutie', '77');
          if(cutie.xp) {
            cc.ls.d.write('xp', cutie.xp);
            cutie.erase('xp');
          }
          cc.util.rhanum(cc.ls.d, 'totalCuties', '1');
          cc.ls.d.write('cutieStats', {
            '77': {
              count: cc.ls.d.totalCuties
            }
          });
          if(cutie.lv) {
            cc.ls.d.write('totalLv', cutie.lv);
            cc.ls.d.write('totalBurstSuccess', cutie.lv);
            cc.ls.d.cutieStats['77'].write('lv', cutie.lv);
            cc.ls.d.cutieStats['77'].write('burstSuccess', cutie.lv);
          }
        }
      case dataStorageVersion:
    }

    // Update version
    cc.ls.write('v', dataStorageVersion);

    done();
  });
}();
