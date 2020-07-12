<template>
    <div class="card">

        <div class="card-header">

            <input placeholder="Название записи" type="text" v-if="onceData.edit" v-model="title">
            <h3 v-else>{{ title }}</h3>

            <div class="card-header-links" v-if="!onceData.edit">
                <svg><use xlink:href="../assets/main.svg#icon_window_max"></use></svg>
            </div>
        </div>
        
        <div class="card-container">
            <div class="card-container-items">

                <CardTaskItem @updateCardItem="updateCardItem" v-for="taskInfo in onceData.info.tasksInfo" :key="taskInfo.id" v-bind:taskInfo="taskInfo" v-bind:cardId="onceData.id"/>

            </div>
        </div>

        <div class="card-footer">
            <!-- <div class="card-footer-checkbox" v-if="onceData.edit">
                <button @click="updateCard">Сохранить</button>
                <span data-label="checkbox"></span>
            </div> -->
            <div class="card-footer-date">
                <svg><use xlink:href="../assets/main.svg#icon_calendar"></use></svg>
                <span>{{ onceData.info.dateAdd }} / {{ onceData.info.timeAdd }}</span>
                <span class="completed">{{ onceData.info.dateComplete }} / {{ onceData.info.timeComplete }}</span>
            </div>
            <div class="card-footer-add">
                <svg @click="addNewItem"><use xlink:href="../assets//main.svg#icon_add"></use></svg>
                <svg v-if="!onceData.edit" @click="editMode"><use xlink:href="../assets/main.svg#icon_pencil"></use></svg>
                <svg v-if="!onceData.edit" @click="deleteMode"><use xlink:href="../assets/main.svg#icon_close"></use></svg>
                <span v-if="onceData.edit" @click="updateCard" data-label="checkbox"></span>
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
            title: this.onceData.info.title,
        }
    },
    methods: {
        updateCardItem(type, mode, id, title, text, taskid, complete) {
            this.$emit("updateCard", type, mode, id, title, text, taskid, complete);
        },
        updateCard() {
            this.$emit("updateCard", "task", "add", this.onceData.id, this.title, this.text, 0, false);
        },
        editMode() {
            this.$emit("updateCard", "task", "edit", this.onceData.id, this.title, this.text, 0, false);
        },
        deleteMode() {
            this.$emit("updateCard", "task", "delete", this.onceData.id, this.title, this.text, 0, false);
        },
        addNewItem() {
            this.$emit("updateCard", "task", "newItem", this.onceData.id, this.title, this.text, 0, false);
        },
    },
    components: {
        CardTaskItem
    }
}
</script>