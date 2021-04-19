// ATOKA
var atokaUrl = "https://api.atoka.io/v2/companies";

// find elements
var inputToken = $('#input-token');
var inputPiva = $('#input-vat');
var inputName = $('#input-name');
var inputFuzzy = $('#input-fuzzy');
var inputConf = $('#input-confidence');

function doMatchRequest(callback) {
  // GET request to Atoka Companies Search, with only PIVA in input
  $.get(atokaUrl + '/match', {
    token: inputToken.val(),
    regNumbers: inputPiva.val(),
    name: inputName.val(),
    fuzziness: inputFuzzy.val(),
    minConfidence: inputConf.val(),
  }).done(callback);
}

function doDetailsRequest(companyId, callback) {
  // Downloads data for a single company, from packages base contacts and web
  $.get(atokaUrl + '/' + companyId, {
    token: inputToken.val(),
    packages: 'base,contacts,web',
  }).done(callback);
}


// handle click and add class
$('#match-button').on('click', function() {
  $('#results').remove();
	
  doMatchRequest(function(data) {
    // show results of match
    let results = data.items.map(function(item) {
      let label = `${item.name} <small>(${item.confidence * 100}%)</small><br/><small>${item.fullAddress}</small>`;
      return $(`<li><input type="radio" name="company" value="${item.id}" />${label}</li>`);
    });

    var resBlock = $('<ul id="results">');
    resBlock.addClass('block-content').html(results);
    resBlock.append($('<button id="download-button">Download Data</button>'));
    resBlock.append('<br/><small>This call will cost 1 credit companies:*</small>');
    $('#form').after(resBlock);
    $('#download-button').on('click', downloadData);
  });
});

function downloadData() {
  var checked = $("input[name='company']:checked", '#results').val();
	
  doDetailsRequest(checked, function(data) {
    var result = $('<div>');
    result.addClass('block-content');

    result.append($(`<div>VAT: ${data.item.base.vat}</div>`));

    // show first phone only if present
    if (data.item.contacts && data.item.contacts.phones) {
      result.append($(`<div>PHONE: ${data.item.contacts.phones[0].number}</div>`));
    }

    // show first website only if present
    if (data.item.web && data.item.web.websites) {
      var website = data.item.web.websites[0].url;
      result.append($(`<div>WEB: <a target="_blank" href="${website}">${website}</a></div>`));
    }
    $('#results').after(result);
  });
}
