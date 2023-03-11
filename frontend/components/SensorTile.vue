<template>
    <div class ="sensor-tile" :class="[selected ? 'selected' : '']" id="#sensorID">
        <div class="sensor-tile-name-container">
            <p class ="sensor-tile-name">{{name}}</p>
        </div>
        <div class = "sensor-tile-data-container">
            <div class ="sensor-value">
                <img src="../assets/svg/thermostat.svg" />
                <p class = "sensor-tile-value-text temp #sensorID">{{ temp }} &#176;C</p>         
            </div>
            <!-- <div class = "seperator"></div> -->
            <div class ="sensor-value">
                <div class="hum-svg"></div>
                <img src="../assets/svg/water-drop.svg" />
                <p class = "sensor-tile-value-text humid s#ensorID" style="margin-left: -15px;">{{ hum }} &#037;</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'tile',
    props: ['name', 'temp', 'hum', 'selected'],
    data() {
        return {
            loading: this.offset ? true : false,
        }
    }
}

</script>

<style scoped>

.sensor-tile {
    /* height: 130px; */
    width: 230px;
    background-color: #a795dea3;
    border-radius: 10px;
    box-shadow: 0px 2px 22px -8px #808080;
    transition: 0.3s;
    left: 0;
    display: flex;
    cursor: pointer;
    flex-direction: column;
    justify-content: center;
    padding-left: 12px;
    padding-right: 12px;
    padding-top: 12px;
    padding-bottom: 12px;
}

/* .sensor-tile:hover {
    background-color: #c29ad9ce;

} */

.skeleton {
  animation-duration: 3s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: skeleton-loading;
  animation-timing-function: linear;
  /* background-color: #f6f7f8; */
  background: linear-gradient(to right,#c8bde88c,#c6aad7ce, #c8bde88c);
  background-size: 800px 104px;
  position: relative;
}

@keyframes skeleton-loading {
  0% {
    background-position: -800px 0;
  }
  100% {
    background-position: 800px 0;
  }
}

.sensor-tile-name-container {
    height: 30px;
}
.sensor-tile-name {
    font-weight: bold;
    margin-top: 0px;
    margin-bottom: 0px;
    color: #ffffff;
    font-size: 20px;
    
}

.sensor-tile-name-skeleton-1 {
    width: 70px;
    height: 7px;
    border-radius: 3px;
    background-color: white;
    margin-left: 8px;
    margin-bottom: 5px;
    margin-top: 5px;
}
.sensor-tile-name-skeleton-2 {
    width: 140px;
    height: 7px;
    border-radius: 3px;
    background-color: white;
    margin-left: 8px
}

.sensor-tile-value-text {
    color: #fff;
    font-size: 20px;
    width: 52px;
}


.sensor-tile.selected {
    background-color: #c29ad9;
    margin-left: 25px;
    flex: auto;
}
.sensor-tile-data-container {
    margin-top: 15px;
    display: flex;
    justify-content: center;
}

.sensor-value {
    display: flex;
    justify-content: center;
    flex:1;
}

.sensor-value p {
    margin-bottom: 0px;
    margin-top: 8px;
}

</style>