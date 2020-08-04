<template>
    <div class="items-item" v-if="onceData.info.title != ''">
        <h4 class="items-item-text">{{ onceData.info.title }}</h4>
        <span 
            v-if="onceData.type == 'task'" 
            class="items-item-stat" 
            v-bind:class="{ completed: getTaskComplete(onceData.info.tasksInfo) == onceData.info.tasksInfo.length}">
            {{ getTaskComplete(onceData.info.tasksInfo) }} / {{ onceData.info.tasksInfo.length }}
        </span>
    </div>
</template>

<script>
export default {
    props: ['onceData'],
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
        }
    }
}
</script>

