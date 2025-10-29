const url = "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json"
let pustoy = []

fetch(url)
.then(response => response.json())
.then(data => {
    pustoy = data;
})
.catch(error => console.log(error))

const city = document.getElementById("city")
const divs = document.getElementById("city-divs")

city.addEventListener('input', function() {
    const value = this.value.toLowerCase()
    const newList = pustoy.filter(place =>
        place.city.toLowerCase().startsWith(value)   
    )
    divs.innerHTML = newList
        .map(place => `<div>${place.city}, ${place.state}</div>`)
        .join('')
})

showBtn.addEventListener('click', function(){

    const oldest = pustoy
    city 

})
