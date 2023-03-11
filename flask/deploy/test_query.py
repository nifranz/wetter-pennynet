sensorTiles = ["black","white","außen"]
keySensor = sensorTiles[0]
column_names = sensorTiles[0] + ".hum," + sensorTiles[0] + ".temp,"
joins = "(SELECT ROW_NUMBER() OVER(ORDER BY time ASC) ROWNO,temp,hum FROM " + keySensor + ")" + keySensor
i = 1
while (i < len(sensorTiles)):
    sensor = sensorTiles[i]
    column_names = column_names + sensor + ".hum," + sensor + ".temp,"
    joins = joins + " JOIN (SELECT ROW_NUMBER() OVER(ORDER BY time ASC) ROWNO,temp,hum FROM " + sensor + ")" + sensor + " ON " + keySensor + ".ROWNO=" + sensor + ".ROWNO "		
    i = i + 1
print(column_names)
column_names = column_names[:-1]
print(column_names)
sqlquery = "SELECT " + column_names + " FROM " + joins + "LIMIT 1;"
print(sqlquery)


