const input = document.querySelector('input');
const countriesMenu = document.querySelector('#countries-menu');
const regionsSection = document.querySelector('#regions');
const regionsMenu = document.querySelector('#regions-menu');
const placesSection = document.querySelector('#places');
const placesMenu = document.querySelector('#places-menu');
const settingSection = document.querySelector('.setting');
const propertyStatusMenu = document.querySelector('#property-status');
const housePriceVariableMenu = document.querySelector('#house-price-variable');
const propertyTypeMenu = document.querySelector('#property-type');
const yearMenu = document.querySelector('#year');
const resultSection = document.querySelector('#result');

const fetchData = async (searchTerm) => {

    const { selectedPlace, selectedYear, selectedHousePriceVariable, selectedPropertyType, selectedPropertyStatus } = searchTerm;
    const response = await axios.get('https://api.beta.ons.gov.uk/v1/datasets/house-prices-local-authority');

    console.log(response.data);
    const latestRelease = response.data.links.latest_version.href;
    console.log(`Latest release rel: ${latestRelease}`);

    // const dataset = await axios.get('https://api.beta.ons.gov.uk/v1/code-lists/house-sales-and-prices/editions/one-off/codes', {
    //     params: {
    //         limit: 500,
    //         offset: 0
    //     }
    // });
    // console.log(dataset.data.items);

    const obs = await axios.get(`${latestRelease}/observations`, {
        params: {
            // limit: 300,
            // offset: 5000
            time: selectedYear, /* calendar-years */
            month: '*', /* mmm (mar, jun, sep, dec only) */
            geography: selectedPlace, /* administrative-geography */
            housesalesandprices: selectedHousePriceVariable, /* house-sales-and-prices */
            propertytype: selectedPropertyType, /* property-type */
            buildstatus: selectedPropertyStatus /* build-status */
        }
    });
    console.log(obs.data.observations);

    if (!obs.data.observations) {
        return [];
    };
    // return obs.data.observations;
    return {
        'dataObs': obs.data.observations,
        'responseData': response.data
    };
};

async function callResult(code) {
    resultSection.innerHTML = '<span class="material-icons-outlined loading">hourglass_bottom</span> Loading...';
    const searchTerm = {
        selectedPlace: `${code}`,
        selectedPropertyStatus: `${propertyStatusMenu.value}`,
        selectedHousePriceVariable: `${housePriceVariableMenu.value}`,
        selectedPropertyType: `${propertyTypeMenu.value}`,
        selectedYear: `${yearMenu.value}`
    };
    const { name, county, region, country } = places.find((place) => {
        return place.code === code;
    });
    const results = await fetchData(searchTerm);
    resultSection.innerHTML = `<h3>Result</h3>
    <table id="outcome">
    <thead><tr><th></th><th>${name}</th></tr></thead>
    <tbody><tr><td>Location</td><td><a href="http://statistics.data.gov.uk/atlas/resource?uri=http://statistics.data.gov.uk/id/statistical-geography/${code}" target="_blank"><p id="location"></p></a>
    </td></tr></tbody>
    </table>`;

    console.log(`Result ${results.dataObs}`);
    let finalResults = [];
    for (let result of results.dataObs) {
        let monthNum;
        if (result.dimensions.Month.id === 'mar') {
            monthNum = 3
        } else if (result.dimensions.Month.id === 'jun') {
            monthNum = 6
        } else if (result.dimensions.Month.id === 'sep') {
            monthNum = 9
        } else if (result.dimensions.Month.id === 'dec') {
            monthNum = 12
        }
        result = {
            monthNum: monthNum,
            month: result.dimensions.Month.id,
            obs: parseInt(result.observation)
        };
        finalResults.push(result);
    };

    finalResults.sort(function (a, b) {
        return a.monthNum - b.monthNum;
    });
    for (let finalResult of finalResults) {
        console.log(searchTerm.selectedHousePriceVariable);
        if (!isNaN(finalResult.obs)) {
            if (searchTerm.selectedHousePriceVariable === 'sales') {
                document.querySelector('#outcome').innerHTML += `<tr>
                <td class="capitalize">${finalResult.month} ${searchTerm.selectedYear}</td>
                <td>${finalResult.obs.toLocaleString()}</td>
                </tr>`;
            } else {
                document.querySelector('#outcome').innerHTML += `<tr>
            <td class="capitalize">${finalResult.month} ${searchTerm.selectedYear}</td>
            <td>&#163; ${finalResult.obs.toLocaleString()}</td>
            </tr>`;
            };
        };
    };

    if (county.length > 0) {
        document.querySelector('#location').append(`${county}, `);
    };

    if (region.length > 0) {
        document.querySelector('#location').append(`${region}, `);
    };

    document.querySelector('#location').append(`${country}`);

    document.querySelector('#result').innerHTML += `
    <div class="notes">
    <p><small>This dataset is provided by <a href="https://developer.ons.gov.uk/" target="_blank">the Office for National Statistics API</a>. You may check the accuracy of the data by visiting <a href="https://www.ons.gov.uk/datasets/house-prices-local-authority" target="_blank">the ONS website</a>.
    <br><br>Version of this dataset: <a href="${results.responseData.links.latest_version.href}" target="_blank">${results.responseData.links.latest_version.id}</a>
    <br>Next release: ${results.responseData.next_release}</small></p>
    </div>
    `;
};

function getCode() {
    if (input.value.length > 0) {
        const findInput = places.find((place) => {
            return place.name.toLowerCase() === input.value.toLowerCase();
        });
        if (findInput === undefined) {
            resultSection.innerHTML = `
            <p>Sorry, we couldn\'t find any places matching "${input.value}", please search again or try selecting from the dropdown lists.</p>
            <br><p>If you're searching "London", you will need to input the full name of a London borough (e.g. Harrow, Sutton, Kensington and Chelsea) instead.</p>
            `;
        } else {
            console.log(findInput);
            callResult(findInput.code);
        }
    } else if (placesMenu.value.length > 0) {
        const code = placesMenu.value;
        callResult(code);
    };
};

function checkMenus() {
    if (placesMenu.value.length > 0 || input.value.length > 0) {
        if (propertyStatusMenu.value.length > 0 &&
            housePriceVariableMenu.value.length > 0 &&
            propertyTypeMenu.value.length > 0 &&
            yearMenu.value.length > 0) {
            getCode();
        } else {
            resultSection.innerHTML = 'Please complete the filters.';
        };
    } else {
        resultSection.innerHTML = 'Please select a place to check.';
    };
};

const onInput = async (event) => {
    countriesMenu[0].selected = 'selected';
    regionsSection.classList.add('hidden');
    placesSection.classList.add('hidden');
    placesMenu.innerHTML = `
            <option value=""></option>
        `;
    settingSection.classList.remove('hidden');
    resultSection.classList.remove('hidden');
    checkMenus();
};

input.addEventListener('input', debounce(onInput, 1000));

const onChange = async (event) => {
    if (event.target.id === `${countriesMenu.id}`) {
        input.value = '';
    }
    if (event.target.id === `${placesMenu.id}`) {
        settingSection.classList.remove('hidden');
        resultSection.classList.remove('hidden');
    }
    checkMenus();
};

placesMenu.addEventListener('change', debounce(onChange, 0));
propertyStatusMenu.addEventListener('change', debounce(onChange, 0));
housePriceVariableMenu.addEventListener('change', debounce(onChange, 0));
propertyTypeMenu.addEventListener('change', debounce(onChange, 0));
yearMenu.addEventListener('change', debounce(onChange, 0));
