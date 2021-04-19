// ATOKA
var atokaUrl = "https://api.atoka.io/v2/companies";

// find elements
var inputToken = $("#input-token");
var inputVat = $("#input-vat");

// handle click and add class
$("button").on("click", function() {
  var val = inputVat.val();
  var token = inputToken.val();
  

  // GET request to Atoka Companies Search, with only the VAT in input
  $.get(atokaUrl, {
    token: 'da703c91-4b82-44bc-83bc-d5e3cb78c303-e',
    vat: "03476481209",
    
  }).done(function(data) {
    let results = data.items.map(function(item) {
      // each result has this structure
      // {
      //   "name": "the company name",
      //   "country": "it",
      //   "fullAddress": "address of the registered headuarters",
      //   "id": "internal Atoka identifier"
      // }

      return $(`<li>${item.name}<br/>${item.fullAddress}</li>`);
    });

    var resBlock = $('<ul>');
    resBlock.addClass('block-content').html(results);
    $('#form').after(resBlock);
  });
});