// ATOKA
var atokaUrl = "https://api.atoka.io/v2/companies";

// find elements
var inputToken = $("#input-token");
var inputVat = $("#input-vat");

function resetOutput() {
  $('.output').remove();
}

// handle click and add class
$("button").on("click", function() {
  resetOutput();
  var val = inputVat.val();
  var token = inputToken.val();

  // GET request to Atoka Companies Search, with only the VAT in input
  $.get(atokaUrl, {
    token: token,
    vat: val,
  }).done(function(dataSearch) {
    if (dataSearch.items.length == 0) {
      $('#form').after($('<span class="output">No results found.</span>'));
      return
    } else if (dataSearch.items.length > 1) {
      $('#form').after($('<span class="output">Multiple results found.</span>'));
      return
    }

    let atokaId = dataSearch.items[0].id;

    $.get(atokaUrl + '/' + atokaId, {
      token: token
    }).done(function(data) {
      let item = data.item,
        listElements = [];

      listElements.push($(`<li>${item.name}<br/>${item.fullAddress}</li>`));
      listElements.push($(`<li>ATECO: ${item.base.ateco[0].code}</li>`));

      if (item.web && item.web.websites) {
          let websites = item.web.websites.map(function(website) {
            return $(`<li>${website.url}</li>`);
          });
          let websitesElement = $('<ul>');
          websitesElement.html(websites);
          listElements.push($('<li>Websites</li>'));
          listElements.push(websitesElement);
      }


      if (item.contacts && item.contacts.phones) {
          let phonesList = item.contacts.phones.map(function(phone) {
            return $(`<li>${phone.number}</li>`);
          });
          let phoneListElement = $('<ul>');
          phoneListElement.html(phonesList);
          listElements.push($('<li>Phones</li>'));
          listElements.push(phoneListElement);
      }



      var resBlock = $('<ul>');
      resBlock.addClass('block-content').addClass('output').html(listElements);
      $('#form').after(resBlock);
    });
  });
});
