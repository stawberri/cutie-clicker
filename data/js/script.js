(function(){var t,a,o,n,e,r,l,c,i,s,u;t="start",o=$("html"),n=$("#save-data"),e=$("#load-data"),r=$("#load-cancel"),l=$("#load-go"),location.protocol+location.host!=="https:cc.aideen.pw"&&o.addClass("http"),c=function(n){return null!=a&&clearInterval(a),o.removeClass(t).addClass(n),t=n},i=function(){var t;return t=n,t.focus(),t.select(),t},$("#button-save").on("click",function(){var a,o;return"save"===t?c("start"):(a=function(t){var a,o;if(t||!n.is(":focus"))return a=LZString.compressToBase64(JSON.stringify(localStorage)),o=new Date,a="Cutie Clicker Game Data\nSaved: "+o+"\n[0|"+a+"]",n.val(a)},a(!0),c("save"),i(),o=setInterval(a,1e4))}),n.on("click",i),s=function(){var t;return t=e,t.val(""),t.removeClass("ok"),t.prop("readonly",!1),t.focus(),t},$("#button-load").on("click",function(){return"load"===t?c("start"):(c("load"),s())}),u=function(){return e.hasClass("ok")},e.on("input",function(){var t,a,o,n;if(t=$(this),a=/\[0\|((?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?)\]/.exec(t.val()))try{o=JSON.parse(LZString.decompressFromBase64(a[1]))}catch(e){}return null==o||$.isEmptyObject(o)?void 0:(n=t,n.prop("readonly",!0),n.addClass("ok"),n.val(n.val()),t.data("data",o))}),r.on("click",function(){return u?s():void 0}),l.on("click",function(){var t,a,o;if(u&&(t=e.data("data"),null!=t&&!$.isEmptyObject(t))){localStorage.clear();for(a in t)o=t[a],localStorage.setItem(a,o);return window.location="/"}}),$("#button-back").on("click",function(){return window.location="/"}),$("#button-https").on("click",function(){return window.location="https://cc.aideen.pw/data"}),$("#delete-local-storage").on("click",function(t){return t.preventDefault(),confirm("If you haven't saved your game data yet, you will lose it! Are you sure you want to delete your http data?")?(localStorage.clear(),window.location="https://cc.aideen.pw/"):void 0})}).call(this);
