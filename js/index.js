$(document).ready(function() {

	function getURLParameter(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
	}

	var numberOfRows = getURLParameter("rows");
	$.getJSON("https://api.coinmarketcap.com/v1/ticker/?limit=" + numberOfRows).done(function(r){
		for(i=0;i<parseInt(numberOfRows);i++){
			if(parseFloat(r[i]['percent_change_24h']) < 0){
				$('#pricetable tr:last').after('<tr><td>' + r[i]['rank'] + '</td><td>' + '<a href="http://coinmarketcap.com/currencies/"' + r[i]['id'] + '"><img src="http://coinmarketcap.com/static/img/coins/16x16/' + r[i]['id'] + '.png" /></a>&nbsp;&nbsp;' + r[i]['name'] + '</td><td>$' + r[i]['price_usd'] + '</td><td>$' + parseFloat(r[i]['24h_volume_usd']).toLocaleString() + '</td><td class="red">' + parseFloat(r[i]['percent_change_24h']).toFixed(2) + '%</td></tr>');
			}else{
				$('#pricetable tr:last').after('<tr><td>' + r[i]['rank'] + '</td><td><a href="http://coinmarketcap.com/currencies/' + r[i]['id'] + '"><img src="http://coinmarketcap.com/static/img/coins/16x16/' + r[i]['id'] + '.png" /></a>&nbsp;&nbsp;' + r[i]['name'] + '</td><td>$' + r[i]['price_usd'] + '</td><td>$' + parseFloat(r[i]['24h_volume_usd']).toLocaleString() + '</td><td class="green">' + parseFloat(r[i]['percent_change_24h']).toFixed(2) + '%</td></tr>');
			}
		}
	});
});