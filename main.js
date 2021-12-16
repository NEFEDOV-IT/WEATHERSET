import {UI_ELEMENTS, URL} from './view.js'

UI_ELEMENTS.button.addEventListener('click', e => e.preventDefault())
UI_ELEMENTS.button.addEventListener('click', cloudResult)

function cloudResult() {
    const input = document.querySelector('.forest__input')
    let city = input.value
    const url = `${URL.server}?q=${city}&appid=${URL.apiKey}`
    const isEmptyFirstName = /^[a-zA-Z]+$/.test(city.trim())

    try {
        input.classList.remove('error')
        if (!isEmptyFirstName) throw new SyntaxError("City is not entered or entered incorrectly, check the correctness of the entry.")
    } catch (e) {
        UI_ELEMENTS.form.reset()
        input.classList.add('error')
        return alert('The data is incomplete: ' + e.message)
    }

    city = capitalLetter(city)

fetch(url)
    .then(response => {
        return response.ok ? response.json() : alert("Ошибка HTTP: " + response.status + `\nГород не найден!`);
    })
    .then(function (answer) {
        UI_ELEMENTS.cities.forEach(item => item.textContent = answer.name)
        UI_ELEMENTS.temperature.forEach(item => item.textContent = Math.round(answer.main.temp))
        UI_ELEMENTS.feels_like.forEach(item => item.textContent = Math.round(answer.main.feels_like))

        const location_li = document.createElement('li')
        location_li.classList.add('mb')
        location_li.textContent = answer.name
        UI_ELEMENTS.locations.prepend(location_li)
    })

    UI_ELEMENTS.form.reset()
}

function capitalLetter(city) {
    let firstLetter = city.split().toString()
    firstLetter = firstLetter[0].toUpperCase() + firstLetter.slice(1)
    return firstLetter
}

const tabs_items = document.querySelectorAll('.tabs-item')
const tabs_blocks = document.querySelectorAll('.tabs-block')

for (let i = 0; i < tabs_items.length; i++) {
    const tabs_item = tabs_items[i]

    tabs_item.addEventListener('click', () => {
        for (let i = 0; i < tabs_items.length; i++) {
            const tabs_item = tabs_items[i]
            tabs_item.classList.remove('active')
            tabs_blocks[i].classList.remove('active')
        }
        tabs_item.classList.add('active')
        tabs_blocks[i].classList.add('active')
    })
}


