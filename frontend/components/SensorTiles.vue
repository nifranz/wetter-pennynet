<template>
    <button class="btn" @click.prevent="toggleLoading()"></button>
    <Loader :loading="loading" />
    <div class = "tiles" :class="[loading ? 'loading' : '']">
        <SensorTileSkeleton v-if="loading" :name="'sname'" :temp="'10'" :hum="'9'" :opacity="1"/>
        <SensorTileSkeleton v-if="loading" :name="'sname'" :temp="'10'" :hum="'9'" :opacity="0.8"/>
        <SensorTileSkeleton v-if="loading" :name="'sname'" :temp="'10'" :hum="'9'" :opacity="0.6"/>
        <SensorTileSkeleton v-if="loading" :name="'sname'" :temp="'10'" :hum="'9'" :opacity="0.4"/>     
        <SensorTile v-if="!loading" 
                    v-for="(sensor) in sensorData" :key="sensor" 
                    :name="sensor.name" 
                    :temp="sensor.temp" 
                    :hum="sensor.hum" 
                    :selected="sensor.selected"
                    @click.prevent="selectTile(sensor)" 
        />
    </div>

</template>

<script>

export default {
    data() {
        return {
            loading: true,
            selectedSensor: null,
            sensorData: [
                {
                    name: 'Black',
                    temp: 10,
                    hum: 37,
                    selected: false
                },
                {
                    name: 'White',
                    temp: 10,
                    hum: 37,
                    selected: false
                },
                {
                    name: 'White',
                    temp: 10,
                    hum: 37,
                    selected: false
                },
                {
                    name: 'White',
                    temp: 10,
                    hum: 37,
                    selected: false
                }
            ]
        }
    },
    created() {
        
    },
    methods: {
        toggleLoading() {
            this.loading = !this.loading;
            this.selectTile(this.sensorData[0])
        },
        selectTile(sensor) {
            if (this.selectedSensor) {
                this.selectedSensor.selected = false;
            }
            this.selectedSensor = sensor;
            sensor.selected = true;
            console.log(sensor);
        }
    }
}
</script>

<style>
.btn {
    width: 50px;
    height: 10px;
}

.tiles {
    position: relative;
    text-align: center;
    display: flex;
    flex-direction: column;
    overflow: auto;
    min-height: min-content;
    padding-top: 20px;
    align-items: center;
    gap:20px;

}::-webkit-scrollbar {
    display: none;
}

.tiles.loading {
    overflow: hidden;
}




</style>