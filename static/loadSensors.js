/* Obsolete through flask
function loadJSON(url){ 
    
    /* Diese Funktion nimmt eine url und gibt die zugehörige json file als variable in einem JS-DataType (bspw. array oder objekt) zurück 

    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': url,
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
}
*/
/* Obsolete through jinja templating
function insertSensorIntoHTML(sensorID) {

    let sensorTemperatureValue = Object.values(sensorTemperatureData[sensorID])[0];
    var sensorHumidityValue = Object.values(sensorHumidityData[sensorID])[0]; 

    document.write('<div class = "sensor-tile" id = "' + sensorID + '">')
    document.write('    <div class = "sensor-tile-name-container">')
    document.write('        <p class = "sensor-tile-name">'+sensorID+'</p>')
    document.write('    </div>')
    document.write('    <div class = "sensor-tile-data-container">')
    document.write('        <img src="./icons/thermostat.svg" />')
    document.write('        <p class = "sensor-tile-data">'+ sensorTemperatureValue +'°C</p>')
    document.write('        <div class = "seperator"></div>')
    document.write('        <img src="./icons/water-drop.svg" />')
    document.write('        <p class = "sensor-tile-data" style="margin-left: -5px;">'+ sensorHumidityValue +'%</p>')
    document.write('    </div>')                       
    document.write('</div>')

    /** Resulting HTML for each sensor:
     * 
     *   <div class = "sensor-tile selected">
     *       <div class = "sensor-tile-name-container">
     *          <p class ="sensor-tile-name">Black</p>
     *       </div>
     *       <div class = "sensor-tile-data"-container">
     *           <img src="./icons/thermostat.svg" />
     *           <p class = "sensor-tile-data"">6°C</p>
     *           <div class = "seperator"></div>
     *           <img src="./icons/water-drop.svg" />
     *           <p class = "sensor-tile-data"" style="margin-left: -5px;">50%</p>
     *       </div>                          
     *   </div>
}
*/

console.log("Loading available sensor names ... ");
var sensorIDs = loadJSON("./requestSensorIDs.json").slice(0,2);     /* Array: [sensorID1, sensorID2, ... ] // remove slice(0,2) // BACKEND: ersetzen durch ein get-request, das ein php script aufruft, welches wiederum ein array / json-array mit den namen der tabellen (sensoren) aus der datenbank zurückgibt */

console.log("Sensors found: " + sensorIDs);

console.log("Loading value datasets for available sensors...");
var sensorTemperatureData = loadJSON("./requestSensorTemp.json");       /* Object: { "sensorID" : { "timeStamp" : "temperatureValue" } } */
var sensorHumidityData = sensorTemperatureData;                         /* = loadJSON(".requestHumidityTemp.json // Object: { "sensorID" : { "timeStamp" : "humidityValue" } } */

if (Object.keys(sensorTemperatureData).length == sensorIDs.length) console.log("Succes!");

/* Obsolete through jinja templating
for (let i = 0; i < sensorIDs.length; i++) {
    /* Inserting every sensor onto the left website-sideboard (see insertSensorIntoHTML() documentation) 
    insertSensorIntoHTML( sensorIDs[i] );
};
*/