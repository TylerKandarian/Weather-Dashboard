let searchform = $("#search-form");
let prevSearch = $("#prev-search");
let weather = $("#current-date");
let forecast = $("#5-day-forecast");
let forecastTitle= $("#forecast-title")

let cityList = []
let isClearing = false;
let clearMessageCode;

// Set the day
let today = dayjs();

function init() {
    searchform.children("button").on("click", getData);
    initiateStorage();
    initiatePrev();
}

function initiateStorage() {
    if(localStorage.getItem("cityList") !== null) {
        cityList = JSON.parse(localStorage.getItem("cityList"));
    }
    localStorage.setItem("cityList", JSON.stringify(cityList));
}

// Creates buttons of previous searches
function initiatePrev() {
    let i = 0;
    while(i < cityList.length && i < 10) {
        let prev = $("<button>");
        prev.text(`${cityList[i]}`);
        prev.attr("class", "col-8 my-1 btn btn-dark");
        prevSearch.append(prev);
        i++;
    }
    prevSearch.children("button").on("click", getData)
}

function getData(event) {
    event.preventDefault();
    let city = "";
    if(event.target.textContent === "Search") {
        city = searchform.children("input").val();
        searchform.children("input").val("");
    } else {
        city = event.target.textContent;
    }
    city = city.toUpperCase();
    if(!city) {
        invalidInput();
        return;
    }

    let requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=5911de58d825147b5fa891cd55dfb5c0&units=metric`;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if(data.length) {
                let lat = data[0].lat;
                let lon = data[0].lon;
                requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=88e8bf6b6b4e9cfb8d121eb3126e42d4&units=metric`;
                fetch(requestUrl)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        displayWeather(data, city);    
                        displayForecast(data);
                        saveCity(city);   
                    });
            } else {
                invalidInput();
            }
        });
}

// Displays the message returned from API
function invalidInput() {
    if(!isClearing) {
        let messageSpace = $("<p>");
        messageSpace.text("Please provide a valid city");
        messageSpace.css("color", "red");
        searchform.append(messageSpace); 
        clearAnswer();  
    } else {
        clearAnswer();
    }
}

// Clears the invalid input message
// Checks if a timeout has already been set
// If it has it clears the previous timeout and calls itself
function clearAnswer() {
    if(isClearing) {
        isClearing = false;
        clearTimeout(clearMessageCode);
        clearAnswer();
    } else {
        isClearing = true;
        clearMessageCode = setTimeout(function() {
            searchform.children().eq(3).remove();
            isClearing = false;
        }, 1500);
    }
}