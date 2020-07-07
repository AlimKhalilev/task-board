<template>
    <div class="card">

        <div class="card-header">
            <h3>{{ onceData.info.title }}</h3>
            <div class="card-header-links">
                <svg><use xlink:href="../assets/main.svg#icon_window_max"></use></svg>
            </div>
        </div>
        
        <div class="card-container">
            <div class="card-container-items">

                <CardTaskItem v-for="taskInfo in onceData.info.tasksInfo" :key="taskInfo.id" v-bind:taskInfo="taskInfo"/>

            </div>
        </div>

        <div class="card-footer">
            <div class="card-footer-date">
                <svg><use xlink:href="../assets/main.svg#icon_calendar"></use></svg>
                <span>24.03.12 / 10:53</span>
                <span class="completed">24.03.12 / 10:53</span>
            </div>
            <div class="card-footer-add">
                <svg><use xlink:href="../assets//main.svg#icon_add"></use></svg>
            </div>
        </div>
    </div>
</template>

<script>
import CardTaskItem from '@/components/CardTaskItem.vue'
export default {
    props: ["onceData"],
    data() {
        return {

        }
    },
    components: {
        CardTaskItem
    }
}
</script>