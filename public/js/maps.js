const initialCoords = { lat: 40.416883396122685, lng: -3.7032626690353565 };
let myMap;
let service;
let infowindow;
const keywords = ["pizzeria", "pizza", "ristorante italiano", "italiano"];
function initMap() {
    renderMap();
    autoComplete();
    infowindow = new google.maps.InfoWindow();
}
//renderiza la mapa
function renderMap() {
    myMap = new google.maps.Map(
        document.querySelector('#map'),
        { zoom: 15, center: initialCoords }
    );
    service = new google.maps.places.PlacesService(myMap);
    for (const keyword of keywords) {
        const request = {
            location: new google.maps.LatLng(initialCoords),
            radius: 5000,
            type: "restaurant",
            keyword: keyword,
        };
        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (const place of results) {
                    const marker = new google.maps.Marker({
                        position: place.geometry.location,
                        map: myMap,
                        title: place.name,
                        // icon: photos[0].getUrl({ maxWidth: 35, maxHeight: 35 })
                    });
                    //info de los markers
                    marker.addListener('click', () => {
                        infowindow.setContent(`<strong>${place.name}</strong><br>${place.vicinity}<br>Rating: ${place.rating}`);
                        infowindow.open(myMap, marker);
                    });
                }
            }
        });
    }
}
function autoComplete() {
    const autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("autocomplete")
    );
    autocomplete.addListener('place_changed', () => {
        const selectedPlace = autocomplete.getPlace();
        // Qui puoi fare qualcosa con il luogo selezionato, ad esempio visualizzarlo sulla mappa
        const marker = new google.maps.Marker({
            position: selectedPlace.geometry.location,
            map: myMap,
            title: selectedPlace.name,
        });
        myMap.setCenter(selectedPlace.geometry.location);
        infowindow.setContent(`<strong>${selectedPlace.name}</strong><br>${selectedPlace.formatted_address}<br>Rating: ${selectedPlace.rating}`);
        infowindow.open(myMap, marker);
    });
}












