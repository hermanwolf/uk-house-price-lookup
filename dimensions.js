const allPropertyStatus = [
    { code: 'all', label: 'All existing and newly built' },
    { code: 'existing', label: 'Existing' },
    { code: 'newly-built', label: 'Newly built' }
];

const housePriceVariables = [
    { code: 'sales', label: 'Count of sales' },
    { code: 'lower-quartile', label: 'Lower quartile price' },
    { code: 'mean', label: 'Mean price' },
    { code: 'median', label: 'Median price' },
    { code: 'tenth-percentile', label: 'Tenth percentile price' }
];

// const months = [
//     { code: 'dec', label: 'December' },
//     { code: 'sep', label: 'September' },
//     { code: 'jun', label: 'June' },
//     { code: 'mar', label: 'March' }
// ];

const propertyTypes = [
    { code: 'all', label: 'All property types' },
    { code: 'detached', label: 'Detached' },
    { code: 'flat-maisonette', label: 'Flat/maisonette' },
    { code: 'semi-detached', label: 'Semi-detached' },
    { code: 'terraced', label: 'Terraced' }
];

for (let propertyStatus of allPropertyStatus) {
    const option = document.createElement('option');
    option.innerHTML = propertyStatus.label;
    option.setAttribute('value', propertyStatus.code);
    document.querySelector('#property-status').appendChild(option);
};

for (let housePriceVariable of housePriceVariables) {
    const option = document.createElement('option');
    option.innerHTML = housePriceVariable.label;
    option.setAttribute('value', housePriceVariable.code);
    document.querySelector('#house-price-variable').appendChild(option);
};

// for (let month of months) {
//     const option = document.createElement('option');
//     option.innerHTML = month.label;
//     option.setAttribute('value', month.code);
//     document.querySelector('#month').appendChild(option);
// };

for (let propertyType of propertyTypes) {
    const option = document.createElement('option');
    option.innerHTML = propertyType.label;
    option.setAttribute('value', propertyType.code);
    document.querySelector('#property-type').appendChild(option);
};

for (let i = 2021; i > 2014; i--) {
    const option = document.createElement('option');
    option.innerHTML = i;
    option.setAttribute('value', i);
    document.querySelector('#year').appendChild(option);
};