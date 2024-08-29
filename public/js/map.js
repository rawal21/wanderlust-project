 // Replace 'YOUR_API_KEY' with your actual TomTom API key
 
 

 // Initialize the map
 function initMap() {
   // Create a new map instance
   const map = tt.map({
     key: apiKey,
     container: 'map',
     // style: 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.1/maps/style/basic-main.json'
   });

   // Set the center and zoom level
   map.setCenter(listing.goemetry.coordinates), // Replace with desired coordinates
   map.setZoom(9); // Set zoom level

 

  //  Optionally, add a marker
   new tt.Marker({color : "red"}).setLngLat(listing.goemetry.coordinates).addTo(map);


   const popup = new tt.Popup()
   .setHTML(`<h1${listing.location}</h1><p>exact location provided after booking </p>`);

// Attach the popup to the marker
    marker.setPopup(popup);

// Optionally, open the popup immediately
popup.addTo(map);
 }

 // Initialize the map when the page loads
 window.onload = initMap;