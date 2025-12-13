        mapboxgl.accessToken = mapToken;
        console.log(mapToken);
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            center:   // starting position [lng, lat]. Note that lat must be set between -90 and 90
            zoom: 12 // starting zoom
            });
