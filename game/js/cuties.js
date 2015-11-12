// This script works with manipulating and accessing cutie data

!function() {
  // Default starter cutie
  var starterCutie = {
    cutie: '119'
  }

  cc.cuties = function(dataIndex, callback) {
    var cutieData = cc.cuties.list();

    // Check lower bound
    if(dataIndex < 0) {
      return;
    }

    // Need to make a starter cutie?
    if(dataIndex == 0 && cutieData.length == 0) {
      return cc.cuties(cc.cuties.add(starterCutie), callback);
    }

    // Check upper bound
    if(dataIndex >= cutieData.length) {
      return;
    }

    var dataObject = cutieData[dataIndex];
    var cutieType = dataObject.cutie;

    if($.type(callback) === 'function') {

      function cutieProcessor(callback) {
        var cutieBase = cc.cuties[cutieType];

        // Create a proto on cutieBase with cc.cuties.proto, or use a previously created one
        cutieBase.proto = cutieBase.proto || $.extend(Object.create(cc.cuties.proto), cutieBase.prototype);
        var cutie = $.extend(Object.create(cutieBase.proto), {constructor: cutieBase});
        cc.cuties.construct.call(cutie, dataObject);
        cutie.constructor.call(cutie, dataObject);

        // These are only really good to be used as private variables. Too risky otherwise.
        cutie.data = dataObject;
        cutie.base = cutieBase;

        callback(cutie);
      }

      // Is script loaded yet?
      if(cc.cuties[cutieType]) {
        cutieProcessor(callback);
      } else {
        $.getScript('game/cuties/' + cutieType + '/cutie.js').done(function() {
          cutieProcessor(callback);
        });
      }
    }

    return cutieType;
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

    var newIndex = cc.cuties.list().length;

    cc.cuties.list().write(newIndex, options);

    // Return cutie index
    return newIndex;
  }

  // Remove a cute from data
  cc.cuties.remove = function(index) {
    // Bounds check
    if(index < 0 || index >= cc.cuties.list().length) {
      return;
    }

    // This is the easy part
    cc.cuties.list().splice(index, 1);

    // Check current list and decrement (or remove) if necessary
    $.each(current(), function(currentIndex, currentValue) {
      if(currentValue == index) {
        // Removed a current cutie
        current().write(currentIndex, undefined);
      } else if (currentValue < index) {
        // Removed a cutie that comes before current cutie
        current().write(currentIndex, currentValue - 1);
      }
    });
  }

  // Grab current array
  function current() {
    return data().current || data().write('current', []).current;
  }

  // Left and Right cuties are pretty simple
  cc.cuties.l = function(index, callback) {
    if($.type(index) === 'function') {
      // Called with only a callback
      callback = index;
    } else if($.type(index) !== 'undefined') {
      // Setter
      current().write(1, index);
    }
    if($.type(current()[1]) === 'number') return cc.cuties(current()[1], callback);
  }
  cc.cuties.r = function(index, callback) {
    if($.type(index) === 'function') {
      // Called with only a callback
      callback = index;
    } else if($.type(index) !== 'undefined') {
      // Setter
      current().write(2, index);
    }
    if($.type(current()[2]) === 'number') return cc.cuties(current()[2], callback);
  }

  // Middle is a little more complex
  cc.cuties.m = function(index, callback) {
    if($.type(index) === 'function') {
      // Called with only a callback
      callback = index;
    } else if($.type(index) !== 'undefined') {
      // Setter
      current().write(0, index);
    }

    if($.type(current()[0]) === 'number') {
      return cc.cuties(current()[0], callback);
    } else {
      // This can't empty.
      if($.type(current()[2]) === 'number') {
        // Grab right cutie
        var newIndex = current()[2];
        // Empty out right cutie
        cc.cuties.r(null);
        return cc.cuties.m(newIndex, callback);
      } else if($.type(current()[1]) === 'number') {
        // Grab left cutie
        var newIndex = current()[1];
        // Empty out left cutie
        cc.cuties.l(null);
        return cc.cuties.m(newIndex, callback);
      } else {
        // Grab first cutie
        return cc.cuties.m(0, callback);
      }
    }
  }

  // Cutie object constructor
  cc.cuties.construct = function() {

  }

  // Cutie object prototype
  cc.cuties.proto = {
    // Get / set love - low level, doesn't trigger events
    lv: function(value) {
      if($.type(value) === 'undefined') {
        // Get - default to 0
        return cc.util.rhanum(this.data, 'lv') || cc.util.rhanum(this.data, 'lv', '0');
      } else {
        // Set
        return cc.util.rhanum(this.data, 'lv', value);
      }
    },
    // Get / set excitement - low level, doesn't trigger events
    xp: function(value) {
      if($.type(value) === 'undefined') {
        // Get - default to 0
        return cc.util.rhanum(this.data, 'xp') || cc.util.rhanum(this.data, 'xp', '0');
      } else {
        // Set
        return cc.util.rhanum(this.data, 'xp', value);
      }
    },
    // Incremenets love
    love: function(value) {
      if(value) {
        value = String(value);
        this.lv(SchemeNumber.fn['+'](this.lv(), value));
      }
      return this.lv();
    },
    // Incremenets excitement
    excitement: function(value) {
      if(value) {
        value = String(value);
        this.xp(SchemeNumber.fn['+'](this.xp(), value));
      }

      // For now, instantly loveup if excitement goes over target
      if(SchemeNumber.fn['>'](this.xp(), this.targetxp())) {
        this.loveup();
      }

      return this.xp();
    },
    // Target xp for love up
    targetxp: function() {
      return String(SchemeNumber.fn.expt('2', this.lv()));
    },
    // Love Up processing!
    loveup: function() {
      this.xp('0');
      this.love('1');
    }
  };
}();