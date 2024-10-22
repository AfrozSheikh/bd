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
async function getWeatherPast () {
    let weather = await fetch("https://historical-forecast-api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&start_date=2024-09-20&end_date=2024-10-03&hourly=temperature_2m,relative_humidity_2m,surface_pressure,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,wind_speed_10m,soil_temperature_0cm,soil_temperature_54cm,soil_moisture_0_to_1cm,soil_moisture_27_to_81cm&daily=uv_index_max,uv_index_clear_sky_max");
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



async function getWeatherFuture() {
    let weatherFuture = await fetch('https://api.open-meteo.com/v1/forecast?latitude=19.076&longitude=72.8777&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,precipitation_probability,precipitation,rain,showers,pressure_msl,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,evapotranspiration,wind_speed_10m,wind_speed_180m,wind_direction_80m,wind_direction_180m,temperature_80m,temperature_180m,soil_temperature_0cm,soil_temperature_54cm,soil_moisture_0_to_1cm,soil_moisture_27_to_81cm&daily=temperature_2m_max,temperature_2m_min,sunrise,sunshine_duration,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,wind_speed_10m_max,wind_direction_10m_dominant&timezone=GMT&past_days=1&forecast_days=16');
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

