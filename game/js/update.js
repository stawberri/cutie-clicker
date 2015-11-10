!function() {
  // Current data version
  var dataStorageVersion = 1;

  // Load data
  cc.ls = Rhaboo.persistent('cc-ls');
  cc.ss = Rhaboo.perishable('cc-ss');

  // Throw out sessionStorage if version doesn't match
  if(cc.ss.v != dataStorageVersion) {
      cc.ss.write('d', {})
  }

  // Check localStorage version
  switch(cc.ls.v) {
    default: // there isn't a version
      cc.ls.write('d', {});
    break;
    case dataStorageVersion:
  }

  // Update versions
  cc.ls.write('v', dataStorageVersion);
  cc.ss.write('v', dataStorageVersion);
}();
