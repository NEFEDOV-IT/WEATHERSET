import {UI_ELEMENTS, URL} from './view.js'
import {storage} from './storage.js'

let currentCity = undefined
const arrayCity = new Set()
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

async function render(URL_CITY, URL_CITY_FORECAST) {
    try {
        const responseCity = await fetch(URL_CITY)
        const jsonCity = await responseCity.json()
        const city_info = new InfoValuesCity(jsonCity) // constructor
        await renderInfoTabs(city_info)

        const responseForecast = await fetch(URL_CITY_FORECAST)
        const jsonForecast = await responseForecast.json()
        await renderForecast(jsonForecast)
    } catch(err) {
        alert(err)
    }
}
// constructor
function InfoValuesCity(data) {
    this.temperature = Math.round(data.main.temp)
    this.tempFeelsLike = Math.round(data.main.feels_like)
    this.cityName = data.name
    this.weather = data.weather[0].main
    this.icon = URL.ICON_WEATHER + data.weather[0].icon + '@4x.png'
    this.sunrise = timeConverter(data.sys.sunrise)
    this.sunset = timeConverter(data.sys.sunset)
}

function renderInfoTabs(city_info) {
    UI_ELEMENTS.TEMPERATURE.forEach(item => item.textContent = city_info.temperature)
    UI_ELEMENTS.FEELS_LIKE.forEach(item => item.textContent = city_info.tempFeelsLike)
    UI_ELEMENTS.CITIES.forEach(item => item.textContent = currentCity = city_info.cityName)
    UI_ELEMENTS.CITY_WEATHER.textContent = city_info.weather
    UI_ELEMENTS.WEATHER_IMG.src = city_info.icon
    UI_ELEMENTS.CITY_SUNRISE.textContent = city_info.sunrise
    UI_ELEMENTS.CITY_SUNSET.textContent = city_info.sunset

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
    const onlyOneCityAddedLocation = Array.from(LOCATIONS_LI).find(item => item.textContent)
    const cityAddedLocation = Array.from(LOCATIONS_LI).find((item, index) => {
        return item.textContent === currentCity && index > 0
    })

    UI_ELEMENTS.WEATHER_FAVORITES_IMG.classList.remove('active')

    if (onlyOneCityAddedLocation.textContent === currentCity) {
        onlyOneCityAddedLocation.parentElement.remove()
    }

    if (cityAddedLocation) {
        cityAddedLocation.parentElement.remove()
    }

    saveSetCities()

    if (storage.getFavoriteCities().length === 0) localStorage.clear()
}

function addFavorite() {
    UI_ELEMENTS.WEATHER_FAVORITES_IMG.classList.add('active')

    addLocationsWeather(currentCity)

    storage.saveCurrentCity(currentCity)

    if (arrayOfSavedCities) {
        arrayOfSavedCities.push(currentCity)
        storage.saveFavoriteCities(arrayOfSavedCities)
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

    saveSetCities()

    if (storage.getFavoriteCities().length === 0) localStorage.clear()
}

function saveSetCities() {
    const setArrayCity = new Set(storage.getFavoriteCities())
    setArrayCity.delete(currentCity)
    storage.saveFavoriteCities(setArrayCity)
    storage.saveCurrentCity(Array.from(setArrayCity)[0])
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



