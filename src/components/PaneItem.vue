<template>
    <button class="items-item" @click="goToCard" v-if="onceData.info.title != ''">
        <h4 class="items-item-text">{{ onceData.info.title }}</h4>
        <span 
            v-if="onceData.type == 'task'" 
            class="items-item-stat" 
            v-bind:class="{ completed: getTaskComplete(onceData.info.tasksInfo) == onceData.info.tasksInfo.length}">
            {{ getTaskComplete(onceData.info.tasksInfo) }} / {{ onceData.info.tasksInfo.length }}
        </span>
    </button>
</template>

<script>
export default {
    props: ['onceData', 'ind'],
    data() {
        return {

        }
    },
    methods: {
        getTaskComplete(arr) {
            let count = 0;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].complete) {
                    count++;
                }
            }
            return count;
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

