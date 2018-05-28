
$(document).ready(function() {
  if ($(window).width() > 500) {
    $("#right").show();
    $("#arrow_right").show();
    $("#arrow_left").hide();
  } else {
    togglePrehled();
    $("#right").hide();
    $("#arrow_right").hide();
    $("#arrow_left").show();
  }
  legendUpdate();
  map.spin(false);
  valUj == "kraje";
  var $radios = $('input:radio[name=uj]');
  $radios.filter('[value="auto"]').prop('checked', true);
  valIndi == "poi";
  $radios = $('input:radio[name=indi]');
  $radios.filter('[value="poi"]').prop('checked', true);
  $(".plny_detail").hide();


  $('.menuikony .fa-search').click(function() {
    $('.photon-input').toggle();
  });
  $('.menuikonytelefon .fa-filter').click(function() {
    $('#right').slideToggle();
  });
});
