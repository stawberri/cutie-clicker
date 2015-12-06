// Update storage data

!function() {
  // Current data version
  var dataStorageVersion = 3;

  // Process persistent data
  cc.init.addAction('<span class="fa fa-database"></span>', 'persistent data update', function(done) {
    cc.ls = Rhaboo.persistent('cc-ls');

    // Check localStorage version
    switch(cc.ls.v) {
      default: // there isn't a version
        cc.ls.erase('d');
        cc.ls.write('d', {});
      case 1:
      case 2:
        cc.cuties(0, function(cutie) {
          if(cutie.data.xp) {
            cc.ls.d.write('xp', cutie.data.xp);
            cutie.data.erase('xp');
          }
        });
      case 3:
        if(cc.ls.d.menu.script == 'stats') {
          cc.ls.d.menu.write('script', 'home');
        }
      case dataStorageVersion:
    }

    // Update version
    cc.ls.write('v', dataStorageVersion);

    done();
  });
}();
