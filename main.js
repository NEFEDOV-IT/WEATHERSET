import {UI_ELEMENTS, URL} from './view.js'

UI_ELEMENTS.BUTTON_SEARCH_CITY.addEventListener('click', (e) => {
    e.preventDefault()
    UI_ELEMENTS.WEATHER_FAVORITES.innerHTML = '&#9825;'
    weatherResult()
})

const LOCATIONS_LI = document.querySelectorAll('.list-li')
LOCATIONS_LI.forEach(item => {
    item.addEventListener('click', () => {
        const cityName = item.textContent.slice(0, -2)
        weatherResult(cityName)
    })
})

function weatherResult(cityName) {
    const FOREST_INPUT = document.querySelector('.forest__input')
    let city = FOREST_INPUT.value || cityName
    const URL_CITY = `${URL.server}?q=${city}&appid=${URL.apiKey}`
    const isEmptyCity = /^[a-zA-Z- ]+$/.test(city.trim())

    try {
        FOREST_INPUT.classList.remove('error')
        if (!isEmptyCity) throw new SyntaxError("City is not entered or entered incorrectly, check the correctness of the entry.")
    } catch (error) {
        UI_ELEMENTS.FORM_WEATHER.reset()
        FOREST_INPUT.classList.add('error')
        return alert('The data is incomplete: ' + error.message)
    }

    city = capitalLetter(city)

    fetch(URL_CITY)
        .then(response => response.json())
        .then(function weatherCity(answer) {
            UI_ELEMENTS.TEMPERATURE.forEach(item => item.textContent = Math.round(answer.main.temp))
            UI_ELEMENTS.FEELS_LIKE.forEach(item => item.textContent = Math.round(answer.main.feels_like))
            UI_ELEMENTS.CITIES.forEach(item => item.textContent = city)
            answer.weather.forEach(item => {
                UI_ELEMENTS.CITY_WEATHER.textContent = item.main
                UI_ELEMENTS.WEATHER_IMG.src = 'img/' + item.icon + '.png'
            })
            const SUNRISE = answer.sys.sunrise
            const SUNSET = answer.sys.sunset
            UI_ELEMENTS.CITY_SUNRISE.textContent = timeConverter(SUNRISE)
            UI_ELEMENTS.CITY_SUNSET.textContent = timeConverter(SUNSET)

            UI_ELEMENTS.WEATHER_FAVORITES.addEventListener('click', (item) => {
                const LOCATIONS_LI = document.querySelectorAll('.list-li')
                const WEATHER_FAVORITES = document.querySelector('.weather__favorites')

                for (let i = 0; i < LOCATIONS_LI.length; i++) {
                    const element = LOCATIONS_LI[i]
                    const isCorrectCity = element.textContent.slice(0, -2) === city
                    if (isCorrectCity) return
                }

                const CREATE_LI_CITY = document.createElement('li')
                const BUTTON_CLOSE = document.createElement('span')
                WEATHER_FAVORITES.innerHTML = '&#9829;'
                CREATE_LI_CITY.classList.add('mb', 'list-li')
                CREATE_LI_CITY.textContent = city
                BUTTON_CLOSE.classList.add('li-close')
                BUTTON_CLOSE.innerHTML = '&#65794'
                BUTTON_CLOSE.addEventListener('click', deleteCity)
                CREATE_LI_CITY.append(BUTTON_CLOSE)
                UI_ELEMENTS.LOCATIONS.prepend(CREATE_LI_CITY)
                CREATE_LI_CITY.addEventListener('click', () => weatherResult(city))
            })

        })
        .catch(error => alert(error.message + '\nThe data is incomplete: City is entered incorrectly, check the correctness of the entry.'))

    UI_ELEMENTS.FORM_WEATHER.reset()
}

UI_ELEMENTS.CITY_LI_CLOSE.forEach(item => item.addEventListener('click', deleteCity))

function deleteCity() {
    this.parentElement.remove()
}

function capitalLetter(city) {
    let firstLetter = city.split().toString()
    firstLetter = firstLetter[0].toUpperCase() + firstLetter.slice(1)
    return firstLetter
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


