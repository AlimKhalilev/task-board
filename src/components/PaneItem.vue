<template>
    <button class="items-item" @click="goToCard" v-if="onceData.info.title != ''">
        <h4 class="items-item-text">{{ onceData.info.title }}</h4>
        <span 
            v-if="onceData.type == 'task'" 
            class="items-item-stat" 
            v-bind:class="{ completed: getComplete(onceData.info.tasksInfo) == onceData.info.tasksInfo.length}">
            {{ getComplete(onceData.info.tasksInfo) }} / {{ onceData.info.tasksInfo.length }}
        </span>
    </button>
</template>

<script>
export default {
    props: ['onceData', 'ind'],
    methods: {
        getComplete(arr) {
            return arr.reduce((prev, current) => prev + Number(current.complete), 0)
        },
        goToCard() {
            document.getElementsByClassName("items-item")[this.ind].blur(); // убрать фокус
            window.scrollTo({
                top: document.getElementsByClassName("card")[this.ind].offsetTop - 10,
                behavior: "smooth"
            });
        }
    }
}
</script>

