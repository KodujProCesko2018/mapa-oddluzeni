const POI = 'poi';
const POI08 = 'poi08';
const POI6 = 'poe6';
const POE = 'poe';
const POE7 = 'poe7';
const POE6 = 'poe6';

var rok = "2008";
var valUj = "kraje";
var valIndi = "poi";
var viewPrehled = 0;
var lObce;
var lOkresy;
var detail = 0;
var autoLayer = true;
var isComparing = false;
var map = L.map('map', {
  zoomControl: false,
  doubleClickZoom: false
});
map.createPane('obrysy');
map.getPane('obrysy').style.zIndex = 550;
map.getPane('obrysy').style.pointerEvents = 'none';


   L.Control.include({
     _refocusOnMap: L.Util.falseFn // Do nothing.
   });



base = L.tileLayer('https://api.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic291a3VwbWEiLCJhIjoiMGVjMjZjMWZmYzM1YjAxZDYwMmViNWU4NTQzZWNmYjUifQ.t-OJ7Re1gQXfP1vpY1ASVA', {
  minZoom: 5,
  maxZoom: 13,
  attribution: 'Podkladová mapa &copy; <a href="https://www.mapbox.com/">Mapbox</a>, &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, zdroj dat <a href="http://www.ekcr.cz/">Exekutorská komora ČR</a>, tvůrce mapy <a href="http://www.matejsoukup.eu/">Matěj Soukup</a>',
  mapid: 'soukupma.68f89de5'
});

map.addLayer(base);

function resetView() {
  map.fitBounds([
    [48.5, 12.0],
    [51.1, 21.5]
  ]);
};
resetView();

map.spin(true);

L.control.zoom({
  position: 'bottomright'
}).addTo(map);

var icko = L.control({
  position: 'bottomright'
});
icko.onAdd = function(map) {
  this._div = L.DomUtil.create('div', 'icko');
  this._div.innerHTML =
    '<a id="icko_rozbal" onclick="icko.rozbal()" href="#" ><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANOSURBVGhD7dlJyE1xHMbx15wMKcPCwspQosRCiR0bhOxQWIgdkQVhgQUZVpRiYSjTwsJYEtmQZAoRC0IiMhTKzPdZ3Hq7Pe85/+Hce6X3qc+C/r9z733vPf/hd9o6859nOOZjMw7jJC7gLI5jO5ZgArrhn8pE7MIL/InwHscwAz3QknTFXNyAe5Ox9EdYjt5oWsbhKtwbyvUMs9HQ6FtYjx9wb6JKur/6o/L0xTm4F22Ux9DkUVkG4TrcizXaa4xHdvRNXIN7kWZ5g6xvRvfEebiLx/qNl0i9vzQJDERS1sFdNNY+1N5EL6zGN7ixRc6gC6KiKfYn3AVjnIDLWrjxZZYhOPrUVa0TWrVdhsCNL/MOgxEUrdjuIimmwmUA3PgQOxGUqrYdshcuS+HGh/gELQmF0QbQFefYgJ6oZR4+w40NtQqF2Q1XmOsjtKi+avd/OW6jMLFb8VYaBhutnq7gX7UYNgvgCmL8gk6EOltMwhhMx0bo5+VqUu2BzSa4glA7MBQdZSS0DrjaFJdgcwiuIIR2AaMwB5qVtOC56Dzj6lM8gc0puIIQ+iD6WdX+fQcu09C+LscH2FyEK0ihRctlJtz4FPrj2Wh36QpSPISLJgE3PoUmD5ujcAUpDsIl5z6spzXPZhtcQYqFqI921TpcufEptEO3UQfQFcTSTe9mLZ1x3PhUB2CjNqYriHUTLmvgxqfS/WajXqzamK4ohvq+Lpfhxqcaiw6jXqwrijEZ9VE35jvc+BTPUXh+z53nv8I1pKtcCGULCtMd+rSuOMRduFS5fmgyGYHSrIC7QIiONnI60bnxKfScJShq7ash5i5S5h5ctCvWzuE+TiN1X6f7bDSCo12su1CIKSjLfrjaMlq0o3ME7mJl3mIW6mcVtYDUPUntmT1AH0SnHx7BXTSEPtAV6PnhLeQ8V/kCnTaTo3O8uuHu4s2i7bq+4ezo+USrPoy+xUWoLDrGPoV7sUZRE08LdOXRo4EqD19FdDDLuifKoplIrf0quyHt6aekKTZpdkqJmsjqiuf2cGu07dCGNWqxqzL6ua2EuibuDZbRDmIrgvZOzYp6sZph1AFUR0Z9J51v9NdWo0BnbD1Y1aqu/ZzOE4Vb8c50puVpa/sLVe+J6OGq49MAAAAASUVORK5CYII=" width="35px"></a>';
  return this._div;
};

icko.addTo(map);

icko.rozbal = function() {
  icko._div.innerHTML = '<div class="info"><h4>Zdroj dat</h4>' +
    '<ul><li><b>Centrální evidence exekucí</b> spravovaná Exekutorskou komorou ČR</li>' +
    '<li><b>Český statistický úřad</b></li></ul>' +
    '<h4>Časová období</h4>' +
    '<ul><li><b>2016</b> a <b>2017</b></li></ul>' +
    '<h4>Mapa obsahuje</h4>' +
    '<ul><li><b>pouze fyzické osoby</b></li>' +
    '<li><b>počet obyvatel starších 15 let</b></li>' +
    '<li><b>počet osob v exekuci</b></li>' +
    '<li><b>celkový počet exekucí</b></li>' +
    '<li><b>vymáhaná jistina</b> (částka bez nákladů na vymáhání a úroků z prodlení)</li>' +
    '<li><b>věková struktura</b></li>' +
    '<li><b>počet exekucí u jednotlivých osob</b> (tzv. vícečetnost exekucí)</li>' +
    '<li><b>ukazatele kombinující výše uvedená data</b></li></ul>' +
    '<p>Upozorňujeme, že v mapě se mohou objevit nepřesnosti vzniklé při exportu dat z Centrální evidence exekucí. </p>' +
    '<p>* Jistina za rok 2016 obsahuje fyzické i právnické osoby. Jistina za rok 2017 je již očištěna a obsahuje pouze fyzické osoby.</p>' +
    '<div style="text-align: center"><img src="images/ekcr.jpg" height="100">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="images/csu.png" height="40" style="vertical-align: top;"></div>' +
    '<div class="right"><a onclick="icko.sbal()" href="#" ><img src="images/70206.png" width="12px"></a></div></div>';
};

icko.sbal = function() {
  icko._div.innerHTML = '<a id="icko_rozbal" onclick="icko.rozbal()" href="#" ><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANOSURBVGhD7dlJyE1xHMbx15wMKcPCwspQosRCiR0bhOxQWIgdkQVhgQUZVpRiYSjTwsJYEtmQZAoRC0IiMhTKzPdZ3Hq7Pe85/+Hce6X3qc+C/r9z733vPf/hd9o6859nOOZjMw7jJC7gLI5jO5ZgArrhn8pE7MIL/InwHscwAz3QknTFXNyAe5Ox9EdYjt5oWsbhKtwbyvUMs9HQ6FtYjx9wb6JKur/6o/L0xTm4F22Ux9DkUVkG4TrcizXaa4xHdvRNXIN7kWZ5g6xvRvfEebiLx/qNl0i9vzQJDERS1sFdNNY+1N5EL6zGN7ixRc6gC6KiKfYn3AVjnIDLWrjxZZYhOPrUVa0TWrVdhsCNL/MOgxEUrdjuIimmwmUA3PgQOxGUqrYdshcuS+HGh/gELQmF0QbQFefYgJ6oZR4+w40NtQqF2Q1XmOsjtKi+avd/OW6jMLFb8VYaBhutnq7gX7UYNgvgCmL8gk6EOltMwhhMx0bo5+VqUu2BzSa4glA7MBQdZSS0DrjaFJdgcwiuIIR2AaMwB5qVtOC56Dzj6lM8gc0puIIQ+iD6WdX+fQcu09C+LscH2FyEK0ihRctlJtz4FPrj2Wh36QpSPISLJgE3PoUmD5ujcAUpDsIl5z6spzXPZhtcQYqFqI921TpcufEptEO3UQfQFcTSTe9mLZ1x3PhUB2CjNqYriHUTLmvgxqfS/WajXqzamK4ohvq+Lpfhxqcaiw6jXqwrijEZ9VE35jvc+BTPUXh+z53nv8I1pKtcCGULCtMd+rSuOMRduFS5fmgyGYHSrIC7QIiONnI60bnxKfScJShq7ash5i5S5h5ctCvWzuE+TiN1X6f7bDSCo12su1CIKSjLfrjaMlq0o3ME7mJl3mIW6mcVtYDUPUntmT1AH0SnHx7BXTSEPtAV6PnhLeQ8V/kCnTaTo3O8uuHu4s2i7bq+4ezo+USrPoy+xUWoLDrGPoV7sUZRE08LdOXRo4EqD19FdDDLuifKoplIrf0quyHt6aekKTZpdkqJmsjqiuf2cGu07dCGNWqxqzL6ua2EuibuDZbRDmIrgvZOzYp6sZph1AFUR0Z9J51v9NdWo0BnbD1Y1aqu/ZzOE4Vb8c50puVpa/sLVe+J6OGq49MAAAAASUVORK5CYII=" width="35px"></a>';
};




var prehled = L.control({
  position: 'topleft'
});
prehled.onAdd = function(map) {
  this._div = L.DomUtil.create('div', 'info prehled');
  this._div.innerHTML =
    '<div id="prehledTable"><table><tr><td class="bold">Česká republika</td><td class="right bold">2017</td><td class="right">změna</td></tr>' +
    '<tr><td>Počet osob v exekuci</td><td class="right bold">863 tis.</td><td class="right red">+3,4 %</td></tr>' +
    '<tr><td>Počet osob se 3 a více exekucemi</td><td class="right bold">493 tis.</td><td class="right red">+0,8 %</td></tr>' +
    '<tr><td>Podíl osob v exekuci</td><td class="right bold">9,7 %</td><td class="right red">+0,4 p.b.</td></tr>' +
    '<tr><td>Celkový počet exekucí</td><td class="right bold">4,67 mil.</td><td class="right red">+4,8 %</td></tr>' +
    '<tr><td>Vymáhaná jistina</td><td class="right bold">239 mld. Kč</td><td class="right">&nbsp;</td></tr>' +
    '<tr><td><span class="italic">údaje jsou pouze za fyzické osoby</span></td></tr></table></div><div class="right"><a id="togglePrehledLink" onclick="togglePrehled()" href="#"><img src="images/70206.png" width="12px"></a></div>';
  return this._div;
};

prehled.addTo(map);



var zrusit = L.control({
  position: 'topright'
});
zrusit.onAdd = function(map) {
  this._div = L.DomUtil.create('div', 'zrusit');
  this._div.innerHTML =
    '<a id="togglePrehledLink" onclick="cancelResults()" href="#"><img src="images/70206.png" width="12px"> Skrýt výsledky vyhledávání</a>';
  return this._div;
};

function cancelResults() {
  searchPoints.removeFrom(map);
  map.removeControl(zrusit);
}

var photonControlOptions = {
  limit: 20,
  resultsHandler: showSearchPoints,
  noResultLabel: 'žádné výsledky',
  placeholder: 'Vyhledej obec',
  position: 'topright',
  includePosition: false,
  feedbackEmail: null,
  osm_tag: 'boundary:administrative',
  formatResult: function(feature, el) {
    var title = L.DomUtil.create('strong', '', el),
      detailsContainer = L.DomUtil.create('small', '', el),
      details = [];
    title.innerHTML = feature.properties.name;
    if (feature.properties.city && feature.properties.city !== feature.properties.name) {
      details.push(feature.properties.city);
    }
    if (feature.properties.country) details.push(feature.properties.country);
    detailsContainer.innerHTML = details.join(', ');
  },
  onSelected: function(feature) {
    this.map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 12);
    valUj = "obce";
    var $radios = $('input:radio[name=uj]');
    $radios.filter('[value=obce]').prop('checked', true);
    switchMap([feature.geometry.coordinates[0], feature.geometry.coordinates[1]]);
  },
}

var searchControl = L.control.photon(photonControlOptions);
searchControl.addTo(map);


var searchPoints = L.geoJson(null, {
  onEachFeature: function(feature, layer) {
    layer.bindTooltip(feature.properties.name);
  }
});

function showSearchPoints(geojson) {
  searchPoints.clearLayers();
  searchPoints.addData(geojson);
  searchPoints.addTo(map);
  zrusit.addTo(map);
}


function getColor2(props) {
  try {
    if (valIndi == "poi_poe") {
      d = props[POI + rok.slice(2, 4)] / props[POE + rok.slice(2, 4)];
    } else if (valIndi == "poi") {
      d = props[POI + rok.slice(2, 4)];
      console.log(d);
    } else if (valIndi == "poi_change") {
      if (props[POI6] > 0) {
        d = (props[POI08] / props[POI6] - 1) * 100;
      } else {
        d = 0
      }
    }
    return getColor3(d);
  } catch (err) {
    return getColor3(0);
  }

}


function getColor3(d) {
  if ($.isNumeric(d)) {
    for (i = 0; i < breaks[valIndi][valUj]['colors'].length; i++) {
      if (d < breaks[valIndi][valUj]['breaks'][i]) {
        return breaks[valIndi][valUj]['colors'][i]
      }
    }
    return breaks[valIndi][valUj]['colors'][breaks[valIndi][valUj]['colors'].length - 1];
  } else {
    return breaks[valIndi][valUj]['colors'][0];
  }
}

function style(feature) {

  if (comparingList.indexOf(feature) != -1) {

    return {
      weight: 5,
      opacity: 1,
      color: '#C44E37',
      dashArray: '',
      fillOpacity: 0.7,
      fillColor: getColor2(feature.properties)
    };

  } else {
    return {
      weight: 1,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
      fillColor: getColor2(feature.properties)
    };
  }
}


function styleK(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: '#666',
    dashArray: '',
    fillOpacity: 0
  }
}

function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

}


function resetHighlight(e) {
  lyr.resetStyle(e.target);
}


function nulaToNeposkytnuto(number, digits /*, units*/ ) {
  if (isNaN(number)) {
    number = 0;
  }
  if (digits === undefined) {
    digits = 0;
  };
  numberText = parseFloat(number).toLocaleString('cs-CZ', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })

  return numberText;
};

function onEachFeature(feature, layer) {
  layer.bindTooltip(generateTooltip(feature), {
    sticky: true
  });
  layer.on('mouseover', function(e) {
    layer.openTooltip();
  });
  layer.on('mouseout', function() {
    layer.closeTooltip();
  });
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: compare
  });
}


var comparingList = [];

function switchMap(coor) {
  map.spin(true);
  legendUpdate();
  loKraje.removeFrom(map); //krajske obrysy
  if (valUj == "kraje") {
    nlyr = lKraje;
  } else if (valUj == "okresy") {
    loKraje.addTo(map);
    if (typeof lOkresy === 'undefined') {
      lOkresy = new L.GeoJSON.AJAX("okresy.geojson", {
        style: style,
        onEachFeature: onEachFeature
      });

    }
    nlyr = lOkresy;
  } else if (valUj == "orp") {

    loKraje.addTo(map);
    if (typeof lOrp === 'undefined') {
      lOrp = new L.GeoJSON.AJAX("orp.geojson", {
        style: style,
        onEachFeature: onEachFeature
      });

    }
    nlyr = lOrp;
  } else if (valUj == "obce") {
    loKraje.addTo(map);
    if (typeof lObce === 'undefined') {
      lObce = new L.GeoJSON.AJAX("obce.geojson", {
        style: style,
        onEachFeature: onEachFeature
      });

    }
    nlyr = lObce;
  }
  if (lyr != nlyr) {
    comparingList = [];
    comparing.update();
    lyr.removeFrom(map);
    lyr = nlyr;
  }
  lyr.setStyle(style);
  lyr.addTo(map);
  lyr.eachLayer(function(layer) {
    layer._tooltip.setContent(generateTooltip(layer.feature))
  });
  map.spin(false);

}



function compare(e) {

  if (($(window).width() > 500) && ($(window).height() > 400)) {

    var index = comparingList.indexOf(e.target.feature);
    if (index != -1) {

      comparingList.splice(index, 1);
      if (comparingList.length == 0) {
        comparing.remove();
      }
      comparing.update();
      lyr.resetStyle(e.target);
    } else {
      if (comparingList.length == 0) {
        comparing.addTo(map);
      }
      comparingList.push(e.target.feature);
      comparing.update();
      var layer = e.target;
      layer.setStyle({
        weight: 5,
        color: '#C44E37',
        opacity: 1,
        dashArray: '',
        fillOpacity: 0.5
      });
    }

  }
}

function makeDivInfo(feature, index) {

  var div = L.DomUtil.create('div', 'uj right');
  props = feature.properties;
  if (valUj == "kraje") {
    heading = '<b>' + props.k.toUpperCase() + '</b>&nbsp;&nbsp;<a title="Resetovat" href="#" onclick="cancel(' + index + ');return false;"><img src="images/70206.png" width="12px"></a><br />';
  } else if (valUj == "okresy") {
    heading = '<b>' + props.r.toUpperCase() + '</b>&nbsp;&nbsp;<a title="Resetovat" href="#" onclick="cancel(' + index + ');return false;"><img src="images/70206.png" width="12px"></a><br /><span class="italic">' + props.k.replace(/ /g, '&nbsp;') + '</span><br />';
  } else if (valUj == "orp") {
    heading = '<b>' + props.n.toUpperCase() + '</b>&nbsp;&nbsp;<a title="Resetovat" href="#" onclick="cancel(' + index + ');return false;"><img src="images/70206.png" width="12px"></a><br /><span class="italic">' + props.k.replace(/ /g, '&nbsp;') + '</span><br />';
  } else if (valUj == "obce") {
    heading = '<b>' + props.b.toUpperCase() + '</b>&nbsp;&nbsp;<a title="Resetovat" href="#" onclick="cancel(' + index + ');return false;"><img src="images/70206.png" width="12px"></a><br /><span class="italic">' + props.r.replace(/ /g, '&nbsp;') + '</span><br /><span class="italic">' + props.k.replace(/ /g, '&nbsp;') + '</span><br />';
  }
  t = heading + '<b>' + nulaToNeposkytnuto(feature.properties[POI + rok.slice(2, 4)] * 100 / feature.properties["o"], 2) + ' %</b><br />';
  if (rok == "2017") {
    if (props[POI08] >= props[POI6]) {
      plus = "+";
    } else {
      plus = "";
    }
    t += plus + nulaToNeposkytnuto((props[POI08] / props[POI6] - 1) * 100, 1) + ' % (' + plus + nulaToNeposkytnuto((props[POI08] - props[POI6]) * 100 / props["o"], 2) + ' p.b.)<br />';
  }
  t += nulaToNeposkytnuto(props["pe" + rok.slice(2, 4)] / props[POI + rok.slice(2, 4)], 1) + '<br />'
  t += nulaToNeposkytnuto(props["c" + rok.slice(2, 4)] / props[POI + rok.slice(2, 4)]) + ' Kč'
  if (rok == "2017") {
    t += '<div class="maly_detail"><div class="struktura">&nbsp;</div>' + nulaToNeposkytnuto((props["p3e7"] + props["p4e7"] + props["p5e7"]) * 100 / props[POI08]) + ' %<br />' + nulaToNeposkytnuto(props["pse7"] * 100 / props[POI08]) + ' %</div>'
  } else {
    t += '<div class="maly_detail"></div>';
  }
  t += '<div class="plny_detail">';
  if (rok == "2017") {
t+=nulaToNeposkytnuto(props["m7"]) + ' Kč<br />' ;
  }
  t+=  nulaToNeposkytnuto(props["o"]) + '<br />' +
    nulaToNeposkytnuto(props[POI + rok.slice(2, 4)]) + '<br />' +
    nulaToNeposkytnuto(props["pe" + rok.slice(2, 4)]) + '<br />';
  if (rok == "2017") {
    t += '<div class="struktura">&nbsp;</div><div class="struktura">'+nulaToNeposkytnuto(props["pde7"] * 100 / props[POI08]) + ' %<br />' +
      nulaToNeposkytnuto(props["pme7"] * 100 / props[POI08]) + ' %<br />' +
      nulaToNeposkytnuto(props["pse7"] * 100 / props[POI08]) + ' %</div><div class="struktura">' +
      nulaToNeposkytnuto(props["p1e7"] * 100 / props[POI08]) + ' %<br />' +
      nulaToNeposkytnuto(props["p2e7"] * 100 / props[POI08]) + ' %<br />' +
      nulaToNeposkytnuto(props["p3e7"] * 100 / props[POI08]) + ' %<br />' +
      nulaToNeposkytnuto(props["p4e7"] * 100 / props[POI08]) + ' %<br />' +
      nulaToNeposkytnuto(props["p5e7"] * 100 / props[POI08]) + ' %</div>';
  }
  t += '</div><div class="struktura">&nbsp;</div>';
  div.innerHTML = t;
  return div
};

function compareSecondColumn(a, b) {

  if (a[1] === b[1]) {
    return 0;
  } else {
    return a[1].localeCompare(b[1], "cs");
  }
}

lKraje = new L.GeoJSON.AJAX("kraje.geojson", {
  style: style,
  onEachFeature: onEachFeature
});

loKraje = new L.GeoJSON.AJAX("kraje.geojson", {
  style: styleK,
  pane: 'obrysy',
  interactive: false
});

lyr = lKraje;
lyr.addTo(map);

function togglePrehled() {
  $("#prehledTable").toggle(200);
  if ($("#togglePrehledLink").text() != "Zobrazit souhrnné informace") {
    $("#togglePrehledLink").text("Zobrazit souhrnné informace");
  } else if ($("#togglePrehledLink").text() == "Zobrazit souhrnné informace") {
    $("#togglePrehledLink").html('<img src="images/70206.png" width="12px">');
  }
}

function toggleDetail() {
  $(".maly_detail").toggle(200);
  $(".plny_detail").toggle(200);
  if (detail) {
    detail = false;
    $("#detailLink").text("Zobrazit detailní údaje");
  } else {
    detail = true;
    $("#detailLink").text("Skrýt detailní údaje");
  }
}



function legendUpdate() {
  labels = [];
  from = breaks[valIndi][valUj]['breaks'][0] - breaks[valIndi]['step'];
  if (from < 0) {
    labels.push(
      '<span style="width: 50px;float: left;background:' + getColor3(from).replace('rgb', 'rgba').replace(')', ',0.7)') + '">&nbsp;</span>&nbsp;' +
      parseFloat(from).toLocaleString('cs-CZ', {
        minimumFractionDigits: breaks[valIndi]['decimals'],
        maximumFractionDigits: breaks[valIndi]['decimals']
      }) + ' a méně');
  } else {
    from = 0
    to = breaks[valIndi][valUj]['breaks'][0];
    labels.push(
      '<span style="width: 50px;float: left;background:' + getColor3((from + to) / 2).replace('rgb', 'rgba').replace(')', ',0.7)') + '">&nbsp;</span>&nbsp;' +
      parseFloat(from).toLocaleString('cs-CZ', {
        minimumFractionDigits: breaks[valIndi]['decimals'],
        maximumFractionDigits: breaks[valIndi]['decimals']
      }) + ' &ndash; ' + parseFloat(to - breaks[valIndi]['step']).toLocaleString('cs-CZ', {
        minimumFractionDigits: breaks[valIndi]['decimals'],
        maximumFractionDigits: breaks[valIndi]['decimals']
      })
    );
  }
  from = breaks[valIndi][valUj]['breaks'][0];
  for (var i = 1; i < breaks[valIndi][valUj]['colors'].length - 1; i++) {
    to = breaks[valIndi][valUj]['breaks'][i];
    labels.push(
      '<span style="width: 50px;float: left;background:' + getColor3((from + to) / 2).replace('rgb', 'rgba').replace(')', ',0.7)') + '">&nbsp;</span>&nbsp;' +
      parseFloat(from).toLocaleString('cs-CZ', {
        minimumFractionDigits: breaks[valIndi]['decimals'],
        maximumFractionDigits: breaks[valIndi]['decimals']
      }) + ' &ndash; ' + parseFloat(to - breaks[valIndi]['step']).toLocaleString('cs-CZ', {
        minimumFractionDigits: breaks[valIndi]['decimals'],
        maximumFractionDigits: breaks[valIndi]['decimals']
      })
    );
    from = to;
  };
  labels.push(
    '<span style="width: 50px;float: left;background:' + getColor3(from + breaks[valIndi]['step']).replace('rgb', 'rgba').replace(')', ',0.7)') + '">&nbsp;</span>&nbsp;' +
    parseFloat(from).toLocaleString('cs-CZ', {
      minimumFractionDigits: breaks[valIndi]['decimals'],
      maximumFractionDigits: breaks[valIndi]['decimals']
    }) + ' a více');
  console.log(breaks, breaks[valIndi]['decimals']);
  $('#legenda').html('<b>' + breaks[valIndi]['title'] + '</b><br />' + labels.join('<br />'));

};

function cancel(index) {
  comparingList.splice(index, 1);
  if (comparingList.length == 0) {
    comparing.remove();
  }
  comparing.update();
  lyr.setStyle(style);
}

function generateTooltip(feature) {
  var props = feature.properties;
  var t;
  if (valIndi == "poi") {
    if (valUj == "kraje") {
      t = '<table><tr><td class="grey bold">' + props.k.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>';
      if (rok == "2017") {
        t += '<tr><td class="poradi">Pořadí kraje <span class="netucne">(1 = nejhorší)</span></td><td class="right poradi">' + props[POI + rok.slice(2, 4) + "p"] + ' z 14</td></td>';
      }
    } else if (valUj == "okresy") {
      t = '<table><tr><td class="grey bold">okres ' + props.r.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey italic">' + props.k + '</td><td class="right grey">&nbsp;</td></tr>';
      if (rok == "2017") {
        t += '<tr><td class="poradi">Pořadí okresu <span class="netucne">(1 = nejhorší)</span></td><td class="right poradi">' + props[POI + rok.slice(2, 4) + "p"] + ' z 77</td></td>';
      }
    } else if (valUj == "orp") {
      t = '<table><tr><td class="grey bold">SO ORP ' + props.n.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey italic">' + props.k + '</td><td class="right grey">&nbsp;</td></tr>';
      if (rok == "2017") {
        t += '<tr><td class="poradi">Pořadí ORP <span class="netucne">(1 = nejhorší)</span></td><td class="right poradi">' + props[POI + rok.slice(2, 4) + "p"] + ' z 206</td></td>';
      }
    } else if (valUj == "obce") {
      t = '<table><tr><td class="grey bold">obec ' + props.b.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey italic">okres ' + props.r + ', ' + props.k + '</td><td class="right grey">&nbsp;</td></tr>';
    }
    t += '<tr><td>Počet osob starších 15 let</td><td class="right">' + nulaToNeposkytnuto(props["o"]) + '</td></tr>' +
      '<tr><td>Počet osob v exekuci</td><td class="right">' + nulaToNeposkytnuto(props[POI + rok.slice(2, 4)]) + '</td></tr>' +
      '<tr><td class="vybrano">Podíl osob v exekuci</td><td class="vybrano right">' + nulaToNeposkytnuto(props[POI + rok.slice(2, 4)] * 100 / props["o"], 2) + ' %</td></tr>' +
      '<tr><td>Celkový počet exekucí</td><td class="right">' + nulaToNeposkytnuto(props["pe" + rok.slice(2, 4)]) + '</td></tr>' +
      '<tr><td>Průměrný počet exekucí na osobu</td><td class="right">' + nulaToNeposkytnuto(props["pe" + rok.slice(2, 4)] / props[POI + rok.slice(2, 4)], 1) + '</td></tr>';

    if (rok == "2017") {
      t += '<tr><td><u>Detail osob v exekuci:</u></td></tr>' +
        '<tr><td>Podíl (počet) dětí a mladistvých</td><td class="right">' + nulaToNeposkytnuto(props["pde" + rok.slice(2, 4)] * 100 / props[POI + rok.slice(2, 4)]) + ' % (' + nulaToNeposkytnuto(props["pde" + rok.slice(2, 4)]) + ')</td></tr>' +
        '<tr><td>Podíl (počet) osob ve věku 18 až 29 let</td><td class="right">' + nulaToNeposkytnuto(props["pme" + rok.slice(2, 4)] * 100 / props[POI + rok.slice(2, 4)]) + ' % (' + nulaToNeposkytnuto(props["pme" + rok.slice(2, 4)]) + ')</td></tr>' +
        '<tr><td>Podíl (počet) seniorů (65+)</td><td class="right">' + nulaToNeposkytnuto(props["pse" + rok.slice(2, 4)] * 100 / props[POI + rok.slice(2, 4)]) + ' % (' + nulaToNeposkytnuto(props["pse" + rok.slice(2, 4)]) + ')</td></tr>'
    }

  } else if (valIndi == "pove") {
    if (valUj == "kraje") {
      t = '<table><tr><td class="grey bold">' + props.k.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>';
      if (rok == "2017") {
        t += '<tr><td class="poradi">Pořadí kraje <span class="netucne">(1 = nejhorší)</span></td><td class="right poradi">' + nulaToNeposkytnuto(props["pv" + rok.slice(2, 4) + "p"]) + ' z 14</td></tr>';
      }
    } else if (valUj == "okresy") {
      t = '<table><tr><td class="grey bold">okres ' + props.r.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey"><i>' + props.k + '</i></td><td class="right grey">&nbsp;</td></tr>';
      if (rok == "2017") {
        t += '<tr><td class="poradi">Pořadí okresu <span class="netucne">(1 = nejhorší)</span></td><td class="right poradi">' + nulaToNeposkytnuto(props["pv" + rok.slice(2, 4) + "p"]) + ' z 77</td></tr>';
      }
    } else if (valUj == "orp") {
      t = '<table><tr><td class="grey bold">SO ORP ' + props.n.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey"><i>' + props.k + '</i></td><td class="right grey">&nbsp;</td></tr>';
      if (rok == "2017") {
        t += '<tr><td class="poradi">Pořadí ORP <span class="netucne">(1 = nejhorší)</span></td><td class="right poradi">' + nulaToNeposkytnuto(props["pv" + rok.slice(2, 4) + "p"]) + ' z 206</td></tr>';
      }
    } else if (valUj == "obce") {
      t = '<table><tr><td class="grey bold">obec ' + props.b.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey"><i>okres ' + props.r + ', ' + props.k + '</i></td><td class="right grey">&nbsp;</td></tr>';
    }
    t += '<tr><td>Podíl (počet) osob v exekuci</td><td class="right">' + nulaToNeposkytnuto(props[POI + rok.slice(2, 4)] * 100 / props["o"], 2) + '% (' + nulaToNeposkytnuto(props[POI + rok.slice(2, 4)]) + ')</td></tr>' +
      '<tr><td class="bold">Z toho:</td></tr>' +
      '<tr><td class="bold border_down">podíl (počet) osob s 1 exekucí</td><td class="bold border_down right">' + nulaToNeposkytnuto(props["p1e" + rok.slice(2, 4)] * 100 / props[POI + rok.slice(2, 4)]) + '% (' + nulaToNeposkytnuto(props["p1e" + rok.slice(2, 4)]) + ')</td></tr>' +
      '<tr><td>podíl (počet) osob s 2 exekucemi</td><td class="right">' + nulaToNeposkytnuto(props["p2e" + rok.slice(2, 4)] * 100 / props[POI + rok.slice(2, 4)]) + '% (' + nulaToNeposkytnuto(props["p2e" + rok.slice(2, 4)]) + ')</td></tr>' +
      '<tr><td>podíl (počet) osob s 3 – 9 exekucemi</td><td class="right">' + nulaToNeposkytnuto(props["p3e" + rok.slice(2, 4)] * 100 / props[POI + rok.slice(2, 4)]) + '% (' + nulaToNeposkytnuto(props["p3e" + rok.slice(2, 4)]) + ')</td></tr>' +
      '<tr><td>podíl (počet) osob s 10 – 29 exekucemi</td><td class="right">' + nulaToNeposkytnuto(props["p4e" + rok.slice(2, 4)] * 100 / props[POI + rok.slice(2, 4)]) + '% (' + nulaToNeposkytnuto(props["p4e" + rok.slice(2, 4)]) + ')</td></tr>' +
      '<tr><td class="border_down">podíl (počet) osob s 30 a více exekucemi</td><td class="right border_down">' + nulaToNeposkytnuto(props["p5e" + rok.slice(2, 4)] * 100 / props[POI + rok.slice(2, 4)]) + '% (' + nulaToNeposkytnuto(props["p5e" + rok.slice(2, 4)]) + ')</td></tr>' +
      '<tr><td class="vybrano">celkový podíl (počet) osob s více exekucemi</td><td class="right vybrano">' + nulaToNeposkytnuto((props["p2e" + rok.slice(2, 4)] + props["p3e" + rok.slice(2, 4)] + props["p4e" + rok.slice(2, 4)] + props["p5e" + rok.slice(2, 4)]) * 100 / props[POI + rok.slice(2, 4)]) + '% (' + nulaToNeposkytnuto(props["p2e" + rok.slice(2, 4)] + props["p3e" + rok.slice(2, 4)] + props["p4e" + rok.slice(2, 4)] + props["p5e" + rok.slice(2, 4)]) + ')</td></tr>';
  } else if (valIndi == "poi_poe") {
    if (valUj == "kraje") {
      t = '<table><tr><td class="grey bold">' + props.k.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>';
      if (rok == "2017") {
        t += '<tr><td class="poradi">Pořadí kraje <span class="netucne">(1 = nejhorší)</span></td><td class="right poradi">' + props["pjo" + rok.slice(2, 4) + "p"] + ' z 14</td></td>';
      }
    } else if (valUj == "okresy") {
      t = '<table><tr><td class="grey bold">okres ' + props.r.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey"><i>' + props.k + '</i></td><td class="right grey">&nbsp;</td></tr>';
      if (rok == "2017") {
        t += '<tr><td class="poradi">Pořadí okresu <span class="netucne">(1 = nejhorší)</span></td><td class="right poradi">' + props["pjo" + rok.slice(2, 4) + "p"] + ' z 77</td></td>';
      }
    } else if (valUj == "orp") {
      t = '<table><tr><td class="grey bold">SO ORP ' + props.n.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey"><i>' + props.k + '</i></td><td class="right grey">&nbsp;</td></tr>';
      if (rok == "2017") {
        t += '<tr><td class="poradi">Pořadí ORP <span class="netucne">(1 = nejhorší)</span></td><td class="right poradi">' + props["pjo" + rok.slice(2, 4) + "p"] + ' z 206</td></td>';
      }
    } else if (valUj == "obce") {
      t = '<table><tr><td class="grey bold">obec ' + props.b.toUpperCase() + '</td><td class="right grey bold">' + rok + '</td></tr>' +
        '<tr><td class="grey"><i>okres ' + props.r + ', ' + props.k + '</i></td><td class="right grey">&nbsp;</td></tr>';
    }
    t += '<tr><td>Exekučně vymáhaná jistina</td><td class="right">' + props["c" + rok.slice(2, 4)].toLocaleString('cs-CZ', {
        maximumFractionDigits: 0
      }) + ' Kč</td></tr>' +
      '<tr><td class="vybrano">Průměrná jistina na osobu</td><td class="right vybrano">' + nulaToNeposkytnuto(props["c" + rok.slice(2, 4)] / props[POI + rok.slice(2, 4)]) + ' Kč</td></tr>';
    if (rok == "2017") {
      t += '<tr><td>Medián jistiny na osobu</td><td class="right">' + (props["m" + rok.slice(2, 4)]).toLocaleString('cs-CZ', {
        maximumFractionDigits: 0
      }) + ' Kč</td></tr>';
    }
    t += '<tr><td>Průměrná jistina na exekuci</td><td class="right">' + nulaToNeposkytnuto(props["c" + rok.slice(2, 4)] / props["pe" + rok.slice(2, 4)]) + ' Kč</td></tr>';
  } else if (valIndi == "poi_change") {
    if (valUj == "kraje") {
      t = '<table><tr><td class="grey bold">' + props.k.toUpperCase() + '</td><td class="right grey bold">2017</td><td class="right grey bold">2016</td><td class="right grey bold">změna</td></tr>';
    } else if (valUj == "okresy") {
      t = '<table><tr><td class="grey bold">okres ' + props.r.toUpperCase() + '</td><td class="right grey bold">2017</td><td class="right grey bold">2016</td><td class="right grey bold">změna</td></tr>' +
        '<tr><td class="grey"><i>' + props.k + '</i></td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td></tr>';
    } else if (valUj == "orp") {
      t = '<table><tr><td class="grey bold">SO ORP ' + props.n.toUpperCase() + '</td><td class="right grey bold">2017</td><td class="right grey bold">2016</td><td class="right grey bold">změna</td></tr>' +
        '<tr><td class="grey"><i>' + props.k + '</i></td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td></tr>';
    } else if (valUj == "obce") {
      t = '<table><tr><td class="grey bold">obec ' + props.b.toUpperCase() + '</td><td class="right grey bold">2017</td><td class="right grey bold">2016</td><td class="right grey bold">změna</td></tr>' +
        '<tr><td class="grey"><i>okres ' + props.r + ', ' + props.k + '</i></td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td><td class="right grey">&nbsp;</td></tr>';
    }

    t += '<tr><td class="vybrano">Počet osob v exekuci</td><td class="right vybrano">' + nulaToNeposkytnuto(props[POI08]) + '</td><td class="right vybrano">' + nulaToNeposkytnuto(props[POI6]) + '</td>';
    if ((props[POI08] - props[POI6]) >= 0) {
      t += '<td class="right red vybrano">+';
    } else {
      t += '<td class="right green vybrano">'
    }
    t += nulaToNeposkytnuto((props[POI08] / props[POI6] - 1) * 100, 1) + ' % ('
    if ((props[POI08] - props[POI6]) >= 0) {
      t += '+';
    }
    t += nulaToNeposkytnuto(props[POI08] - props[POI6]) + ' osob)</td>';
    t += '<tr><td>Podíl osob v exekuci</td><td class="right">' + nulaToNeposkytnuto(props[POI08] * 100 / props["o"], 2) + '% </td><td class="right">' + nulaToNeposkytnuto(props[POI6] * 100 / props["o"], 2) + '% </td>';
    if ((props[POI08] - props[POI6]) >= 0) {
      t += '<td class="right red">+';
    } else {
      t += '<td class="right green">'
    }
    t += nulaToNeposkytnuto((props[POI08] - props[POI6]) * 100 / props["o"], 2) + ' p.b.</td></tr>' +
      '<tr><td>Celkový počet exekucí</td><td class="right">' + nulaToNeposkytnuto(props["pe7"]) + '</td><td class="right">' + nulaToNeposkytnuto(props["pe6"]) + '</td>';
    if ((props["pe7"] - props["pe6"]) >= 0) {
      t += '<td class="right red">+';
    } else {
      t += '<td class="right green">'
    }
    t += nulaToNeposkytnuto((props["pe7"] / props["pe6"] - 1) * 100, 1) + ' % (';
    if ((props["pe7"] - props["pe6"]) >= 0) {
      t += '+';
    }
    t += nulaToNeposkytnuto(props["pe7"] - props["pe6"]) + ' exekucí)</td></tr>' +
      '<tr><td>Průměrný počet exekucí na osobu</td><td class="right">' + nulaToNeposkytnuto(props["pe7"] / props[POI08], 1) + '</td><td class="right">' + nulaToNeposkytnuto(props["pe6"] / props[POI6], 1) + '</td>';
    if (nulaToNeposkytnuto(props["pe7"] / props[POI08], 3) >= nulaToNeposkytnuto(props["pe6"] / props[POI6], 3)) {
      t += '<td class="right red">+';
    } else {
      t += '<td class="right green">';
    }
    t += nulaToNeposkytnuto(((props["pe7"] / props[POI08]) / (props["pe6"] / props[POI6]) - 1) * 100, 1) + ' % (';
    if ((props["pe7"] / props[POI08]) >= (props["pe6"] / props[POI6])) {
      t += '+';
    }
    t += nulaToNeposkytnuto((props["pe7"] / props[POI08]) - (props["pe6"] / props[POI6]), 1) + ')</td></tr>';
  }


  t += '<tr></table>';
  return t;
}


var comparing = L.control({
  position: 'bottomleft'
});


comparing.onAdd = function(map) {
  isComparing = true;
  this._div = L.DomUtil.create('div', 'porov info');
  this._div.innerHTML = '';
  return this._div;
};

comparing.onRemove = function(map) {
  isComparing = false;
};

comparing.update = function() {
  if (isComparing) {

    comparing._div.innerHTML = '';
    if (comparingList.length > 0) {
      var div = L.DomUtil.create('div', 'uj');
      if (valUj == "kraje") {
        heading = '<b>Kraj ' + rok + '</b><br />';
      } else if (valUj == "okresy") {
        heading = '<b>Okres ' + rok + '</b><br /><br />';
      } else if (valUj == "orp") {
        heading = '<b>SO ORP ' + rok + '</b><br /><br />';
      } else if (valUj == "obce") {
        heading = '<b>Obec ' + rok + '</b><br /><br /><br />';
      }

      t = heading + '<b>podíl osob v exekuci</b>'
      if (rok == "2017") {
        t += '<br />meziroční změna počtu osob v exekuci';
      }
      t += '<br />průměrný počet exekucí na osobu';
      t += '<br />průměrná jistina na osobu<br />';
      if (rok == "2017") {
        t += '<div class="maly_detail"><div class="struktura"><u>detail osob v exekuci</u></div>' +
          'podíl osob se 3 a více exekucemi' + '<br />podíl seniorů v exekuci </div>';
      } else {
        t += '<div class="maly_detail"></div>';
      }

      t += '<div class="plny_detail">';
      if (rok == "2017") {
        t += 'medián jistiny na osobu<br />';
      }
      t += 'počet osob starších 15 let<br />' +
        'počet osob v exekuci<br />' +
        'celkový počet exekucí<br />';
      if (rok == "2017") {

        t+='<div class="struktura"><u>detail osob v exekuci</u></div>' +
        '<div class="struktura">podíl dětí a mladistvých<br />' +
        'podíl osob ve věku 18 až 29 let<br />' +
        'podíl seniorů (65+)</div>' +
        '<div class="struktura">podíl osob s 1 exekucí<br />' +
        'podíl osob s 2 exekucemi<br />' +
        'podíl osob s 3 – 9 exekucemi<br />' +
        'podíl osob s 10 – 29 exekucemi<br />' +
        'podíl osob s 30 a více exekucemi</div>';
      }
      t += '</div><div class="struktura"><a id="detailLink" onclick="toggleDetail()" href="#">Zobrazit detailní údaje</a></div></div>';
      div.innerHTML = t;
      comparing._div.appendChild(div);
      for (var i = 0; i < comparingList.length; i++) {
        var new_uj = makeDivInfo(comparingList[i], i);
        comparing._div.appendChild(new_uj);
        if (detail) {
          $(".maly_detail").hide();
          $(".plny_detail").show();
          $("#detailLink").text("Skrýt detailní údaje");
        } else {
          $(".maly_detail").show();
          $(".plny_detail").hide();
          $("#detailLink").text("Zobrazit detailní údaje");
        }
      }
    }
  }
};

$('#uzemi').on('change', function() {
  map.spin(false);
  map.spin(true);
  v = $('input[name=uj]:checked', '#uzemi').val();
  if (v == "auto") {
    autoLayer = true;
    valUj = $("#uj_auto").html();
    switchMap();
  } else {
    autoLayer = false;
    valUj = v;
    switchMap();
  }
  map.spin(false);

});

$('#hodnota').on('change', function() {
  map.spin(false);
  map.spin(true);
  valIndi = $('input[name=indi]:checked', '#hodnota').val();
  lyr.eachLayer(function(layer) {
    layer._tooltip.setContent(generateTooltip(layer.feature))
  });

  legendUpdate();
  lyr.setStyle(style);
  map.spin(false);
});

function toggleRight() {
  $("#right").toggle(200);
  $("#arrow_right").toggle(200);
  $("#arrow_left").toggle(200);
}

$('.year').click(function(e) {

  map.spin(false);
  map.spin(true);
  $('.year').css('font-weight', 'normal');
  $('.year').css('font-size', '18px');
  $('.year').css('text-decoration', 'none');
  $('.year').css('border-bottom', '0px');
  $('.year.change').css('font-size', '12px');
  $(this).css('font-weight', 'bold');
  if ($(this).attr("class") == "year change") {
    $(this).css('font-size', '16px');
  } else {
    $(this).css('font-size', '24px');
  }

  $(this).css('border-bottom', '5px solid #91375E');
  rok = $(this).attr("title");
  if (rok == "2017") {
    $('#rad_poi').attr('disabled', false);
    $('#rad_poi_poe').attr('disabled', false);
    $('#rad_poi_change').attr('disabled', false);
  } else if (rok == "2016") {
    $('#rad_poi').attr('disabled', false);
    $('#rad_poi_poe').attr('disabled', false);
    $('#rad_poi_change').attr('disabled', true);
  }
  if ($('input[name=indi]:checked', '#hodnota').attr('disabled')) {

    $('#rad_poe').prop('checked', true);
    valIndi = $('input[name=indi]:checked', '#hodnota').val();
    legendUpdate();

    alert("Pro danou kombinaci neexistují data");
  };
  comparingList = [];
  comparing.update();
  comparing.remove();
  lyr.setStyle(style);
  lyr.eachLayer(function(layer) {
    layer._tooltip.setContent(generateTooltip(layer.feature))
  });
  map.spin(false);
});

$('#sipka').on("click", function() {
  toggleRight();
});

map.on("zoomend", function(e) {
  zoom = map.getZoom();
  if (zoom < 8) {
    v = "kraje";
    title = "kraje";
  } else if (zoom < 9) {
    v = "okresy";
    title = "okresy";
  } else if (zoom < 11) {
    v = "orp";
    title = "ORP";
  } else {
    v = "obce";
    title = "obce";
  }
  $("#uj_auto").html(title);
  if (autoLayer) {

    valUj = v;
    switchMap();
  }
});
