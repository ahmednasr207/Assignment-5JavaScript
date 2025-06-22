const citySearchInput = document.getElementById("citySearchInput");
const weatherResultsContainer = document.getElementById("weatherResultsContainer");
const forecastDaysSelect = document.getElementById("forecastDaysSelect");
let currentLocation = "";

async function fetchWeatherData(location) {
    currentLocation = location;
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=4eaeb99cbf6043c1bd795521252006&days=${forecastDaysSelect.value}&q=${location}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    const currentWeather = data.current;
    const locationInfo = data.location;
    const forecastDays = data.forecast.forecastday;
    
    renderWeatherData(currentWeather, locationInfo, forecastDays);
}

function renderWeatherData(currentData, locationData, forecastDays) {
    let forecastHTML = '';
    
    for(let i = 1; i < forecastDays.length; i++) {
        const dayData = forecastDays[i].day;
        const date = new Date(forecastDays[i].date);
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = days[date.getDay()];

        forecastHTML += `
             <div class="p-2 col-sm-12 col-md-6 col-lg-4 ">  

        <div class=" border border-primary d-flex flex-column justify-content-start align-items-start  rounded-3 p-0">
            <div class="d-flex justify-content-center align-items-center w-100 bg-black p-2 rounded-3">
                <h4>${dayName}</h4>
            </div>
            <div class="w-100 py-1">
                <ul class="d-flex flex-column justify-content-between align-items-center w-100 list-unstyled p-2">
                    <li class="py-2"><img src="${dayData.condition.icon}" alt="Weather icon"></li>
                    <li class="py-2">${dayData.maxtemp_c} &degC</li>
                    <li class="py-2">${dayData.mintemp_c} &degC</li>
                    <li class="py-2 fs-5 fst-italic small text-primary">${dayData.condition.text}</li>
                </ul>
            </div></div>
        </div>`;
    }

    const lastUpdated = new Date(currentData.last_updated);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const currentDay = days[lastUpdated.getDay()];
    const currentDate = lastUpdated.getDate();
    const currentMonth = months[lastUpdated.getMonth()];

    weatherResultsContainer.innerHTML = `
     <div class="p-2 col-sm-12 col-md-6 col-lg-4 ">  
    <div class="   border border-primary d-flex flex-column rounded-3 ">
   
        <div class="d-flex justify-content-between align-items-center w-100 bg-black p-2 rounded-3">
            <h4>${currentDay}</h4>
            <h4>${currentDate} ${currentMonth}</h4>
        </div>
        <div class="w-100 p-3 ">
            <h4>${locationData.name}</h4>
        </div>
        <div class="w-100 d-flex justify-content-evenly align-items-center py-2">
            <h2>${currentData.temp_c} &degC</h2>
            <div><img src="${currentData.condition.icon}" alt="Current weather icon"></div>
        </div>
        <div class="fs-5 fst-italic small text-primary p-2">${currentData.condition.text}</div>
        <div class="w-100">
            <ul class="d-flex justify-content-between align-items-center w-100 list-unstyled p-2">
                <li>${currentData.precip_mm}% <i class="fa-solid fa-umbrella"></i></li>
                <li><i class="fa-solid fa-wind"></i> ${currentData.wind_kph}/h</li>
                <li><i class="fa-solid fa-compass "></i> ${currentData.wind_degree} ${currentData.wind_dir}</li>
            </ul>
        </div></div>
    </div>
    ${forecastHTML}`;
}


if(citySearchInput.value === '') {
    fetchWeatherData("Egypt");
    citySearchInput.value = '';
}


navigator.geolocation.getCurrentPosition(async function(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.weatherapi.com/v1/forecast.json?key=4eaeb99cbf6043c1bd795521252006&days=3&q=${lat},${lon}`;
    const response = await fetch(url);
    const data = await response.json();
    renderWeatherData(data.current, data.location, data.forecast.forecastday);
});

function setupCitySearch() {
    citySearchInput.addEventListener("input", async function() {
        if (citySearchInput.value.length >= 2) {
            const searchUrl = `https://api.weatherapi.com/v1/search.json?key=4eaeb99cbf6043c1bd795521252006&q=${citySearchInput.value.trim()}`;
            const searchResponse = await fetch(searchUrl);
            const searchData = await searchResponse.json();
            for (let i = 0; i < searchData.length; i++) {
                if( searchData[i].name.trim().toLowerCase()===citySearchInput.value.trim().toLowerCase() ){

fetchWeatherData(searchData[i].name);

                }else{

fetchWeatherData(searchData[0].name);


                }
                
            }
        }
    });
}

setupCitySearch();

forecastDaysSelect.innerHTML = "";
for(let i = 1; i <= 14; i++) {
    forecastDaysSelect.innerHTML += `<option value="${i}">${i}</option>`;
}

forecastDaysSelect.addEventListener("change", function() {
    fetchWeatherData(currentLocation);
});
