<template>
    <div class = "main" >
        <div class = "right-container">
            <div class = "graph-tile">
                <div class = "graph-name"><h3>Temperatur</h3></div>
                <div class ="graph-container">
                    <canvas id="temp"></canvas>
                </div>
            </div>
            <div class ="graph-selection-container">
                <div class = "graph-selection-tile">
                    <div class = "graph-selection">
                        <div class = "graph-selector now" id = "now"><p class ="selector-content">Jetzt</p></div>
                        <div class = "graph-selector lastDay" id ="lastDay"><p class ="selector-content">letzte 24h</p></div>
                        <div class = "graph-selector anyDay" id = "anyDay"><p class ="selector-content">1 Tag</p></div>
                        <div class = "graph-selector week" id = "week"><p class ="selector-content">1 Woche</p></div>                                    
                    </div>
                    <div class = "period-selection-hide period-selection">
                        <div class = "period-selection-date">                                        
                            <input id="startDate"
                                class = "date-selector" 
                                type = "date"
                                value="2022-01-01"
                            >
                        </div>
                        <div class = "period-selection-date">
                            <input id="endDate"
                                class = "date-selector" 
                                type = "date"
                                value="2022-03-01"
                            >
                        </div>
                        <div class = "time-selector-submit"><p class ="selector-content">OK</p></div>
                    </div>
                </div>
            </div>
            <div class = "graph-tile">
                <div class = "graph-name"><h3>Feuchtigkeit</h3></div>
                <div class ="graph-container">
                    <canvas id="humid"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

</script>

<style>
.main {
    flex: 1 1 auto;
    min-width: 500px;
    background-color: #fffffc97;
    border-radius: 0 8px 8px 0;
    overflow-x: hidden;
    overflow-y: auto;
    box-shadow: inset 7px 0 9px -7px rgba(0,0,0,0.15); 
    color: var(--c-text-primary);  
    padding: 20px;
    display: flex;
    justify-content: center;
}

</style>