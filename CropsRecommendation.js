// const API_KEY = "AIzaSyBtEiZjHeDsSQLqSR7hFGluQMLUWTZqNaw";
const API_KEY = "AIzaSyA2I4VwyBBeie0AfmooqKbFfSgi883C5IU"
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(API_KEY);

// Pexels API setup
const { createClient } = require('pexels');
const pexelsClient = createClient('o7mDypLDYkYp8ffOUObm3H0XzzPAQrXPd7uhSwsAUCqdFkdCajyY9dMW');

// Function to get image URL from Pexels based on crop name
async function getImage(name) {
    const query = name + " fruit";
    try {
        const photos = await pexelsClient.photos.search({ query, per_page: 1 });
        const id = photos.photos[0].id;
        const image = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`;
        return image;
    } catch (err) {
        console.error('Error fetching photos:', err);
        return "https://icrier.org/wp-content/uploads/2022/12/media-Event-Image-Not-Found.jpg";
    }
}

// Main function to generate crop recommendations and add images
async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    let futureWeather = {
        temperature2m: 5.462254901960784,
        relativeHumidity2m: 78.48039215686275,
        precipitationProbability: 34.47303921568628,
        windSpeed10m: 29.09950980392157,
        cloudCover: 80.76960784313725,
        uvIndexMax: 0.138235294117647,
        temperature2mMax: 6.276470588235294,
        temperature2mMin: 4.435294117647057
      }

    let pastWeather = {
        temperature2m: 5.522619047619048,
        relativeHumidity2m: 76.4375,
        surfacePressure: 1005.4589285714288,
        cloudCover: 94.47916666666667,
        cloudCoverLow: 45.961309523809526,
        cloudCoverMid: 58.31845238095238,
        cloudCoverHigh: 0,
        windSpeed10m: 31.074404761904766,
        soilTemperature0cm: 8.481845238095243,
        soilTemperature54cm: 8.995535714285722,
        soilMoisture0To1cm: 0,
        soilMoisture27To81cm: 0,
        uvIndexMax: 0.7392857142857142,
        uvIndexClearSkyMax: 1.1678571428571427
      }
    const prompt = `My city name is mumbai. The latest weather data for my city shows 
    future 15 days data ${futureWeather}, and past three month weather data is ${pastWeather} and soil data of my farm is phosporous ppm ${23}, nitrogetn ppm ${45}, potassium ppm ${23}, ph ${"slightly acidic 6 to 6.5"} and moister ppm ${23} % and soil type ${"Desert Soil"} and water availablity of my farm is ${"Low availablity"}. Give me unique crops that are not generally farmed by farmers, with market price in rupees and give me at least 10. Also, give me Minglish names and give me names of crops which are not generally used in Indian traditional farming but are unique and suitable for the environment. Respond strictly in the following JSON format: {...}`;
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

        // Add image to each crop by calling the getImage function
        const cropsWithImages = await Promise.all(
            crops.map(async (crop) => {
                const image = await getImage(crop.name);  // Use 'name' instead of 'crop_name'
                return { ...crop, image };
            })
        );

        // Print the final object with crops including image URLs
        console.log(cropsWithImages);
        
    } catch (error) {
        console.error("Error generating crops:", error);
    }
}

run();

