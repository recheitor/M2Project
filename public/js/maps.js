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

function renderMap() {
    myMap = new google.maps.Map(
        document.querySelector('#map'),
        { zoom: 15, center: initialCoords }
    )
    service = new google.maps.places.PlacesService(myMap);
    for (const keyword of keywords) {
        const request = {
            location: new google.maps.LatLng(initialCoords),
            radius: 7000,
            type: "restaurant",
            keyword: keyword,
        }

        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (const place of results) {
                    const marker = new google.maps.Marker(
                        {
                            position: place.geometry.location,
                            map: myMap,
                            title: place.name,
                            icon: "images/marker.png"
                        })

                    marker.addListener('click', () => {
                        infowindow.setContent(`<img src='${place.photos[0].getUrl({ maxWidth: 250, maxHeight: 200 })}' alt='No image'><br><strong>${place.name}</strong><br>${place.vicinity}<br>Rating: ${place.rating}`);
                        infowindow.open(myMap, marker);
                    })
                }
            }
        })
    }
}


function autoComplete() {
    const autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("autocomplete")
    );
    autocomplete.addListener('place_changed', () => {
        const selectedPlace = autocomplete.getPlace()

        serviceSel = new google.maps.places.PlacesService(myMap)

        for (const keyword of keywords) {
            const request = {
                location: selectedPlace.geometry.location,
                radius: 7000,
                type: "restaurant",
                keyword: keyword,
            };
            serviceSel.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (const selectedPlace of results) {
                        const marker = new google.maps.Marker({
                            position: selectedPlace.geometry.location,
                            map: myMap,
                            title: selectedPlace.name,
                            icon: "images/marker.png",
                        })
                        myMap.setCenter(selectedPlace.geometry.location)
                        marker.addListener('click', () => {
                            infowindow.setContent(`<img src='${selectedPlace.photos[0].getUrl({ maxWidth: 250, maxHeight: 200 })}' alt='No image'><br><strong>${selectedPlace.name}</strong><br>${selectedPlace.vicinity}<br>Rating: ${selectedPlace.rating}`);
                            infowindow.open(myMap, marker);
                        })
                    }
                }
            })
        }
    })
}












