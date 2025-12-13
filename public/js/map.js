        mapboxgl.accessToken = mapToken;

        const map = new mapboxgl.Map({
            container: 'map', // container ID
            center: JSON.parse(coordinates), // starting position [lng, lat]. Note that lat must be set between -90 and 90
            zoom: 12 // starting zoom
            });
            

            const marker = new mapboxgl.Marker( {color: 'red'})
            .setLngLat(JSON.parse(coordinates))
            .addTo(map);
