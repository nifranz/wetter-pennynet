<template>
    <div class ="loader-container">
        <span :style="[loading ? 'opacity: 1;' : 'opacity: 0;']" class="loader"></span>
    </div>
    
</template>

<script>
export default {
    name: 'loader',
    props: ['loading'],
    data() {
        return {
            opacity: this.loading ? 1 : 0
        }
    }
}

</script>

<style>
::root {
    --primary-element-color-faded: #c6aad7ce;
}

.loader-container {
    display: flex;
    justify-content: center;
}

.loader {
  position: relative;
  width: 35px;
  height: 35px;
}

.loader:before , .loader:after{
  content: '';
  border-radius: 50%;
  position: absolute;
  inset: 0;
  /* box-shadow: 0 0 10px 2px #c8bde88c inset; */
}
.loader:after {
  box-shadow: 1px 3px 0 #c6aad7ae inset;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  0% {  transform: rotate(0)}
  100% { transform: rotate(360deg)}
}
    

</style>