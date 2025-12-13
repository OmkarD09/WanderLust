        mapboxgl.accessToken = mapToken;

        const map = new mapboxgl.Map({
            container: 'map', // container ID
            center: JSON.parse(coordinates), // starting position [lng, lat]. Note that lat must be set between -90 and 90
            zoom: 12 // starting zoom
            });
            

            const marker = new mapboxgl.Marker( {color: 'red'})
            .setLngLat(JSON.parse(coordinates))
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML(
                    `<h5>${ listingLocation }</h5><p> Welcome to WanderLust </p>`
                )
            )
            .addTo(map);
