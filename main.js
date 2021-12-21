import {UI_ELEMENTS, URL} from './view.js'
import {renderStorage, arrayOfSavedCities} from './storage.js'

const arrayCity = []
let currentCity = undefined

renderStorage()

UI_ELEMENTS.CLEAR_STORAGE.addEventListener('click', () => localStorage.clear())

UI_ELEMENTS.BUTTON_SEARCH_CITY.addEventListener('click', (e) => {
    e.preventDefault()
    UI_ELEMENTS.WEATHER_FAVORITES.src = 'favorites.svg'
    weatherResult()
})

function weatherResult() {
    const city = UI_ELEMENTS.FOREST_INPUT.value
    const URL_CITY = `${URL.SERVER}?q=${city}&appid=${URL.APIKEY}`
    const isEmptyCity = /^[а-яА-Яa-zA-Z- ]+$/.test(city.trim())

    try {
        UI_ELEMENTS.FOREST_INPUT.classList.remove('error')
        if (!isEmptyCity) throw new SyntaxError("City is not entered or entered incorrectly, check the correctness of the entry.")
    } catch (error) {
        UI_ELEMENTS.FORM_WEATHER.reset()
        UI_ELEMENTS.FOREST_INPUT.classList.add('error')
        return alert('The data is incomplete: ' + error.message)
    }

    render(URL_CITY)
    UI_ELEMENTS.FORM_WEATHER.reset()
}

export function render(URL) {
    fetch(URL)
        .then(response => response.json())
        .then(renderInfoTabs)
        .catch(error => alert(error.message + '\nThe data is incomplete: City is entered incorrectly, check the correctness of the entry.'))
}

function renderInfoTabs(data) {
    UI_ELEMENTS.TEMPERATURE.forEach(item => item.textContent = Math.round(data.main.temp))
    UI_ELEMENTS.FEELS_LIKE.forEach(item => item.textContent = Math.round(data.main.feels_like))
    UI_ELEMENTS.CITIES.forEach(item => item.textContent = currentCity = data.name)
    data.weather.forEach(item => {
        UI_ELEMENTS.CITY_WEATHER.textContent = item.main
        UI_ELEMENTS.WEATHER_IMG.src = URL.ICON_WEATHER + item.icon + '@4x.png'
    })
    UI_ELEMENTS.CITY_SUNRISE.textContent = timeConverter(data.sys.sunrise)
    UI_ELEMENTS.CITY_SUNSET.textContent = timeConverter(data.sys.sunset)
}

function addFavourite() {
    const LOCATIONS_LI = document.querySelectorAll('.li-location')
    for (let i = 0; i < LOCATIONS_LI.length; i++) {
        const element = LOCATIONS_LI[i]
        const isCorrectCity = element.textContent === currentCity
        if (isCorrectCity) return
    }

    addLocationsWeather(currentCity)

    arrayCity.push(currentCity)
    localStorage.setItem('arrayCity', JSON.stringify(arrayCity))
    localStorage.setItem('cityName', currentCity)
}

export function addLocationsWeather(el) {
    const CREATE_LI_CITY = document.createElement('li')
    const CITY_FAVOURITE = document.createElement('div')
    const BUTTON_CLOSE = document.createElement('div')
    UI_ELEMENTS.WEATHER_FAVORITES.src = 'favorites-black.svg'
    CREATE_LI_CITY.classList.add('mb', 'list-li')
    CITY_FAVOURITE.classList.add('li-location')
    CITY_FAVOURITE.textContent = el
    BUTTON_CLOSE.classList.add('li-close')
    BUTTON_CLOSE.innerHTML = '&#65794'
    BUTTON_CLOSE.addEventListener('click', deleteCity)
    CREATE_LI_CITY.append(CITY_FAVOURITE)
    CREATE_LI_CITY.append(BUTTON_CLOSE)
    UI_ELEMENTS.LOCATIONS.prepend(CREATE_LI_CITY)
    CREATE_LI_CITY.addEventListener('click', () => {
        UI_ELEMENTS.FOREST_INPUT.value = CITY_FAVOURITE.textContent
        weatherResult()
    })
}

UI_ELEMENTS.WEATHER_FAVORITES.addEventListener('click', () => {
    const cityNow = document.querySelector('.weather__city')
    currentCity = cityNow.textContent
    addFavourite()
})

function showInfoCity() {
    const LOCATIONS_LI = document.querySelectorAll('.li-location')
    LOCATIONS_LI.forEach(item => item.addEventListener('click', () => {
        UI_ELEMENTS.FOREST_INPUT.value = item.textContent
        weatherResult()
    }))
}

showInfoCity()

function addDeleteCity() {
    const closeCity = document.querySelectorAll('.li-close')
    closeCity.forEach(button => button.addEventListener('click', deleteCity))
}

function deleteCity() {
    this.parentElement.remove()

    if (localStorage.length > 0) {
        arrayOfSavedCities.splice(arrayOfSavedCities.indexOf(this.parentElement.textContent.slice(0, -2)), 1)
        localStorage.setItem('arrayCity', JSON.stringify(arrayOfSavedCities))
    }
}

addDeleteCity()

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
for (let i = 0; i < TABS_ITEMS.length; i++) {
    const TABS_ITEM = TABS_ITEMS[i]
    TABS_ITEM.addEventListener('click', () => {
        for (let i = 0; i < TABS_ITEMS.length; i++) {
            const TABS_ITEM_ACTIVE = TABS_ITEMS[i]
            TABS_ITEM_ACTIVE.classList.remove('active')
            TABS_BLOCKS[i].classList.remove('active')
        }
        TABS_ITEM.classList.add('active')
        TABS_BLOCKS[i].classList.add('active')
    })
}


