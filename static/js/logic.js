
const API_KEY = "pk.eyJ1IjoibmVyb2phbi12YXJuYWt1bWFyIiwiYSI6ImNrZzViNjM4djB0MDcyeGwwaDJjdXNzaGoifQ.2yc8WH06ucS886L8bqMJEg";


var data = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

function createMap(markers) {

    
    var streetmap =  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      })

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "dark-v10",
        accessToken: API_KEY
    });

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-streets-v11",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap,
        "Satellite Map": satellitemap
      };
    
    var faultLine = new L.LayerGroup();

    d3.json(url, function (resposne) {

        L.geoJSON(resposne).addTo(faultLine)
    })

    var overlayMaps = {
        Earthquakes: markers,
        "Tectonic Plates" : faultLine
      };
    

    var myMap = L.map("map", {
        center: [29.2996437,1.832259],
        zoom: 3,
        layers: [satellitemap, markers, faultLine] 
    });

    
    L.control.layers(baseMaps,overlayMaps, {
        collapsed: false
      }).addTo(myMap);
    
  

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
      
          var div = L.DomUtil.create('div', 'info legend'),
              mag = [0, 1, 2, 3, 4, 5],
              labels = [];
      
          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < mag.length; i++) {
              div.innerHTML +=
                  '<i style="background:' + getColor(mag[i] + 1) + '"></i> ' +
                  mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
          }
      
          return div;
      };
      
      legend.addTo(myMap);

    
     

}
  



function getColor(mag) {

    var color = "";

        if (mag > 5) {
          color = "#ff0000";
        }
        else if (mag > 4) {
          color = "OrangeRed";
        }
        else if (mag > 3) {
          color = "orange";
        }
        else if (mag > 2) {
            color = "yellow";
        }

        else if (mag > 1) {
            color = "#9ACD32";
        }
        else {
          color = "green";
        }

    return color;
}



d3.json(data, function (data) {
    
   

    markers = []

    for (var i = 0; i < data.features.length; i++) {

        
        var color = getColor(data.features[i].properties.mag)
        
      
        
        
        var marker = L.circle(data.features[i].geometry.coordinates.slice(0,2).reverse(), {
          fillOpacity: data.features[i].properties.mag/6,
          stroke: false,
          color: color,
          fillColor: color,
          radius: data.features[i].properties.mag * 60000
        }).bindPopup("<h3>" + data.features[i].properties.place + "</h3> <hr> <h3>Magnitude: " + data.features[i].properties.mag + "</h3>");
      
        markers.push(marker)
    
    }

    

        createMap(L.layerGroup(markers))

    })

