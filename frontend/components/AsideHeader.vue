<template>
    <div class = "left-header">
        <div class="pennynet-link-container"><a href="https://wetter.pennynet.info" style="text-decoration: none;"><p class="pennynet-link">pennynet</p></a></div>
        <h1>Wetter</h1>
    </div>
</template>

<script>

</script>

<style>
.left-header {
    position: relative;
    height: 142px;
    top: 10px;
    text-align: center;
    margin-bottom: 30px;
}

.pennynet-link-container {
    display: flex;
    justify-content: center;
}

.pennynet-link {
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 6px;
    padding-bottom: 8px;
    color: var(--c-text-primary);
    border-radius: 6px;
    transition: .2s;
    margin: 0;
    margin-top: 10px;
    margin-bottom: -7px;
}

.pennynet-link:hover {
    transform: translate();
    transition: .2s;
    background-color: #e3bde2a7;
    box-shadow: 0px 10px 22px -4px var(--main1-more-faded);
}
</style>