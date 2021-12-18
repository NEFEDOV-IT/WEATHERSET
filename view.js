export const UI_ELEMENTS = {
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
    WEATHER_FAVORITES: document.querySelector('.weather__favorites'),
    CITY_LI_CLOSE: document.querySelectorAll('.li-close'),
    LOCATIONS_LI: document.querySelectorAll('.list-li'),
}

export const URL = {
    server: 'https://api.openweathermap.org/data/2.5/weather',
    apiKey: 'f660a2fb1e4bad108d6160b7f58c555f&units=metric',
}
