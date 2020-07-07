<template>
    <div class="card-container-items-item">
        <label class="card-container-items-item-text">
            <input type="checkbox" v-model="taskInfo.complete">
            <span>{{ taskInfo.text }}</span>
        </label>
        <div class="card-container-items-item-edit">
            <div class="card-container-items-item-edit-date">
                <span class="completed">{{ taskInfo.dateAdd }} / {{ taskInfo.timeAdd }}</span>
                <span>{{ taskInfo.dateComplete }} / {{ taskInfo.timeComplete }}</span>
                <svg><use xlink:href="../assets/main.svg#icon_calendar"></use></svg>
            </div>
            <div class="card-container-items-item-edit-links">
                <svg><use xlink:href="../assets/main.svg#icon_pencil"></use></svg>
                <svg><use xlink:href="../assets/main.svg#icon_close"></use></svg>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["taskInfo"],
    data() {
        return {

        }
    }
}
</script>