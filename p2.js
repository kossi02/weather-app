const init = () => {
    let weatherButton = document.querySelector("#getWeather");
    weatherButton.addEventListener("click", getWeatherInfo);
    document.getElementById("one").style.display = "none";
    document.getElementById("two").style.display = "none";
    document.getElementById("three").style.display = "none";
}

const getWeatherInfo = async () => {
    const zipCode = document.querySelector("#zip").value;
    let info = await getCoordinatesInfo(zipCode);
    let weatherInfo = await getWeather(info);
    //console.log(info);
    console.log(weatherInfo);
    let city = document.querySelector("#city");
    let temperature = document.querySelector("#temp");
    let wind = document.querySelector("#wind");


    //img.setAttribute("src", "1.jpeg");
    let unit = `${weatherInfo.temperature}`;
    let speed = `${weatherInfo.wind}`;
    if(unit < 35 ) {
        document.getElementById("one").style.display = "inline";
    } else if (unit > 83) {
        document.getElementById("two").style.display = "inline";
    }

    if(speed > 15) {
        document.getElementById("three").style.display = "inline";
    }

    temperature.innerHTML = "Temperature: " + unit + "\u00B0 Farenheit ";
    city.innerHTML = `${weatherInfo.location}`;
    wind.innerHTML = "Wind: " + speed + "mph";
}

async function getCoordinatesInfo(zipCode) {
    const countryCode = "US"
    let url = `http://api.geonames.org/postalCodeSearchJSON?username=kossin&postalcode=${zipCode}&country=${countryCode}`;

    let zipPromise = fetch(url);

    let coordinates = await zipPromise.then(results => {
        return results.json();
    }).then(jsonResults => {
        return {"lat": jsonResults.postalCodes[0].lat,
                "lng": jsonResults.postalCodes[0].lng};
    });
    return coordinates;
}

const getWeather = async (location) => {
    let weatherURL = `http://api.geonames.org/findNearByWeatherJSON?username=kossin&lat=${location.lat}&lng=${location.lng}`;
    return await fetch(weatherURL).then(data => data.json()).then(jsonData => {
        return {
            "temperature": (jsonData.weatherObservation.temperature * (9/5) + 32).toFixed(0),
            "wind": jsonData.weatherObservation.windSpeed,
            "location": jsonData.weatherObservation.stationName
        }
    });
}

window.onload = init;
