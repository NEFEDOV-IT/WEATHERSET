import {UI_ELEMENTS, URL} from './view.js'
let cityName

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

    fetch(URL_CITY)
        .then(response => response.json())
        .then(answer => {
            UI_ELEMENTS.TEMPERATURE.forEach(item => item.textContent = Math.round(answer.main.temp))
            UI_ELEMENTS.FEELS_LIKE.forEach(item => item.textContent = Math.round(answer.main.feels_like))
            UI_ELEMENTS.CITIES.forEach(item => item.textContent = cityName = answer.name)
            answer.weather.forEach(item => {
                UI_ELEMENTS.CITY_WEATHER.textContent = item.main
                UI_ELEMENTS.WEATHER_IMG.src = URL.ICON_WEATHER + item.icon + '@4x' + '.png'
            })
            const SUNRISE = answer.sys.sunrise
            const SUNSET = answer.sys.sunset
            UI_ELEMENTS.CITY_SUNRISE.textContent = timeConverter(SUNRISE)
            UI_ELEMENTS.CITY_SUNSET.textContent = timeConverter(SUNSET)

            UI_ELEMENTS.WEATHER_FAVORITES.addEventListener('click', addFavourite)

        })
        .catch(error => alert(error.message + '\nThe data is incomplete: City is entered incorrectly, check the correctness of the entry.'))

    UI_ELEMENTS.FORM_WEATHER.reset()
}

function addFavourite() {
    const LOCATIONS_LI = document.querySelectorAll('.list-li')

    for (let i = 0; i < LOCATIONS_LI.length; i++) {
        const element = LOCATIONS_LI[i]
        const isCorrectCity = element.textContent.slice(0, -2) === cityName
        if (isCorrectCity) return
    }

    if (UI_ELEMENTS.WEATHER_FAVORITES.src === 'favorites-black.svg') {
        UI_ELEMENTS.WEATHER_FAVORITES.src = 'favorites.svg'
    }

    const CREATE_LI_CITY = document.createElement('li')
    const BUTTON_CLOSE = document.createElement('span')
    UI_ELEMENTS.WEATHER_FAVORITES.src = 'favorites-black.svg'
    CREATE_LI_CITY.classList.add('mb', 'list-li')
    CREATE_LI_CITY.textContent = cityName
    BUTTON_CLOSE.classList.add('li-close')
    BUTTON_CLOSE.innerHTML = '&#65794'
    BUTTON_CLOSE.addEventListener('click', deleteCity)
    CREATE_LI_CITY.append(BUTTON_CLOSE)

    UI_ELEMENTS.LOCATIONS.prepend(CREATE_LI_CITY)
    CREATE_LI_CITY.addEventListener('click', () => {
        UI_ELEMENTS.FOREST_INPUT.value = CREATE_LI_CITY.textContent.slice(0, -2)
        weatherResult()
    })
}

function deleteCity() {
    this.parentElement.remove()
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


