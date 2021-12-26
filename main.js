import {UI_ELEMENTS, URL} from './view.js'
import {storage} from './storage.js'

let currentCity = undefined
const arrayCity = []
const arrayOfSavedCities = storage.getFavoriteCities()
const cityStorage = storage.getCurrentCity()

weatherResult()
showInfoCity()
addButtonDeleteCity()

if (localStorage.length > 0) {
    arrayOfSavedCities.forEach(item => addLocationsWeather(item))

    UI_ELEMENTS.CITIES.forEach(item => {
        item.textContent = cityStorage
        const URL_STORAGE = `${URL.SERVER}?q=${cityStorage}&appid=${URL.APIKEY}`
        const URL_CITY_FORECAST_STORAGE = `${URL.SERVER_FORECAST}?q=${cityStorage}&appid=${URL.APIKEY}`
        render(URL_STORAGE, URL_CITY_FORECAST_STORAGE)
    })
}

UI_ELEMENTS.BUTTON_SEARCH_CITY.addEventListener('click', (e) => {
    e.preventDefault()
    UI_ELEMENTS.WEATHER_FAVORITES_IMG.classList.remove('active')
    weatherResult()
})

function weatherResult() {
    const city = UI_ELEMENTS.FOREST_INPUT.value || UI_ELEMENTS.WEATHER_CITY.textContent.trim()
    const URL_CITY = `${URL.SERVER}?q=${city}&appid=${URL.APIKEY}`
    const isEmptyCity = /^[а-яА-Яa-zA-Z- ]+$/.test(city.trim())
    const URL_CITY_FORECAST = `${URL.SERVER_FORECAST}?q=${city}&appid=${URL.APIKEY}`

    try {
        UI_ELEMENTS.FOREST_INPUT.classList.remove('error')
        if (!isEmptyCity) throw new SyntaxError("City is not entered or entered incorrectly, check the correctness of the entry.")
    } catch (error) {
        UI_ELEMENTS.FORM_WEATHER.reset()
        UI_ELEMENTS.FOREST_INPUT.classList.add('error')
        return alert('The data is incomplete: ' + error.message)
    }

    render(URL_CITY, URL_CITY_FORECAST)
    UI_ELEMENTS.FORM_WEATHER.reset()
}

function render(URL_CITY, URL_CITY_FORECAST) {
    fetch(URL_CITY)
        .then(response => response.json())
        .then(renderInfoTabs)
        .catch(error => alert(error.message + '\nThe data is incomplete: City is entered incorrectly, check the correctness of the entry.'))

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
        const cityNotText = Array.from(LOCATIONS_LI).find(item => item.textContent)
        if (cityNotText.textContent === currentCity) {
            UI_ELEMENTS.WEATHER_FAVORITES_IMG.classList.add('active')
        }

        Array.from(LOCATIONS_LI).find((item, index) => {
            if (item.textContent === currentCity && index > 0) {
                UI_ELEMENTS.WEATHER_FAVORITES_IMG.classList.add('active')
            }
        })
    }
}

function renderForecast(data) {
    UI_ELEMENTS.FORECAST_BLOCK_INFO.forEach(() => {
        UI_ELEMENTS.FORECAST_DAY.forEach((item, index) => {
            item.textContent = dateConverter(data.list[index].dt)
        })
        UI_ELEMENTS.FORECAST_TIME.forEach((item, index) => {
            item.textContent = timeConverter(data.list[index].dt)
        })
        UI_ELEMENTS.FORECAST_TEMP.forEach((item, index) => {
            item.textContent = Math.round(data.list[index].main.temp)
        })
        UI_ELEMENTS.FORECAST_FEELS_LIKE.forEach((item, index) => {
            item.textContent = Math.round(data.list[index].main.feels_like)
        })
        UI_ELEMENTS.FORECAST_CLOUD_IMG.forEach((item, index) => {
            item.src = URL.ICON_WEATHER + data.list[index].weather[0].icon + '.png'
        })
        UI_ELEMENTS.FORECAST_CLOUD_NAME.forEach((item, index) => {
            item.textContent = data.list[index].weather[0].main
        })
    })
}

UI_ELEMENTS.WEATHER_FAVORITES_IMG.addEventListener('click', () => {
    const cityNow = document.querySelector('.weather__city')
    currentCity = cityNow.textContent

    const favorite_img = document.querySelector('.weather__favorites')
    const isFavorite = favorite_img.classList.contains('active')
    isFavorite ? removeFavorite(currentCity) : addFavorite()
})

function removeFavorite(currentCity) {
    const LOCATIONS_LI = document.querySelectorAll('.li-location')
    if (LOCATIONS_LI.length > 0) {
        const cityNotText = Array.from(LOCATIONS_LI).find(item => item.textContent)
        if (cityNotText.textContent === currentCity) {
            cityNotText.parentElement.remove()
            UI_ELEMENTS.WEATHER_FAVORITES_IMG.classList.remove('active')
        }
        Array.from(LOCATIONS_LI).find((item, index) => {
            if (item.textContent === currentCity && index > 0) {
                UI_ELEMENTS.WEATHER_FAVORITES_IMG.classList.remove('active')
                item.parentElement.remove()
            }
        })
        if (arrayOfSavedCities) {
            arrayOfSavedCities.splice(arrayOfSavedCities.indexOf(currentCity), 1)
            storage.saveFavoriteCities(arrayOfSavedCities)
        }
        if (localStorage.length === 0) localStorage.clear()
    }
}

function addFavorite() {
    const LOCATIONS_LI = document.querySelectorAll('.li-location')

    for (let i = 0; i < LOCATIONS_LI.length; i++) {
        const element = LOCATIONS_LI[i]
        const isCorrectCity = element.textContent === currentCity
        if (isCorrectCity) return
    }

    UI_ELEMENTS.WEATHER_FAVORITES_IMG.classList.add('active')

    addLocationsWeather(currentCity)

    storage.saveCurrentCity(currentCity)

    if (arrayOfSavedCities) {
        arrayOfSavedCities.push(currentCity)
        storage.saveFavoriteCities(arrayOfSavedCities)
    } else {
        arrayCity.push(currentCity)
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
        UI_ELEMENTS.WEATHER_FAVORITES_IMG.classList.add('active')
        weatherResult()
    })
}

function showInfoCity() {
    const LOCATIONS_LI = document.querySelectorAll('.li-location')
    LOCATIONS_LI.forEach(item => item.addEventListener('click', () => {
        UI_ELEMENTS.FOREST_INPUT.value = item.textContent
        UI_ELEMENTS.WEATHER_FAVORITES_IMG.classList.add('active')
        storage.saveCurrentCity(item.textContent)
        weatherResult()
    }))
}

function addButtonDeleteCity() {
    const closeCity = document.querySelectorAll('.li-close')
    closeCity.forEach(button => button.addEventListener('click', deleteCity))
}

function deleteCity() {
    this.parentElement.remove()
    UI_ELEMENTS.WEATHER_FAVORITES_IMG.classList.remove('active')

    const index = this.parentElement.textContent.slice(0, -2)
    if (arrayOfSavedCities) {
        arrayOfSavedCities.splice(arrayOfSavedCities.indexOf(index), 1)
        storage.saveFavoriteCities(arrayOfSavedCities)
    }
    if (arrayOfSavedCities.length === 0) localStorage.clear()
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


