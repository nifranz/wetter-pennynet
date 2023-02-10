from flask import Flask, render_template, request
import mysql.connector
import json
from connection import mysqlc
import config as cfg

app = Flask(__name__)

def newConnection():
	return mysql.connector.connect(
		user=mysqlc['db_user'], 
		password=mysqlc['db_password'], 
		host=mysqlc['db_host'], 
		database=mysqlc['db_database'] # test
	)

def getInitData(conn, sensorTiles):
	# getInitData returns an array containing the data needed from the database to display 

	# building the sql-query with joins for every sensor tile
	# example sql-query for joining black and white in SQLQUERY.text
	keySensor = sensorTiles[0]
	column_names = sensorTiles[0] + ".temp," + sensorTiles[0] + ".hum,"
	joins = "(SELECT ROW_NUMBER() OVER(ORDER BY time ASC) ROWNO,temp,hum FROM " + keySensor + ")" + keySensor
	i = 1
	while (i < len(sensorTiles)):
		sensor = sensorTiles[i]
		column_names = column_names + sensor + ".temp," + sensor + ".hum,"
		joins = joins + " JOIN (SELECT ROW_NUMBER() OVER(ORDER BY time ASC) ROWNO,temp,hum FROM " + sensor + ")" + sensor + " ON " + keySensor + ".ROWNO=" + sensor + ".ROWNO "		
		i = i + 1
	print(column_names)
	column_names = column_names[:-1]
	print(column_names)
	sqlquery = "SELECT " + column_names + " FROM " + joins + "LIMIT 1;"
	cursor = conn.cursor()
	cursor.execute(sqlquery)
	data = cursor.fetchall()[0]

	sensorTileData = {}
	i = 0
	for sensor in sensorTiles:
		# building an object "sensorValues" to hold both temp and hum values for the current sensor --> {"temp": value, "hum": value}
		sensorValues = {}
		sensorValues["temp"] = data[i]
		i += 1
		sensorValues["hum"] = data[i]
		i *= 1

		# adding the sensorValues object into the sensorTileData object with the current sensor as the key --> {... "sensor": {"temp": value, "hum": value}, ...}
		sensorTileData[sensor] = sensorValues

	return json.dumps(sensorTileData, indent = 4)

def getSensorTileData(conn, sensorTiles):
	cursor = conn.cursor()	
	sensorTileData = {}
	for sensorTile in sensorTiles: # for each given sensor tile: fetch first row (most recent logged data) of temp and humid values
		currSensorTileData = {}
		cursor.execute("SELECT temp, hum FROM " + sensorTile + " ORDER BY time DESC LIMIT 1") # fetching first row of temp and humid column for current sensorTile
		data = cursor.fetchall() # Saving fetched data into variable
		for row in data:
			tempValue = str(row[0])
			humidValue = str(row[1])
			currSensorTileData["temp"] = tempValue
			currSensorTileData["humid"] = humidValue
		sensorTileData[sensorTile] = currSensorTileData
	sensorTileData = json.dumps(sensorTileData, indent = 4)
	print( sensorTileData)
	return sensorTileData # returning the JSON FORMATTED variable containing the current temperature-value and humid-value of all selected sensors

def getMinMaxTimestamps(conn, sensorTiles):
	cursor = conn.cursor()
	minMaxTimestamps = {}
	for sensorTile in sensorTiles: # for each sensor Tile: fetch startTimestamp and stopTimestamp from DB
		currSensorTileData = {}
		# get startTimestamp for current sensorTile from DB
		cursor.execute("SELECT time FROM " + sensorTile + " ORDER BY time ASC LIMIT 1")
		minTimestamp = str(cursor.fetchall()[0][0])
		currSensorTileData["minTimestamp"] = minTimestamp
		# get stopTimestamp for current sensorTile from DB
		cursor.execute("SELECT time FROM " + sensorTile + " ORDER BY time DESC LIMIT 1")
		maxTimestamp = str(cursor.fetchall()[0][0])
		currSensorTileData["maxTimestamp"] = maxTimestamp
		minMaxTimestamps[sensorTile] = currSensorTileData
	minMaxTimestamps = json.dumps(minMaxTimestamps, indent = 4)
	print(minMaxTimestamps)
	return minMaxTimestamps

def getSensorTiles(conn):
	cursor = conn.cursor()
	cursor.execute("SELECT DISTINCT TABLE_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE COLUMN_NAME IN('temp', 'hum')")
	tables = cursor.fetchall()
	sensorTiles = []
	for tile in tables:
		sensorTiles.append(str(tile[0]))
	return sensorTiles

@app.route("/")
def index():
	conn = newConnection()

	if (cfg.USE_CUSTOM_SENSORS):
		sensorTiles = cfg.CUSTOM_SENSORS
	else:
		sensorTiles = getSensorTiles(conn)

	print(getInitData(conn,sensorTiles))
	sensorTileData = getSensorTileData(conn, sensorTiles)
	minMaxTimestamps = getMinMaxTimestamps(conn, sensorTiles)
	return render_template('index.html', sensorTiles = sensorTiles, sensorTileData = sensorTileData, minMaxTimestamps = minMaxTimestamps)

@app.route('/requestData', methods = ['POST'])
def reqData():
	conn = newConnection()
	cursor = conn.cursor()
	try:
		requestParams = request.get_json() # JSON Object: {"sensorIDs" : ['sensorID1','sensorID2','...'], "startTimestamp": "startTimestamp", "stopTimestamp" : "stopTimestamp"}
		requestID = requestParams["sensorIDs"]
		requestStartTimestamp = requestParams["startTimestamp"]
		requestStopTimestamp = requestParams["stopTimestamp"]
		returnData = {}
		tempData = {}
		humidData = {}

		sql = "SELECT time, temp, hum FROM " + str(requestID) + " WHERE time > " + str(requestStartTimestamp) + " && time < " + str(requestStopTimestamp)
		cursor.execute(sql)
		table = cursor.fetchall()

		if len(table) == 0:
			raise Exception("Query has returned 0 rows")
		for row in table:
			timestamp = str(row[0])
			tempValue = row[1]
			humidValue = row[2]
			tempData[timestamp] = tempValue
			humidData[timestamp] = humidValue

		returnData["tempData"] = tempData
		returnData["humidData"] = humidData

		returnData = json.dumps(returnData, indent = 4)
		return str(returnData) # JSON Object: {"sensorID1": {"tempData": {"timestamp1" : "value1", "timestamp2" : "value2", ...}, "humidData": {"timestamp1" : "value1", "timestamp2" : "value2", ...}}, "sensorID2" : {}, ...}
	except Exception as e:
		print("AJAX excepted: " + str(e))
		return str(e), 416


@app.route('/requestNow', methods = ['POST'])
def reqNow():
	conn = newConnection()
	cursor = conn.cursor()
	try:
		requestParams = request.get_json() # JSON Object: {"sensorIDs" : ['sensorID1','sensorID2','...'], "startTimestamp": "startTimestamp", "stopTimestamp" : "stopTimestamp"}
		requestID = requestParams["sensorIDs"]
		startTimestamp = "-99" # implement python time (calc from current time -5h)

		returnData = {}
		tempData = {}
		humidData = {}

		sql = "SELECT time, temp, hum FROM " + str(requestID) + " WHERE time > " + str(requestStartTimestamp)
		cursor.execute(sql)
		table = cursor.fetchall()

		if len(table) == 0:
			raise Exception("Query has returned 0 rows")
		for row in table:
			timestamp = str(row[0])
			tempValue = row[1]
			humidValue = row[2]
			tempData[timestamp] = tempValue
			humidData[timestamp] = humidValue

		returnData["tempData"] = tempData
		returnData["humidData"] = humidData

		returnData = json.dumps(returnData, indent = 4)
		return str(returnData) # JSON Object: {"sensorID1": {"tempData": {"timestamp1" : "value1", "timestamp2" : "value2", ...}, "humidData": {"timestamp1" : "value1", "timestamp2" : "value2", ...}}, "sensorID2" : {}, ...}
	except Exception as e:
		print("AJAX excepted: " + str(e))
		return str(e), 416

@app.route('/requestLastDay', methods = ['POST'])
def reqLastDay():
	conn = newConnection()
	cursor = conn.cursor()
	try:
		requestParams = request.get_json() # JSON Object: {"sensorIDs" : ['sensorID1','sensorID2','...'], "startTimestamp": "startTimestamp", "stopTimestamp" : "stopTimestamp"}
		requestID = requestParams["sensorIDs"]
		startTimestamp = "-99" # implement python time (calc from time now -24h)

		returnData = {}
		tempData = {}
		humidData = {}

		sql = "SELECT time, temp, hum FROM " + str(requestID) + " WHERE time > " + str(startTimestamp)
		cursor.execute(sql)
		table = cursor.fetchall()

		if len(table) == 0:
			raise Exception("Query has returned 0 rows")
		for row in table:
			timestamp = str(row[0])
			tempValue = row[1]
			humidValue = row[2]
			tempData[timestamp] = tempValue
			humidData[timestamp] = humidValue

		returnData["tempData"] = tempData
		returnData["humidData"] = humidData

		returnData = json.dumps(returnData, indent = 4)
		return str(returnData) # JSON Object: {"sensorID1": {"tempData": {"timestamp1" : "value1", "timestamp2" : "value2", ...}, "humidData": {"timestamp1" : "value1", "timestamp2" : "value2", ...}}, "sensorID2" : {}, ...}
	except Exception as e:
		print("AJAX excepted: " + str(e))
		return str(e), 416

@app.route('/requestAnyDay', methods = ['POST'])
def reqAnyDay():
	conn = newConnection()
	cursor = conn.cursor()
	try:
		requestParams = request.get_json() # JSON Object: {"sensorIDs" : ['sensorID1','sensorID2','...'], "startTimestamp": "startTimestamp", "stopTimestamp" : "stopTimestamp"}
		requestID = requestParams["sensorIDs"]
		requestDay = "01/01/1970" 
		startTimestamp = "-99" # implement python time (calc from requestDay)
		stopTimestamp = "-99" # implement python time (calc from requestDay)

		returnData = {}
		tempData = {}
		humidData = {}

		sql = "SELECT time, temp, hum FROM " + str(requestID) + " WHERE time > " + str(startTimestamp)
		cursor.execute(sql)
		table = cursor.fetchall()

		if len(table) == 0:
			raise Exception("Query has returned 0 rows")
		for row in table:
			timestamp = str(row[0])
			tempValue = row[1]
			humidValue = row[2]
			tempData[timestamp] = tempValue
			humidData[timestamp] = humidValue

		returnData["tempData"] = tempData
		returnData["humidData"] = humidData

		returnData = json.dumps(returnData, indent = 4)
		return str(returnData) # JSON Object: {"sensorID1": {"tempData": {"timestamp1" : "value1", "timestamp2" : "value2", ...}, "humidData": {"timestamp1" : "value1", "timestamp2" : "value2", ...}}, "sensorID2" : {}, ...}
	except Exception as e:
		print("AJAX excepted: " + str(e))
		return str(e), 416


@app.route('/requestAnyPeriod', methods = ['POST'])
def reqAnyPeriod():
	conn = newConnection()
	cursor = conn.cursor()
	try:
		requestParams = request.get_json() # JSON Object: {"sensorIDs" : ['sensorID1','sensorID2','...'], "startTimestamp": "startTimestamp", "stopTimestamp" : "stopTimestamp"}
		requestID = requestParams["sensorIDs"]
		requestStartDay = requestParams["startTimestamp"]
		requestStopDay = requestParams["stopTimestamp"]
		startTimestamp = "-99" # calc from requestStartDay
		stopTimestamp = "-99" # calc from requestStartDay

		returnData = {}
		tempData = {}
		humidData = {}

		sql = "SELECT time, temp, hum FROM " + str(requestID) + " WHERE time > " + str(startTimestamp) + " && time < " + str(stopTimestamp)
		cursor.execute(sql)
		table = cursor.fetchall()

		if len(table) == 0:
			raise Exception("Query has returned 0 rows")
		for row in table:
			timestamp = str(row[0])
			tempValue = row[1]
			humidValue = row[2]
			tempData[timestamp] = tempValue
			humidData[timestamp] = humidValue

		returnData["tempData"] = tempData
		returnData["humidData"] = humidData

		returnData = json.dumps(returnData, indent = 4)
		return str(returnData) # JSON Object: {"sensorID1": {"tempData": {"timestamp1" : "value1", "timestamp2" : "value2", ...}, "humidData": {"timestamp1" : "value1", "timestamp2" : "value2", ...}}, "sensorID2" : {}, ...}
	except Exception as e:
		print("AJAX excepted: " + str(e))
		return str(e), 416


if __name__ == "__main__":
    app.run(debug=True)


    ##  Dateiname: app.py OLD!!
    ##
    ##  MVC-Component: Model
    ##  
    ##  Diese Datei soll bei Aufruf durch die Controller-Komponente (clientseitiges JavaScript) eine MySQL-Datenbankabfrage 
    ##  durchführen, die gesammelten Daten im JSON Format speichern und in einer JSON Datei an den Aufrufer 
    ##  zurückgeben. Dabei soll es möglich sein, die Datenbankabfrage durch Übergabe von verschiedenen 
    ##  URL-Parametern bei Aufruf der Datei zu filtern. Außerdem sollen die Ergebnisse eine bestimmte Länge 
    ##  nicht überschreiten. Werden zum Beispiel mehr Dateneinträge zurückgegeben als ein bestimmtes Limit erlaubt, 
    ##  soll die Anzahl der Einträge auf dieses Limit reduziert werden, bevor sie gesammelt der Controller-Komponente 
    ##  4zurückgegeben werden.
    ##
    ##  Parameter 'sensorID':
    ##      Dieser Parameter reduziert die Datenbankabfrage auf die Tabelle mit dem Namen 'sensorID'.
    ##      Bei sensorID = 'all' werden nur die Namen (sensorIDs) der verfügbaren Tabellen
    ##      sowie der timestamps des ersten und letzten Eintrags für jede Tabelle zurückgegeben.
    ##
    ##  Parameter 'startTimestamp': 
    ##      Dieser Parameter reduziert die Datenbankabfrage auf alle Ergebnisse, 
    ##      die nach dem übergebenen Zeitpunkt 'startTimestamp' eingetragen wurden.
    ##
    ##  Parameter 'endTimestamp':
    ##      Dieser Parameter reduziert die Datenbankabfrage auf alle Ergebnisse, 
    ##      die nach dem übergebenen Zeitpunkt 'endTimestamp' eingetragen wurden.
    ##
    ##  Parameter 'limit':
    ##      Dieser Parameter setzt ein Limit für die maximale Anzahl der zurückgegeben Dateneinträge fest.
    ##
    ##  Das zurückgegebenes JSON Object soll folgende Formatierung besitzen: 
    ##  
    ##      { sensorID : { tempData : { timestamp : temperatureValue }, humidData : { timestamp : humidityValue } } 
    ##  
    ##  Bei 'sensorID' == 'all' ändert sich die Formatierung: 
    ##
    ##      { sensorID : [ startDate, endDate ] }
    ##
