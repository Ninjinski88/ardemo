var userPostion = {
    latitude:  null,
    longitude: null
};

var objectPostion = {
    //yem 
    //lat:  51.5778478
    //long: -0.2431372
    lat:  51.5778478,//51.5966848,
    lng: -0.2431372,//-0.2268827,
};

window.onload = () => {
    const button = document.querySelector('button[data-action="change"]');
    button.innerText = '!';

    getLocation();
    let places = staticLoadPlaces();
    renderPlaces(places);
    
};


function staticLoadPlaces() {
    //location of the object
    return [
        {
            name: 'Sunny Hill bird',
            location: objectPostion
        },
    ];
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    err = "Geolocation is not supported by this browser.";
    alert(err);
  }
}

function showPosition(position) {
    userPostion.latitude = position.coords.latitude;
    userPostion.longitude = position.coords.longitude;
}

///CALCULATE THE DISTANCE BETWEEN THE USER AND THE OBJECT
//This function takes in latitude and longitude of two location and returns the shortest distance between them(in km)
    function calcCrow(lat1, lon1, lat2, lon2){
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }

    // Converts numeric degrees to radians
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }

///-------------------

var models = [
    {
        url: './assets/articuno/scene.gltf',
        scale: '0.2 0.2 0.2',
        rotation: '0 90 0',
        info: 'Sunny hill bird',
     }
];

var modelIndex = 0;
var setModel = function (model, entity) {
    if (model.scale) {
        entity.setAttribute('scale', model.scale);
    }

    if (model.rotation) {
        entity.setAttribute('rotation', model.rotation);
    }

    if (model.position) {
        entity.setAttribute('position', model.position);
    }

    entity.setAttribute('gltf-model', model.url);

    const div = document.querySelector('.instructions');
    div.innerText = model.info;
};

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;

        let model = document.createElement('a-entity');
        model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);

        setModel(models[modelIndex], model);

        model.setAttribute('animation-mixer', '');

        document.querySelector('button[data-action="change"]').addEventListener('click', function () {
            var entity = document.querySelector('[gps-entity-place]');
            modelIndex++;
            var newIndex = modelIndex % models.length;
            setModel(models[newIndex], entity);

            //show the distance to object
            alert("distance to to Sunny Hill bird is " + calcCrow(userPostion.latitude, userPostion.longitude, objectPostion.lat, objectPostion.lng) + " KM")
        });

        scene.appendChild(model);
    });
}