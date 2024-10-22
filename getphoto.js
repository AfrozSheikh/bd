// Import the Pexels package
const { createClient } = require('pexels');  // Corrected package import

// Set up the Pexels client with your API key
const client = createClient('o7mDypLDYkYp8ffOUObm3H0XzzPAQrXPd7uhSwsAUCqdFkdCajyY9dMW');

// Define the query for the crop you're searching for
const query = "Sea Buckthorn";

// Perform the photo search and handle the response
client.photos.search({ query, per_page: 1 })
    .then(photos => {
        // Log the photos object to view the search results
        let id = photos.photos[0].id;
        console.log( id);
        const image = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`
        console.log(image);
    })
    .catch(err => {
        // Handle any errors that occur during the request
        console.error('Error fetching photos:', err);
    });
