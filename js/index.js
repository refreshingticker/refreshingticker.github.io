$(document).ready(function() {
  var res = [];
  $.getJSON('https://poloniex.com/public?command=returnTicker', function(data){
    if(localStorage.length == 0){
      res.push("USDT_BTC");
    }else{
      for(var i = 0; i < localStorage.length; i++){
        res.push(localStorage.getItem(i));
      }
    }

    Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
    };

    var size = Object.size(data);
    var nameArray = [];
    for(var i = 0; i < size; i++){
      nameArray[i] = Object.keys(data)[i];
    }
    nameArray.sort();
    for(var i = 0; i < size; i++){
      $("#list").append("<li>" + nameArray[i] + "<input type='checkbox' name='pairList' value='" + nameArray[i].toLowerCase() + "'></li>");
    }

    for(var i = 0; i < res.length; i++){
      if(res[i].startsWith("USDT")){
        $("#outTable").append("<tr><td class='mdl-data-table__cell--non-numeric'>" + res[i] + "</td><td>n/a</td><td id='" + res[i] + "-USDT" + "'>$" + parseFloat(data[res[i]].last).toFixed(2) + "</td>");
      }else{
        var prefix = res[i].split("_");
        $("#outTable").append("<tr><td class='mdl-data-table__cell--non-numeric'>" + res[i] + "</td><td id='" + res[i] + "-" + prefix[0] + "'>" + parseFloat(data[res[i]].last).toFixed(8) + " " + prefix[0] + "</td><td id='" + res[i] + "-USD" + "'>$" + (parseFloat(data[res[i]].last) * parseFloat(data['USDT_' + prefix[0]].last)).toFixed(5) + "</td>");
      }
    }
  });

  $(".addPairButton").on('click', function(){
    var dialog = document.querySelector('#addPairDialog');
    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    dialog.showModal();
  });

  $("#closePairDialogButton").on('click', function(){
    var dialog = document.querySelector('#addPairDialog');
    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    dialog.close();
  });

  $("#savePairDialogButton").on('click', function(){
    var dialog = document.querySelector('#addPairDialog');
    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }

    var selected = [];
    $('#list input:checked').each(function() {
      selected.push($(this).attr('value').toUpperCase());
    });
    localStorage.clear();
    for(var i = 0; i < selected.length; i++){
      localStorage.setItem(i, selected[i]);
    }
    location.reload();
  });

  setInterval(function(){
      $.getJSON('https://poloniex.com/public?command=returnTicker', function(data){
        var toUpdate = [];
        for(var i = 0; i < res.length; i++){
          var prefix = res[i].split("_");

          if(res[i].startsWith("USDT")){
            if(parseFloat($("#" + res[i] + "-" + prefix[0]).text().split("$")[1]) < parseFloat(parseFloat(data[res[i]].last).toFixed(2))){
              var obj = {};
              obj[res[i] + "-" + prefix[0]] = "#AAFFAA"; //green
              toUpdate.push(obj);
            }
            if(parseFloat($("#" + res[i] + "-" + prefix[0]).text().split("$")[1]) > parseFloat(parseFloat(data[res[i]].last).toFixed(2))){
              var obj = {};
              obj[res[i] + "-" + prefix[0]] = "#FFAAAA"; //red
              toUpdate.push(obj);
            }
            $("#" + res[i] + "-" + prefix[0]).html("$" + parseFloat(data[res[i]].last).toFixed(2));
          }else{
            if(parseFloat($("#" + res[i] + "-" + prefix[0]).text()) < parseFloat(parseFloat(data[res[i]].last).toFixed(8))){
              var obj = {};
              obj[res[i] + "-" + prefix[0]] = "#AAFFAA"; //green
              toUpdate.push(obj);
            }
            if(parseFloat($("#" + res[i] + "-" + prefix[0]).text()) > parseFloat(parseFloat(data[res[i]].last).toFixed(8))){
              var obj = {};
              obj[res[i] + "-" + prefix[0]] = "#FFAAAA"; //red
              toUpdate.push(obj);
            }
            if(parseFloat($("#" + res[i] + "-USD").text().split("$")[1]) < parseFloat((parseFloat(data["USDT_BTC"].last) * parseFloat(data[res[i]].last).toFixed(8)).toFixed(5))){
              var obj = {};
              obj[res[i] + "-USD"] = "#AAFFAA"; //green
              toUpdate.push(obj);
            }
            if(parseFloat($("#" + res[i] + "-USD").text().split("$")[1]) > parseFloat((parseFloat(data["USDT_BTC"].last) * parseFloat(data[res[i]].last).toFixed(8)).toFixed(5))){
              var obj = {};
              obj[res[i] + "-USD"] = "#FFAAAA"; //red
              toUpdate.push(obj);
            }
            $("#" + res[i] + "-" + prefix[0]).html(parseFloat(data[res[i]].last).toFixed(8) + " " + prefix[0]);
            $("#" + res[i] + "-USD").html("$" + (parseFloat(data[res[i]].last) * parseFloat(data['USDT_' + prefix[0]].last)).toFixed(5));
          }
        }
        for(var i = 0; i < toUpdate.length; i++){
          var idToUpdate = Object.keys(toUpdate[i], 0)[0];
          var newColor = toUpdate[i][idToUpdate];
          $("#" + idToUpdate).css({backgroundColor: newColor}).animate({ backgroundColor: "#FFFFFF"}, 1000);
        }
      });
  }, 1000);
});

function filter(element) {
    var value = $(element).val();

    $("#list > li").each(function() {
        if ($(this).text().toLowerCase().search(value) > -1 || $(this).text().search(value) > -1) {
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
}
