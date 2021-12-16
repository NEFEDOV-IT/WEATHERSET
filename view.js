export const UI_ELEMENTS = {
    locations: document.querySelector('.location__locations-list'),
    cities: document.querySelectorAll('._city'),
    temperature: document.querySelectorAll('.city__temperature'),
    feels_like: document.querySelectorAll('.feels__like'),
    button: document.querySelector('.button__search'),
    form: document.querySelector('.forest__form'),
}

export const URL = {
    server: 'http://api.openweathermap.org/data/2.5/weather',
    apiKey: 'f660a2fb1e4bad108d6160b7f58c555f&units=metric',
}
