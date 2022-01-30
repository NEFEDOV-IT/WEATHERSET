export const UI_ELEMENTS = {
    FOREST_INPUT: document.querySelector('.forest__input'),
    LOCATIONS: document.querySelector('.location__locations-list'),
    CITIES: document.querySelectorAll('._city'),
    TEMPERATURE: document.querySelectorAll('.city__temperature'),
    FEELS_LIKE: document.querySelectorAll('.feels__like'),
    BUTTON_SEARCH_CITY: document.querySelector('.button__search'),
    FORM_WEATHER: document.querySelector('.forest__form'),
    CITY_WEATHER: document.querySelector('.city__weather'),
    CITY_SUNRISE: document.querySelector('.city__sunrise'),
    CITY_SUNSET: document.querySelector('.city__sunset'),
    CLOUD_CITY_INFO: document.querySelector('.cloud-city-info'),
    WEATHER_IMG: document.querySelector('.city__weather'),
    WEATHER_FAVORITES_IMG: document.querySelector('.weather__favorites'),
    WEATHER_CITY: document.querySelector('.weather__city'),
}

export const URL = {
    SERVER: 'https://api.openweathermap.org/data/2.5/weather',
    APIKEY: '9ef705670e05a7f36d295b686608964c\n&units=metric',
    ICON_WEATHER: 'https://openweathermap.org/img/wn/',
    SERVER_FORECAST: 'https://api.openweathermap.org/data/2.5/forecast'
}
