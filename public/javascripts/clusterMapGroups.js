mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'cluster-map-groups',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [-82.5517, 35.5950],
    zoom: 8
});

map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

map.addControl(
    new MapboxGeocoder({
    accessToken: mapToken,
    mapboxgl: mapboxgl
    })
    );
 
map.on('load', () => {
// Add a new source from our GeoJSON data and
// set the 'cluster' option to true. GL-JS will
// add the point_count property to your source data.
map.addSource('groups', {
    type: 'geojson',
    // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
    // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
    data: groups,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
});
// map.addSource('users', {
//     type: 'geojson',
//     // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
//     // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
//     data: users,
//     cluster: true,
//     clusterMaxZoom: 14, // Max zoom to cluster points on
//     clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
// });
 
map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'groups',
    filter: ['has', 'point_count'],
    paint: {
        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        'circle-color': [
            'step',
            ['get', 'point_count'],
            '#2962FF',
            10,
            '#b100ff',
            30,
            '#00E676'
        ],
        'circle-radius': [
            'step',
            ['get', 'point_count'],
            15,
            10,
            20,
            30,
            30
        ]
    }
});
 
map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'groups',
    filter: ['has', 'point_count'],
    layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
    }
});
 
map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'groups',
    filter: ['!', ['has', 'point_count']],
    paint: {
        'circle-color': '#00E676',
        'circle-radius': 7,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#F50057'
    }
});
 
// inspect a cluster on click
map.on('click', 'clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
    layers: ['clusters']
});
const clusterId = features[0].properties.cluster_id;
map.getSource('groups').getClusterExpansionZoom(
    clusterId,
    (err, zoom) => {
        if (err) return;
        
        map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom
        });
    }
);
});
 
// When a click event occurs on a feature in
// the unclustered-point layer, open a popup at
// the location of the feature, with
// description HTML from its properties.
map.on('click', 'unclustered-point', (e) => {
    console.log(e.features[0])
    const { popUpMarkup } = e.features[0].properties;

    const coordinates = e.features[0].geometry.coordinates.slice();
    
    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}
 
new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(popUpMarkup)
    .addTo(map);
});

map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';
});
});


// how do I add search in map?
// map.addControl(
//     new MapboxGeocoder({
//       accessToken: mapboxgl.accessToken,
//       mapboxgl: mapboxgl
//     }), 'top-right'
// );