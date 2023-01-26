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