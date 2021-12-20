export const UI_ELEMENTS = {
    FOREST_INPUT: document.querySelector('.forest__input'),
    LOCATIONS: document.querySelector('.location__locations-list'),
    LOCATIONS_LI: document.querySelectorAll('.list-li'),
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
    CITY_LI_CLOSE: document.querySelectorAll('.li-close'),
}

export const URL = {
    SERVER: 'https://api.openweathermap.org/data/2.5/weather',
    APIKEY: 'f660a2fb1e4bad108d6160b7f58c555f&units=metric',
    ICON_WEATHER: 'https://openweathermap.org/img/wn/',
}
