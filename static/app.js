window.onload = function() {
    initSite();
}
// test
function initSite() {
// Initializing reusable variables
    /** Usable variables passed to this script through flask & jinja in HTML:
     * sensorIDs = Array: [sensorID1, sensorID2, ... ] 
     *      => All available Sensor-IDs
     * sensorTileData = Object: {'sensorID' : {'temp' : {'timestamp' : "timestampValue", 'value' : "17"}, 'humid' : {'timestamp' : "1635696012", 'value' : "17"}}, 'white' : {'temp' : {'timestamp' : "1635696012", 'value' : "17"}, 'humid' : {'timestamp' : "1635696012", 'value' : "17"}}}
     *      => Temperature and Humidity Snapshot (values of the last entry in DB) for every sensorID
     * minMaxTimestamps : Object: {'sensorID1' : {'minTimestamp' : 'timestamp', 'maxTimestamp' : 'timestamp'}, 'sensorID2' : {...}, ...}
     *      => first (minTimestamp) and last (maxTimestamp) timestamp-values for every sensorID
     */

    window.tempChart = undefined;
    window.humidChart = undefined;

    let currentSelectedSensorID = sensorIDs[0]
    let currentSelectedTimePeriod = "now"

// Initializing UI
    displayTime(); 
    let timer = setInterval(() => {
        displayTime();
    }, 1000)

    //Initializing UI: adding visual clues for selected senorTile and timePeriodSelector
    document.getElementById(currentSelectedSensorID).classList.add("selected");
    document.getElementById(currentSelectedTimePeriod).classList.add("selected");

// Initializing UI: Adding sensorID values to sensorTiles
    for (i = 0; i < sensorIDs.length; i++) {
        let tempElement = document.getElementsByClassName("sensor-tile-data temp " + sensorIDs[i])
        let humidElement = document.getElementsByClassName("sensor-tile-data humid " + sensorIDs[i])
        tempElement[0].innerText = sensorTileData[sensorIDs[i]]["temp"] + tempElement[0].innerText 
        humidElement[0].innerText = sensorTileData[sensorIDs[i]]["humid"] + humidElement[0].innerText
    }

// Getting Data and Drawing Charts

    updateUI(currentSelectedSensorID, currentSelectedTimePeriod);

// Initializing UI: Button Style and Button Logic
// Adding event-listeners

    for (let i = 0; i < sensorIDs.length; i++) {
    // Adding eventListeners to every sensor-tile
        
        let sensorID = sensorIDs[i]
        let sensorElement = document.getElementById(sensorID); /* HTML element associated with the sensor */
        console.log(sensorElement);

        sensorElement.addEventListener("click", e => {
            
            /* If a sensor element is clicked, the UI should be updated in the documented way */
            
            if (!sensorElement.classList.contains("selected")) {
                currentSelectedSensorID = sensorIDs[i];
                let currentSelectedSensorElement = document.getElementsByClassName("selected")[0];
                sensorElement.classList.add("selected");               
                currentSelectedSensorElement.classList.remove("selected")

                updateUI(currentSelectedSensorID, currentSelectedTimePeriod);
            }
        })
    }

    /* 2: Adding eventListeners for every time-period-select element ( (Jetzt) - (letzte 24h) - (1 Tag) - (1 Woche) ) */

// EventListener for timePeriodElement : now
    let timePeriodElement_Now = document.getElementsByClassName("graph-selector now")[0];
    timePeriodElement_Now.addEventListener('click', e => {
        let timeSelectHidden = document.getElementsByClassName("period-selection-hide")[0]; /* Boolean: true, if time select panel is hidden, false if otherwise */
        if (!timeSelectHidden) {
            hideElement = document.getElementsByClassName('period-selection')[0];
            hideElement.classList.add("period-selection-hide");
            timeSelectHidden = true;
        }

        let currentSelectedTimePeriodElement = document.getElementsByClassName("graph-selector selected")[0];

        let timePeriodElement = e.target;
        if (timePeriodElement.tagName == "P") {
            timePeriodElement = timePeriodElement.parentElement;
        }

        if (timePeriodElement != currentSelectedTimePeriodElement) {
            timePeriodElement.classList.add("selected");
            currentSelectedTimePeriodElement.classList.remove("selected");
        }

        currentSelectedTimePeriod = "now"
        updateUI(currentSelectedSensorID, currentSelectedTimePeriod);
    })

    // EventListener for timePeriodElement : lastDay
    let timePeriodElement_lastDay = document.getElementsByClassName("graph-selector lastDay")[0];
    timePeriodElement_lastDay.addEventListener('click', e => {
        let timeSelectHidden = document.getElementsByClassName("period-selection-hide")[0]; /* Boolean: true, if time select panel is hidden, false if otherwise */
        if (!timeSelectHidden) {
            hideElement = document.getElementsByClassName('period-selection')[0];
            hideElement.classList.add("period-selection-hide");
            timeSelectHidden = true;
        }

        let currentSelectedTimePeriodElement = document.getElementsByClassName("graph-selector selected")[0];

        let timePeriodElement = e.target;
        if (timePeriodElement.tagName == "P") {
            timePeriodElement = timePeriodElement.parentElement;
        }

        if (timePeriodElement != currentSelectedTimePeriodElement) {
            timePeriodElement.classList.add("selected");
            currentSelectedTimePeriodElement.classList.remove("selected");
        }

        currentSelectedTimePeriod = "lastDay"
        updateUI(currentSelectedSensorID, currentSelectedTimePeriod);
    })

    // EventListener for timePeriodElement : anyDay   
    let timePeriodElement_anyDay = document.getElementsByClassName("graph-selector anyDay")[0]; 
    timePeriodElement_anyDay.addEventListener('click', e => {
        /* UI animation of time-period selector */

        let timeSelectHidden = document.getElementsByClassName("period-selection-hide")[0]; /* Boolean: true, if time select panel is hidden, false if otherwise */
        let hideElement;
        
        if (timeSelectHidden) {
            hideElement = document.getElementsByClassName('period-selection-hide')[0];
            hideElement.classList.remove("period-selection-hide");
            timeSelectHidden = false;
        }

        let endDateNotHidden = document.getElementsByClassName("period-selection-date")[1];

        if (endDateNotHidden) {
            endDateNotHidden.classList.add("period-selection-date-hide");
            endDateNotHidden.classList.remove("period-selection-date");
        }

        let currentSelectedTimePeriodElement = document.getElementsByClassName("graph-selector selected")[0];

        let timePeriodElement = e.target;
        if (timePeriodElement.tagName == "P") {
            timePeriodElement = timePeriodElement.parentElement;
        }

        if (timePeriodElement != currentSelectedTimePeriodElement) {
            timePeriodElement.classList.add("selected");
            currentSelectedTimePeriodElement.classList.remove("selected");
        }

        currentSelectedTimePeriod = "anyDay"        
        updateUI(currentSelectedSensorID, currentSelectedTimePeriod);
    })

    // EventListener for timePeriodElement : week
    let timePeriodElement_week = document.getElementsByClassName("week")[0]; 
    timePeriodElement_week.addEventListener('click', e => {
        let timeSelectHidden = document.getElementsByClassName("period-selection-hide")[0]; /* Boolean: true, if time select panel is hidden, false if otherwise */
        let hideElement;
        
        if (timeSelectHidden) {
            hideElement = document.getElementsByClassName('period-selection-hide')[0];
            hideElement.classList.remove("period-selection-hide");
            timeSelectHidden = false;
        }

        let endDateHidden = document.getElementsByClassName("period-selection-date-hide")[0];

        if (endDateHidden) {
            endDateHidden.classList.add("period-selection-date");
            endDateHidden.classList.remove("period-selection-date-hide");
        }

        let currentSelectedTimePeriodElement = document.getElementsByClassName("graph-selector selected")[0];

        let timePeriodElement = e.target;
        if (timePeriodElement.tagName == "P") {
            timePeriodElement = timePeriodElement.parentElement;
        }

        if (timePeriodElement != currentSelectedTimePeriodElement) {
            timePeriodElement.classList.add("selected");
            currentSelectedTimePeriodElement.classList.remove("selected");
        }
        currentSelectedTimePeriod = "week"
        updateUI(currentSelectedSensorID, currentSelectedTimePeriod);
    })
    
    // EventListener for timePeriodSubmitButton
    let timePeriodSubmitElement = document.getElementsByClassName("time-selector-submit")[0]
    timePeriodSubmitElement.addEventListener("click", e => { 
        let startDateInputElement = document.getElementById("startDate");
        let startDate = new Date(startDateInputElement.getAttribute("value"))
        let startTimestamp = Math.floor(startDate.getTime()/1000 + startDate.getTimezoneOffset() * 60)
        let stopTimestamp = undefined;

        if (currentSelectedTimePeriod == "anyDay") {
            stopTimestamp = startTimestamp + (24 * 60 * 60)
        } else if (currentSelectedTimePeriod == "week") {
            let endDateInputElement = document.getElementById("endDate");
            let stopDate = new Date(endDateInputElement.getAttribute("value"))
            stopTimestamp = Math.floor(stopDate.getTime()/1000)
        }

        requestData(currentSelectedSensorID, startTimestamp, stopTimestamp, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                data = JSON.parse(data)
                sensorTemperatureData = data["tempData"]
                sensorHumidityData = data["humidData"]
                drawContentForSensor(sensorTemperatureData, sensorHumidityData);
            }
        });
    })

    // EventListener for dateInputElement
    let startDateInputElement = document.getElementById("startDate");
    let endDateInputElement = document.getElementById("endDate"); 
    startDateInputElement.addEventListener("input", e => {
    /* If startDateInputElement value changes, it should update its HTML value as well as 
    * update the minimum possible value of the endDateInputElement to avoid time-period overlaps when selecting an endDate
    */
        if (e.target.value != "") { // Avoid changes when date is cleared through the UI
            tempDate = new Date(e.target.value)
            tempDate.setDate(tempDate.getDate() + 1)
            endDateInputElement.setAttribute("min", tempDate.toISOString().split('T')[0])
            startDateInputElement.setAttribute("value", e.target.value)
            startDateInputElement.value = e.target.value

        }
    }) 
    endDateInputElement.addEventListener("input", e => {
    /* If endtDateInputElement value changes, it should update its HTML value as well as 
    * update the maximum possible value of the startDateInputElement to avoid time-period overlaps when selecting a start Date
    */
        if (e.target.value != "") { // Avoid changes when date is cleared through the UI
            tempDate = new Date(e.target.value)
            tempDate.setDate(tempDate.getDate() - 1)
            startDateInputElement.setAttribute("max", tempDate.toISOString().split('T')[0])
            endDateInputElement.setAttribute("value", e.target.value)
        }
    })
}

function formatTime(timestamp) {
    let date = new Date(timestamp * 1000);
    let hours = date.getHours();
    if (hours < 10) {
        hours = "0" + hours;
    }
    let minutes = date.getMinutes(); 
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return hours + ":" + minutes
}

function displayTime() {
    let dateElement = document.getElementById("date");
    let timeString = ("" + new Date()).split(" ")[4];
    dateElement.innerText = timeString;
}

function calcAverage(data) {
    var sum = data.reduce(function(sum, arr) {
      return sum + arr;
    }, 0);
    return sum / data.length;
}

function drawTempChart(sensorTemperatureData) {

    let labels = Object.keys(sensorTemperatureData);
    for (i = 0; i < labels.length; i++) {
        labels[i] = formatTime(labels[i]);
    }
    let dataset = Object.values(sensorTemperatureData);

    let averageLineDataset = dataset.map(() => (Math.round(calcAverage(dataset))))
    console.log(averageLineDataset);
    //let averageLineData = getAverageLineData(Object.values(sensorTemperatureData))
    //console.log(averageLineData)

    const ctx = document.getElementById("temp").getContext('2d');
    
    var gradientFill = ctx.createLinearGradient(0,350,0,0);
    gradientFill.addColorStop(1, "#e8acd3");
    gradientFill.addColorStop(0, "#f599a518");

    /*const annotation = {
        type: 'line',
        borderColor: 'black',
        borderDash: [6, 6],
        borderDashOffset: 0,
        borderWidth: 3,
        label: {
          enabled: true,
          content: "average",
          position: 'end'
        },
        scaleID: 'y',
        value: averageLineData
    };*/

    const myChart = new Chart(ctx, {
        data: {
            labels: labels,
            datasets: [{
                type: 'line',
                data: averageLineDataset,
                borderColor: "#000000aa",
                borderDash: [10,5],
                pointRadius: 0,
                pointHoverRadius: 0
            }, {
                type: 'line',
                data: dataset,
                borderColor: "#c29ad9",
                pointBorderColor: "#c29ad9ce",
                pointBackgroundColor: "#c29ad9ce",
                pointHoverBackgroundColor: "#c29ad9ce",
                pointHoverBorderColor: "#c29ad9ce",
                pointBorderWidth: 10,
                pointHoverRadius: 10,
                pointHoverBorderWidth: 0,
                pointRadius: 0,
                tension: 2
            }, {
                type: 'bar',
                data: dataset,
                backgroundColor: gradientFill,
                fill: true,
                categoryPercentage: 1,
                barPercentage: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                  display: false
                }/*,
                //annotation: {
                    annotations: {
                        annotation
                    }
                }*/
            },    
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
        
            scales: {

                x: {
                    ticks: {
                        maxTicksLimit: 11
                    }
                },
                y: {
                    beginAtZero: true
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
    return myChart;
}

function drawHumidChart(sensorHumidityData) {
    let labels = Object.keys(sensorHumidityData);
    for (i = 0; i < labels.length; i++) {
        labels[i] = formatTime(labels[i]);
    }
    let dataset = Object.values(sensorHumidityData);

    let type = "line";

    const ctx = document.getElementById("humid").getContext('2d');

    var gradientFill = ctx.createLinearGradient(0,350,0,0);
    gradientFill.addColorStop(1, "#e8acd3");
    gradientFill.addColorStop(0, "#f599a518");

    const myChart = new Chart(ctx, {
    type: type,
    data: {
        labels: labels,
        datasets: [{
            data: dataset,
            backgroundColor: gradientFill,
            borderColor: "#c29ad9",
            pointBorderColor: "#c29ad9ce",
            pointBackgroundColor: "#c29ad9ce",
            pointHoverBackgroundColor: "#c29ad9ce",
            pointHoverBorderColor: "#c29ad9ce",
            pointBorderWidth: 10,
            pointHoverRadius: 10,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true
        }]
        },
        options: {
            plugins: {
                legend: {
                  display: false
                }
            },    
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
        
            scales: {

                x: {
                    ticks: {
                        maxTicksLimit: 11
                    }
                },
                y: {
                    beginAtZero: true
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
    return myChart;
}

function destroyCharts() {
    if ( tempChart ) {
        tempChart.destroy();
    }
    if ( humidChart ) {
        humidChart.destroy();
    }
}

function requestData (sensorIDs, startTimestamp, stopTimestamp, callback) {
    // Logging request parameters to console
    console.log(
        "Request: \n    SensorID: "+ sensorIDs
        + "\n    startDate: " + new Date(startTimestamp * 1000) + " (from startTimestamp: " + startTimestamp + ")"
        + "\n    stopDate: " + new Date(stopTimestamp * 1000)) + " (from stopTimestamp: " + stopTimestamp + ")"

    // building the request
    const request = new XMLHttpRequest();
    request.open('POST', 'requestData');
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    // handling the return message by adding a eventListener to the request
    request.addEventListener('readystatechange', () => {
        if(request.readyState == 4 && request.status == 200){
            // If XMLRequest is successful, return the XMLRequest responseText (= the value array returned from server) to the callback function
            callback(undefined, request.responseText);
        } else if(request.readyState == 4) {
            // If XMLRequest is unsuccessfull, return the XMLRequest responseText (= the returned error message from server) to the callback function
            callback(request.responseText, undefined)
        }
    });

    // sending the request
    request.send(JSON.stringify({"sensorIDs" : sensorIDs, "startTimestamp" : startTimestamp, "stopTimestamp" : stopTimestamp}));
}

function drawContentForSensor(sensorTemperatureData, sensorHumidityData, currentSelectedTimePeriod) {
    destroyCharts();

    window.tempChart = drawTempChart(sensorTemperatureData, currentSelectedTimePeriod);
    window.humidChart = drawHumidChart(sensorHumidityData, currentSelectedTimePeriod);
}

function updateDateInputMinMax (minTimestamp, maxTimestamp) {
    let minDate = new Date(minTimestamp * 1000).toISOString().split('T')[0];
    let maxDate = new Date(maxTimestamp * 1000).toISOString().split('T')[0];

    let startDateInputElement = document.getElementById("startDate");
    let endDateInputElement = document.getElementById("endDate");

    startDateInputElement.setAttribute("min", minDate);
    startDateInputElement.setAttribute("max", endDateInputElement.getAttribute("value"));

    endDateInputElement.setAttribute("min", startDateInputElement.getAttribute("value"));
    endDateInputElement.setAttribute("max", maxDate);

}

function updateUI(currentSelectedSensorID, currentSelectedTimePeriod) {
    let startTimestamp;
    let stopTimestamp;
    let minTimestamp = minMaxTimestamps[currentSelectedSensorID]["minTimestamp"]
    let maxTimestamp = minMaxTimestamps[currentSelectedSensorID]["maxTimestamp"]

    destroyCharts();

    if (currentSelectedTimePeriod == "now" || currentSelectedTimePeriod == "lastDay") {
        let timespanInHours;
        
        if (currentSelectedTimePeriod == "now") {
            timespanInHours = 5;
        } else if (currentSelectedTimePeriod == "lastDay") {
            timespanInHours = 24;
        }

        stopTimestamp = Date.now() / 1000
        startTimestamp = stopTimestamp - (60 * 60 * timespanInHours)
    
        if (startTimestamp < minTimestamp) {
            startTimestamp = minTimestamp
        }

    } else if (currentSelectedTimePeriod == "anyDay" || currentSelectedTimePeriod == "week") {
        let timespanInDays;

        if (currentSelectedTimePeriod == "anyDay") {
            timespanInDays = 1;
        } else if (currentSelectedTimePeriod == "week") {
            timespanInDays = 7;
        }

        stopTimestamp = maxTimestamp;
        startTimestamp = stopTimestamp - (60 * 60 * 24 * timespanInDays)
    
        if (startTimestamp < minTimestamp) {
            startTimestamp = minTimestamp
        }
    
        let startDateInputElement = document.getElementById("startDate");
        startDateInputElement.setAttribute("value", new Date(startTimestamp * 1000).toISOString().split('T')[0]);
        startDateInputElement.value = new Date(startTimestamp * 1000).toISOString().split('T')[0];
    
        let endDateInputElement = document.getElementById("endDate");
        endDateInputElement.setAttribute("value", new Date(stopTimestamp * 1000).toISOString().split('T')[0]);
        endDateInputElement.value = new Date(stopTimestamp * 1000).toISOString().split('T')[0];
    
        updateDateInputMinMax(minTimestamp, maxTimestamp);
    }

    requestData(currentSelectedSensorID, startTimestamp, stopTimestamp, (err,data) => {
        if (err) {
            console.log(err);
        } else {
            data = JSON.parse(data)
            sensorTemperatureData = data["tempData"]
            sensorHumidityData = data["humidData"]
            drawContentForSensor(sensorTemperatureData, sensorHumidityData, currentSelectedTimePeriod);
        }
    });
}