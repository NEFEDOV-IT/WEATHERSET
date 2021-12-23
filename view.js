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
    WEATHER_IMG: document.querySelector('.city__weather-img'),
    WEATHER_FAVORITES: document.querySelector('.weather__favorites-img'),
    CLEAR_STORAGE: document.querySelector('.clear__storage'),
    WEATHER_CITY: document.querySelector('.weather__city'),
    FORECAST_BLOCK_INFO: document.querySelectorAll('.cloud-city__item'),
    FORECAST_DAY: document.querySelectorAll('.city-info__date'),
    FORECAST_TIME: document.querySelectorAll('.city-info__time'),
    FORECAST_TEMP: document.querySelectorAll('.city-info__temperature span'),
    FORECAST_FEELS_LIKE: document.querySelectorAll('.city-info-feels span'),
    FORECAST_CLOUD_NAME: document.querySelectorAll('.city-info__cloud-name'),
    FORECAST_CLOUD_IMG: document.querySelectorAll('.city-info__cloud-img img'),
}

export const URL = {
    SERVER: 'https://api.openweathermap.org/data/2.5/weather',
    APIKEY: 'f660a2fb1e4bad108d6160b7f58c555f&units=metric',
    ICON_WEATHER: 'https://openweathermap.org/img/wn/',
    SERVER_FORECAST: 'https://api.openweathermap.org/data/2.5/forecast'
}
