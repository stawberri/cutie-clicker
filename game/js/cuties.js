// This script works with manipulating and accessing cutie data

!function() {
  // Default starter cutie
  var starterCutie = {
    cutie: '119'
  }

  cc.cuties = function(dataIndex) {
    var cutieData = cc.cuties.list();

    // Check lower bound
    if(dataIndex < 0) {
      return null;
    }

    // Need to make a starter cutie?
    if(dataIndex == 0 && cutieData.length == 0) {
      return cc.cuties.add(starterCutie);
    }

    // Check upper bound
    if(dataIndex >= cutieData.length) {
      return null;
    }

    var dataObject = cutieData[dataIndex];
    var cutieType = dataObject.cutie;

    // Is script loaded yet?
    if(cc.cuties[cutieType]) {
      return cutieProcessor();
    } else {
      $.getScript('game/cuties/' + cutieType + '/cutie.js').done(function() {
        return cutieProcessor();
      });
    }

    function cutieProcessor() {
      var cutieBase = cc.cuties[cutieType];

      // Create a proto on cutieBase with cc.cuties.proto, or use a previously created one
      cutieBase.proto = cutieBase.proto || Object.create(cc.cuties.proto, cutieBase.prototype || {});
      var cutie = Object.create(cutieBase.proto, {});
      cutieBase.call(cutie, dataObject);

      cutie.data = dataObject;
      cutie.base = cutieBase;

      return cutie;
    }
  };

  // This is a function instead of a variable because we can't access data when this is being run
  function data() {
    return cc.ls.d.cuties || cc.ls.d.write('cuties', {}).cuties;
  }

  // Grab list from data, or create list and return it if it doesn't exist yet.
  cc.cuties.list = function() {
    return data().list || data().write('list', []).list;
  }

  // Add a cutie to data
  cc.cuties.add = function(cutie, otherOptions) {
    // allow passing in only options
    if($.type(cutie) === 'object') {
      otherOptions = cutie;
      cutie = otherOptions.cutie;
    }

    var options = $.merge(otherOptions || {}, {cutie: String(cutie)});

    var newIndex = list().length;

    list().write(newIndex, options);

    // Return cutie object
    return cc.cuties(newIndex);
  }

  // Cutie object prototype
  cc.cuties.proto = {
  };
}();
