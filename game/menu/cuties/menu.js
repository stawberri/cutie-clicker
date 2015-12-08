!function() {
  var lastListUpdate = 0;
  function cutieTemplate() {
    return $();
  }

  var script = 'cuties', dir = 'menu/' + script + '/',
  menu = cc.menu[script] = function(element) {
    cc.util.getcss(dir + 'menu.css');
    element.load(cc.util.l(dir + 'menu.html'), function() {
      // Create a template cutie card
      var template = $('.menu-cuties-list-button');
      $('#menu-cuties-list').empty();
      cutieTemplate = function() {
        return template.clone();
      }

      lastListUpdate = 0
      listUpdate();
    });
  };

  function listUpdate() {
    if(lastListUpdate == cc.cuties.listTime) {
      return;
    } else {
      lastListUpdate = cc.cuties.listTime;
    }

    var listElement = $('#menu-cuties-list');
    if(listElement.length < 1) {
      // List doesn't exist for some reason.
      lastListUpdate = 0;
      return;
    }

    listElement.empty();

    var cutiesList = cc.cuties.list();
    $.each(cutiesList, function(index, value) {
      cc.cuties(index, function(cutie) {
        var cutieElement = cutieTemplate();
        cutie.renderCutieCard(cutieElement, 'menu-cuties-list-button');

        cutieElement.appendTo(listElement);
      });
    });
  }
}();
