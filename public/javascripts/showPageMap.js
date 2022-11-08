mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: group.geometry.coordinates, // starting position [lng, lat]
    zoom: 5 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

new mapboxgl.Marker()
    .setLngLat(group.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${group.title}</h3><p>${group.location}</p>`
        )
    )
    .addTo(map);

