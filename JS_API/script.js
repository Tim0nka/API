const url = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json'
let pustoy = []
let flag = 0
let start = 0
let end = 99
const showBtn = document.getElementById('showAll')
const reverseBtn = document.getElementById('reverse')
const formatter = new Intl.NumberFormat('ru-RU');
const buttonUp = document.getElementById('vp')
const buttonDown = document.getElementById('nz')
fetch(url)
.then(response => response.json())
.then(data => {
    pustoy = data;
})
.catch(error => console.log(error))
const city = document.getElementById('city')
const city_divs = document.getElementById('city-divs')
city.addEventListener('input', function() {
    const value = this.value.toLowerCase()

    const newList = pustoy.filter(place => 
        place.city.toLowerCase().startsWith(value) 
    )

    city_divs.innerHTML = newList
        .map(place => `<div>${place.city}, ${place.state}, ${formatter.format(place.population)}, ${place.rank}</div>`)
        .join('')
  });

function params(start, end){
    let oldList = pustoy
    let sliceOldList = oldList.slice(start, end)
    city_divs.innerHTML = sliceOldList
        .map(place => `<div>${place.rank}, ${place.city}, ${place.state}, ${formatter.format(place.population)}</div>`)
        .join('')
}

showBtn.addEventListener('click', function(){
    params(start, end)
    reverseBtn.style.display = 'block'
    showBtn.innerHTML = 'Скрыть все'
    if (flag == 0){
        flag = 1
        console.log(flag)
    } else {
        flag = 0
        city_divs.innerHTML = ''
        showBtn.innerHTML = 'Показать все'
    }

})

buttonUp.addEventListener('click', function(){
    start = start + 100
    end = end + 100
    
    params(start, end)
})

buttonDown.addEventListener('click', function(){
    start = start - 100
    end = end - 100
    
    params(start, end)
})

reverseBtn.addEventListener('click', function(){
    city_divs.innerHTML = ''
    const oldList = pustoy
    const listOld = pustoy.reverse()
    city_divs.innerHTML = oldList
        .map(place => `<div>${place.city}, ${place.state}, ${formatter.format(place.population)}</div>`)
        .join('')

})