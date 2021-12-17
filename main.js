import {UI_ELEMENTS, URL} from './view.js'

UI_ELEMENTS.BUTTON_SEARCH_CITY.addEventListener('click', e => e.preventDefault())
UI_ELEMENTS.BUTTON_SEARCH_CITY.addEventListener('click', weatherResult)

function weatherResult() {
    const FOREST_INPUT = document.querySelector('.forest__input')
    let city = FOREST_INPUT.value
    const URL_CITY = `${URL.server}?q=${city}&appid=${URL.apiKey}`
    const isEmptyCity = /^[a-zA-Z ]+$/.test(city.trim())

    try {
        FOREST_INPUT.classList.remove('error')
        if (!isEmptyCity) throw new SyntaxError("City is not entered or entered incorrectly, check the correctness of the entry.")
    } catch (error) {
        UI_ELEMENTS.FORM_WEATHER.reset()
        FOREST_INPUT.classList.add('error')
        return alert('The data is incomplete: ' + error.message)
    }

    capitalLetter(city)

    fetch(URL_CITY)
        .then(response => response.json())
        .then(function (answer) {
            UI_ELEMENTS.CITIES.forEach(item => item.textContent = answer.name)
            UI_ELEMENTS.TEMPERATURE.forEach(item => item.textContent = Math.round(answer.main.temp))
            UI_ELEMENTS.FEELS_LIKE.forEach(item => item.textContent = Math.round(answer.main.feels_like))
            answer.weather.forEach(item => {
                UI_ELEMENTS.CITY_WEATHER.textContent = item.main
                UI_ELEMENTS.WEATHER_IMG.src = 'img/' + item.icon + '.png'
            })
            const SUNRISE = answer.sys.sunrise
            const SUNSET = answer.sys.sunset
            UI_ELEMENTS.CITY_SUNRISE.textContent = timeConverter(SUNRISE)
            UI_ELEMENTS.CITY_SUNSET.textContent = timeConverter(SUNSET)

            const LOCATION_LI = document.createElement('li')
            LOCATION_LI.classList.add('mb')
            LOCATION_LI.textContent = answer.name
            UI_ELEMENTS.LOCATIONS.prepend(LOCATION_LI)
        })
        .catch(error => alert(error.message + '\nThe data is incomplete: City is entered incorrectly, check the correctness of the entry.'))

    UI_ELEMENTS.FORM_WEATHER.reset()
}

function capitalLetter(city) {
    let firstLetter = city.split().toString()
    firstLetter = firstLetter[0].toUpperCase() + firstLetter.slice(1)
    return firstLetter
}

function timeConverter(data){
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


