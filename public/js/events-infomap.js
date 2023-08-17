const lat = document.querySelector('#lat')
const lng = document.querySelector('#lng')

const initialCoords = { lat: Number(lat.value), lng: Number(lng.value) }
let eventMap
function initMap() {
    renderMap()
    printMarkers()
}
function renderMap() {
    eventMap = new google.maps.Map(
        document.querySelector('#map'),
        { zoom: 15, center: initialCoords, styles: mapStyles }
    )
}

function printMarkers() {

    new google.maps.Marker({
        position: initialCoords,
        map: eventMap,
    })

}