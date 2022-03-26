places.sort(function (a, b) {
    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
});


countriesMenu.addEventListener('change', (event) => {
    input.value = '';
    if (event.target.value === 'wales') {
        regionsSection.classList.add('hidden');
        placesSection.classList.remove('hidden');
        placesMenu.innerHTML = `
            <option value="">Choose a place in Wales</option>
        `;
        for (let place of places) {
            if (place.country === 'Wales') {
                const option = document.createElement('option');
                option.setAttribute('value', place.code);
                option.innerHTML = place.name;
                placesMenu.appendChild(option);
            };
        };
    } else if (event.target.value === 'england') {
        regionsSection.classList.remove('hidden');
        placesSection.classList.add('hidden');
        regionsMenu.innerHTML = `
        <option value="">Choose a region of England</option>
        `;
        for (let region of regions) {
            const option = document.createElement('option');
            option.setAttribute('value', region.value);
            option.innerHTML = region.name;
            regionsMenu.appendChild(option);
        };
        placesMenu.innerHTML = `
            <option value=""></option>
        `;
    } else {
        regionsSection.classList.add('hidden');
        placesSection.classList.add('hidden');
        placesMenu.innerHTML = `
            <option value=""></option>
        `;
    };
});

regionsMenu.addEventListener('change', (event) => {
    input.value = '';
    const selectedRegion = event.target.value;
    const { name, value } = regions.find((region) => {
        return region.value === selectedRegion;
    });
    placesMenu.innerHTML = `
    <option value="">Choose a place in ${name}</option>
    <optgroup id="ua" label="Unitary Authorities"></group>
        `;
    for (let county of counties) {
        if (county.region === name) {
            const optgroup = document.createElement('optgroup');
            optgroup.setAttribute('id', county.id);
            optgroup.setAttribute('label', county.label);
            placesMenu.appendChild(optgroup);
        };
    };
    for (let place of places) {
        if (place.region === name) {
            if (place.county.length > 0) {
                const { label, id } = counties.find((county) => {
                    return county.label === place.county;
                });
                const option = document.createElement('option');
                option.setAttribute('value', place.code);
                option.innerHTML = place.name;
                document.querySelector(`#${id}`).appendChild(option);
            }
            else {
                const option = document.createElement('option');
                option.setAttribute('value', place.code);
                option.innerHTML = place.name;
                document.querySelector('#ua').appendChild(option);
            };
        };
    };
    placesSection.classList.remove('hidden');
});