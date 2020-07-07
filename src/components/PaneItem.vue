<template>
    <div class="items-item">
        <h4 class="items-item-text">{{ onceData.info.title }}</h4>
        <span 
            v-if="onceData.type == 'task'" class="items-item-stat">{{ getTaskComplete(onceData.info.tasksInfo) }} / {{ onceData.info.tasksInfo.length }}
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