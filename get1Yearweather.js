const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
let latitude;
let longitude
const mapToken = 'pk.eyJ1IjoidGVqYXMwMTAxIiwiYSI6ImNseXZjaG8ydjFmNjYyaXFsc2IyaWZhcDYifQ.sWbJnDj1kESUEG237t0TFA';
const weatherToken = '0af979fdc28f0ea1eb074f789a5a8735';
const geocodingClient = mbxGeoCoding({accessToken : mapToken});

let gangu = async ()=>{

let response = await geocodingClient.forwardGeocode({
    query : 'Mumbai',
    limit : 1,
}).send();

console.log(response);
console.log(response.body.features[0].geometry.coordinates);
latitude = response.body.features[0].geometry.coordinates[0];
longitude = response.body.features[0].geometry.coordinates[1];
console.log("lat = ", latitude, "long = ", longitude);
getWeatherMonth(latitude, longitude);
}

gangu();

let getWeatherMonth = async (latitude, longitude)=>{
    let lat = latitude;
    let lon = longitude;
    let response = await fetch(`https://pro.openweathermap.org/data/2.5/forecast/climate?lat=${lat}&lon=${lon}&appid=${weatherToken}}`);
    let  data = await response.json();
    console.log(data);

}



