!function() {
  // Current data version
  var dataStorageVersion = 3;

  // Process persistent data
  cc.init.addAction('&#9921;', 'persistent data update', function(done) { // ⛁
    cc.ls = Rhaboo.persistent('cc-ls');

    // Check localStorage version
    switch(cc.ls.v) {
      default: // there isn't a version
        cc.ls.erase('d');
        cc.ls.write('d', {});
      case 1:
        if(cc.ls.d.clicks) {
          cc.ls.d.write('clicks', LZString.compress(String(cc.ls.d.clicks)));
        }
      case 2:
        cc.cuties(0, function(cutie) {
          if(cutie.data.xp) {
            cc.ls.d.write('xp', cutie.data.xp);
            cutie.data.erase('xp');
          }
        });
      case dataStorageVersion:
    }

    // Update version
    cc.ls.write('v', dataStorageVersion);

    done();
  });

  // Process perishable data
  cc.init.addAction('&#9728;', 'perishable data update', function(done) { // ☀
    cc.ss = Rhaboo.perishable('cc-ss');

    // Throw out sessionStorage if version doesn't match
    if(cc.ss.v != dataStorageVersion) {
        cc.ss.erase('d');
        cc.ss.write('d', {});
    }

    // Update versions
    cc.ss.write('v', dataStorageVersion);

    done();
  });
}();
