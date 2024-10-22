if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const path = require("path");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
let MAPTOKEN = 'pk.eyJ1IjoidGVqYXMwMTAxIiwiYSI6ImNseXZjaG8ydjFmNjYyaXFsc2IyaWZhcDYifQ.sWbJnDj1kESUEG237t0TFA';
const geocodingClient = mbxGeoCoding({accessToken : MAPTOKEN});
const API_KEY = "AIzaSyBtEiZjHeDsSQLqSR7hFGluQMLUWTZqNaw";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(API_KEY);
//==============================================================================================================================================================================
async function run(past, future) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    let futureWeather = future;
    let pastWeather = past
    const prompt = `My city name is mumbai. The latest weather data for my city shows 
    future 15 days data ${futureWeather}, and past three month weather data is ${pastWeather} and soil data of my farm is phosporous ppm ${23}, nitrogetn ppm ${45}, potassium ppm ${23}, ph ${"slightly acidic 6 to 6.5"} and moister ppm ${23} % and soil type ${"Desert Soil"} and water availablity of my farm is ${"Low availablity"}. Give me unique crops that are not generally farmed by farmers, with market price in rupees and give me at least 10. Also, give me names of crops which are not generally used in Indian traditional farming but are unique and suitable for the environment description include crop its benifits and in breif. Respond strictly in the following JSON format: {...}`;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        // Strip out anything before the first `{` and after the last `}`
        const jsonText = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);

        // Try parsing the JSON
        let crops = null;
        try {
            crops = JSON.parse(jsonText).unique_crops;  // Changed from 'recommended_crops' to 'unique_crops'
        } catch (error) {
            console.error("Failed to parse JSON:", error);
        }

        // Check if unique_crops is valid
        if (!crops || !Array.isArray(crops)) {
            throw new Error("The response does not contain 'unique_crops' in the expected format.");
        }
        console.log(crops);
        return crops;
    } catch (error) {
        console.error("Error generating crops:", error);
    }
}

app.set("view engine", "ejs");
app.set("Views", path.join(__dirname, "/Views"));
app.use(express.static('Public'))

// handel post request 
app.use(express.urlencoded({extended: true}));


//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Weather Calculation Function 
// Functions to Return Past Three month weather and forcast future 16 days weather is Ready here it aslo returns some soil data in that 
let getAveragedata = (arr) => {
    let len = arr.length;
    let sum = 0;
    for( a of arr){
        sum += a;
    }
    return  sum / len;
}
let futureWeather;
let pastThreeMonths;
async function getWeatherPast (lati, long) {
    let weather = await fetch(`https://historical-forecast-api.open-meteo.com/v1/forecast?latitude=${lati}&longitude=${long}&start_date=2024-09-20&end_date=2024-10-03&hourly=temperature_2m,relative_humidity_2m,surface_pressure,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,wind_speed_10m,soil_temperature_0cm,soil_temperature_54cm,soil_moisture_0_to_1cm,soil_moisture_27_to_81cm&daily=uv_index_max,uv_index_clear_sky_max`);
    let data = await weather.json();


    // Create objects for each parameter
    pastThreeMonths = {
        temperature2m: getAveragedata(data.hourly.temperature_2m),
        relativeHumidity2m: getAveragedata(data.hourly.relative_humidity_2m),
        surfacePressure: getAveragedata(data.hourly.surface_pressure),
        cloudCover: getAveragedata(data.hourly.cloud_cover),
        cloudCoverLow: getAveragedata(data.hourly.cloud_cover_low),
        cloudCoverMid: getAveragedata(data.hourly.cloud_cover_mid),
        cloudCoverHigh: getAveragedata(data.hourly.cloud_cover_high),
        windSpeed10m: getAveragedata(data.hourly.wind_speed_10m),
        soilTemperature0cm: getAveragedata(data.hourly.soil_temperature_0cm),
        soilTemperature54cm: getAveragedata(data.hourly.soil_temperature_54cm),
        soilMoisture0To1cm: getAveragedata(data.hourly.soil_moisture_0_to_1cm),
        soilMoisture27To81cm: getAveragedata(data.hourly.soil_moisture_27_to_81cm),
        uvIndexMax: getAveragedata(data.daily.uv_index_max),
        uvIndexClearSkyMax: getAveragedata(data.daily.uv_index_clear_sky_max)
    };

    return pastThreeMonths;
}

async function getWeatherFuture(lati, long) {
    let weatherFuture = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lati}&longitude=${long}&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,precipitation_probability,precipitation,rain,showers,pressure_msl,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,evapotranspiration,wind_speed_10m,wind_speed_180m,wind_direction_80m,wind_direction_180m,temperature_80m,temperature_180m,soil_temperature_0cm,soil_temperature_54cm,soil_moisture_0_to_1cm,soil_moisture_27_to_81cm&daily=temperature_2m_max,temperature_2m_min,sunrise,sunshine_duration,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,wind_speed_10m_max,wind_direction_10m_dominant&timezone=GMT&past_days=1&forecast_days=16`);
    let dataFuture = await weatherFuture.json();

  
    // Create objects for each parameter with averages
    futureWeather = {
      temperature2m:  getAveragedata(dataFuture.hourly.temperature_2m),
      relativeHumidity2m: getAveragedata(dataFuture.hourly.relative_humidity_2m),
      precipitationProbability: getAveragedata(dataFuture.hourly.precipitation_probability),
      windSpeed10m: getAveragedata(dataFuture.hourly.wind_speed_10m),
      cloudCover: getAveragedata(dataFuture.hourly.cloud_cover),
      uvIndexMax:getAveragedata(dataFuture.daily.uv_index_max),
      temperature2mMax:getAveragedata(dataFuture.daily.temperature_2m_max),
      temperature2mMin:getAveragedata(dataFuture.daily.temperature_2m_min)
    };
  
    return futureWeather;
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


app.get("/",  (req, res) => {
    res.render('index.ejs');
});


// weather data route
//=========================================================================================================================================================================================================
app.post("/submit",  async (req, res) => {
    // let assume that for this route user entered data
    console.log(req.body);
    let cityname = req.body.cityname;
     console.log(cityname);
    let response = await geocodingClient.forwardGeocode({
        query : cityname,
        limit : 1,
    }).send();
    latitude = response.body.features[0].geometry.coordinates[0];
    longitude = response.body.features[0].geometry.coordinates[1];
    let futureWeather = await getWeatherFuture(latitude, longitude);
    let pastWeather = await getWeatherPast(latitude, longitude);
    let data = await run(pastThreeMonths, futureWeather);
    if(data == undefined){
        res.send("Something Went Wrong")
    }else{
        console.log(data);    
        res.json(data);
    }
    
});

//===============================================================================================================================================================================================

app.listen(8080, ()=>{
    console.log("Server is Listening ");
});