export const storage = {
    saveCurrentCity(cityName) {
        return localStorage.setItem('cityName', JSON.stringify(cityName))
    },

    getCurrentCity() {
        return JSON.parse(localStorage.getItem('cityName'))
    },

    saveFavoriteCities(arrayOfSavedCities) {
        return localStorage.setItem('arrayCity', JSON.stringify(arrayOfSavedCities))
    },

    getFavoriteCities() {
        return JSON.parse(localStorage.getItem('arrayCity'))
    },
}