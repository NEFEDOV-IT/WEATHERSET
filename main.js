import { UI_ELEMENTS, URL } from './view.js'
import { storage } from './storage.js'

let currentCity = undefined
const FIRST_CITY = 'Aktobe'
const arrayCity = new Set()

weatherResult()

if (storage.getCurrentCity()) {
    storage.getFavoriteCities().forEach(item => addLocationsWeather(item))

    UI_ELEMENTS.CITIES.forEach(item => {
        item.textContent = storage.getCurrentCity()
        const URL_STORAGE = `${URL.SERVER}?q=${storage.getCurrentCity()}&appid=${URL.APIKEY}`
        const URL_CITY_FORECAST_STORAGE = `${URL.SERVER_FORECAST}?q=${storage.getCurrentCity()}&appid=${URL.APIKEY}`
        render(URL_STORAGE, URL_CITY_FORECAST_STORAGE)
    })
}

UI_ELEMENTS.BUTTON_SEARCH_CITY.addEventListener('click', (e) => {
    e.preventDefault()
    UI_ELEMENTS.WEATHER_FAVORITES_IMG.classList.remove('active')
    weatherResult()
})

class Error {
    constructor(message) {
        this.message = message;
        this.name = 'Error';
    }
}

class NamingError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class ValidationError extends NamingError {
    constructor(message) {
        super(message);
    }
}

function weatherResult() {
    const city = UI_ELEMENTS.FOREST_INPUT.value || UI_ELEMENTS.WEATHER_CITY.textContent.trim()
    const URL_CITY = `${URL.SERVER}?q=${city}&appid=${URL.APIKEY}`
    const isEmptyCity = /^[а-яА-Яa-zA-Z- ]+$/.test(city.trim())
    const URL_CITY_FORECAST = `${URL.SERVER_FORECAST}?q=${city}&appid=${URL.APIKEY}`

    try {
        UI_ELEMENTS.FOREST_INPUT.classList.remove('error')
        if (!isEmptyCity) throw new ValidationError("The data is incomplete: City is not entered or entered incorrectly, check the correctness of the entry.")
    } catch (error) {
        if (error instanceof ValidationError) {
            UI_ELEMENTS.FORM_WEATHER.reset()
            UI_ELEMENTS.FOREST_INPUT.classList.add('error')
            return alert(error.message)
        } throw error.message
    }

    render(URL_CITY, URL_CITY_FORECAST)
    UI_ELEMENTS.FORM_WEATHER.reset()
}

function render(URL_CITY, URL_CITY_FORECAST) {
    fetch(URL_CITY)
        .then(response => response.json())
        .then(renderInfoTabs)

    fetch(URL_CITY_FORECAST)
        .then(response => response.json())
        .then(renderForecast)
        .catch(error => alert(error.message))
}

function renderInfoTabs(data) {
    UI_ELEMENTS.TEMPERATURE.forEach(item => item.textContent = Math.round(data.main.temp))
    UI_ELEMENTS.FEELS_LIKE.forEach(item => item.textContent = Math.round(data.main.feels_like))
    UI_ELEMENTS.CITIES.forEach(item => item.textContent = currentCity = data.name)
    UI_ELEMENTS.CITY_WEATHER.textContent = data.weather[0].main
    UI_ELEMENTS.WEATHER_IMG.src = URL.ICON_WEATHER + data.weather[0].icon + '@4x.png'
    UI_ELEMENTS.CITY_SUNRISE.textContent = timeConverter(data.sys.sunrise)
    UI_ELEMENTS.CITY_SUNSET.textContent = timeConverter(data.sys.sunset)

    isActiveFavorite(currentCity)
}

function isActiveFavorite(currentCity) {
    const LOCATIONS_LI = document.querySelectorAll('.li-location')
    if (LOCATIONS_LI.length > 0) {
        Array.from(LOCATIONS_LI).find((item, index) => {
            const isActiveCity = item.textContent === currentCity || item.textContent === currentCity && index > 0
            if (isActiveCity) {
                UI_ELEMENTS.WEATHER_FAVORITES_IMG.classList.add('active')
            }
        })
    }
}
function renderForecast(data) {
    UI_ELEMENTS.CLOUD_CITY_INFO.innerHTML = ''

    for (let i = 0; i < data.list.length - 1; i++) {
        const infoWeatherCity =
            `<div class="cloud-city__item">
             <div class="city-info__date">${dateConverter(data.list[i].dt)}</div>
             <div class ="city-info__time">${timeConverter(data.list[i].dt)}</div>
             <div class ="city-info__body">
               <div class="city-info__temperature">
                Temperature: <span>${Math.round(data.list[i].main.temp)}</span>°
               </div>
               <div class="city-info-feels">
                Feels like: <span>${Math.round(data.list[i].main.feels_like)}</span>°
               </div>
             </div>
             <div class="city-info__cloud">
               <div class="city-info__cloud-name">
                ${data.list[i].weather[0].main}
               </div>
             <div class="city-info__cloud-img">
                <img src="${URL.ICON_WEATHER + data.list[i].weather[0].icon + '.png'}" alt="">
             </div>
         </div>`
        UI_ELEMENTS.CLOUD_CITY_INFO.insertAdjacentHTML('beforeend', infoWeatherCity)
    }
}

UI_ELEMENTS.WEATHER_FAVORITES_IMG.addEventListener('click', () => {
    const currentCity = document.querySelector('.weather__city').textContent
    const favorite_img = document.querySelector('.weather__favorites')

    const isFavorite = favorite_img.classList.contains('active')
    isFavorite ? removeFavorite(currentCity) : addFavorite()
})

function removeFavorite(currentCity) {
    const LOCATIONS_LI = document.querySelectorAll('.li-location')
    const deleteCity = document.querySelector('.weather__city').textContent
    const findCityInAddedLocation = Array.from(LOCATIONS_LI).find(item => item.textContent === currentCity)

    UI_ELEMENTS.WEATHER_FAVORITES_IMG.classList.remove('active')

    findCityInAddedLocation.parentElement.remove()

    deleteSaveCities(deleteCity)

    if (storage.getFavoriteCities().length === 0) localStorage.clear()
}

function addFavorite() {
    UI_ELEMENTS.WEATHER_FAVORITES_IMG.classList.add('active')

    addLocationsWeather(currentCity)

    storage.saveCurrentCity(currentCity)

    if (storage.getFavoriteCities()) {
        const array = new Set(storage.getFavoriteCities())
        array.add(currentCity)
        storage.saveFavoriteCities(array)
    } else {
        arrayCity.add(currentCity)
        storage.saveFavoriteCities(arrayCity)
    }
}

function addLocationsWeather(currentCity) {
    const CREATE_LI_CITY = document.createElement('li')
    const CITY_FAVORITE = document.createElement('div')
    const BUTTON_CLOSE = document.createElement('div')
    CREATE_LI_CITY.classList.add('mb', 'list-li')
    UI_ELEMENTS.WEATHER_FAVORITES_IMG.classList.add('active')
    CITY_FAVORITE.classList.add('li-location')
    CITY_FAVORITE.textContent = currentCity
    BUTTON_CLOSE.classList.add('li-close')
    BUTTON_CLOSE.innerHTML = '&#65794'
    BUTTON_CLOSE.addEventListener('click', deleteCity)
    CREATE_LI_CITY.append(CITY_FAVORITE)
    CREATE_LI_CITY.append(BUTTON_CLOSE)
    UI_ELEMENTS.LOCATIONS.prepend(CREATE_LI_CITY)
    CREATE_LI_CITY.addEventListener('click', () => {
        UI_ELEMENTS.FOREST_INPUT.value = currentCity
        weatherResult()
    })
}

function deleteCity() {
    this.parentElement.remove()
    UI_ELEMENTS.WEATHER_FAVORITES_IMG.classList.remove('active')

    const deleteCity = this.parentElement.textContent.slice(0, -2)
    deleteSaveCities(deleteCity)

    if (storage.getFavoriteCities().length === 0) localStorage.clear()
}

function deleteSaveCities(deleteCity) {
    const cities = new Set(storage.getFavoriteCities())
    cities.delete(deleteCity)
    storage.saveFavoriteCities(cities)
    storage.saveCurrentCity(Array.from(cities)[0] || FIRST_CITY)
}

function dateConverter(data) {
    const DATE_DATA = new Date(data * 1000)
    const month = DATE_DATA.toLocaleString('en', {month: 'long'})
    return DATE_DATA.getDate() + ' ' + month
}

function timeConverter(data) {
    const TIME_DATA = new Date(data * 1000)
    let hour = TIME_DATA.getHours()
    let min = TIME_DATA.getMinutes()
    min = (min < 10) ? '0' + min : min
    hour = (hour < 10) ? '0' + hour : hour
    return hour + ':' + min
}

const TABS_ITEMS = document.querySelectorAll('.tabs-item')
const TABS_BLOCKS = document.querySelectorAll('.tabs-block')
TABS_ITEMS.forEach((activeTab, index) => {
    activeTab.addEventListener('click', () => {
        TABS_ITEMS.forEach((removeTabs, ind) => {
            removeTabs.classList.remove('active')
            TABS_BLOCKS[ind].classList.remove('active')
        })
        activeTab.classList.add('active')
        TABS_BLOCKS[index].classList.add('active')
    })
})



