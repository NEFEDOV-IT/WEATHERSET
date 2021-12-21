
import {UI_ELEMENTS, URL} from './view.js'
import {render, addLocationsWeather} from './main.js'

export const arrayOfSavedCities = JSON.parse(localStorage.getItem('arrayCity'))

export function renderStorage() {


    if (localStorage.length > 0) {
        UI_ELEMENTS.LOCATIONS.innerHTML = null

        arrayOfSavedCities.forEach(item => addLocationsWeather(item))

        UI_ELEMENTS.CITIES.forEach(item => {
            const cityStorage = item.textContent = localStorage.getItem('cityName')
            const URL_STORAGE = `${URL.SERVER}?q=${cityStorage}&appid=${URL.APIKEY}`
            render(URL_STORAGE)
        })
    }
}

