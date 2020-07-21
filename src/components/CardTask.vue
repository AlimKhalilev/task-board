<template>
    <div class="card">

        <div class="card-header">

            <input placeholder="Название задачи" type="text" v-if="onceData.edit" v-model="title">
            <h3 v-else>{{ title }}</h3>

            <div class="card-header-links" v-if="!onceData.edit">
                <svg><use xlink:href="../assets/main.svg#icon_window_max"></use></svg>
            </div>
        </div>
        
        <div class="card-container">
            <div class="card-container-items">

                <CardTaskItem ref="taskItems" @updateCardItem="updateCardItem" v-for="taskInfo in onceData.info.tasksInfo" :key="taskInfo.id" v-bind:taskInfo="taskInfo" v-bind:cardId="onceData.id"/>

            </div>
        </div>

        <div class="card-footer">
            <div class="card-footer-date">
                <svg><use xlink:href="../assets/main.svg#icon_calendar"></use></svg>
                <div class="card-footer-date-clock">
                    <span>{{ onceData.info.dateAdd }} / {{ onceData.info.timeAdd }}</span>
                    <span v-if="onceData.info.timeComplete != '00:00' && onceData.info.timeComplete != ''" class="completed">{{ onceData.info.dateComplete }} / {{ onceData.info.timeComplete }}</span>
                </div>
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
            text: ""
        }
    },
    methods: {
        isTaskItemsEntered() { // Проверка на заполненность полей в TaskItem
            let isHasText = 1;
            let taskCount = this.$refs.taskItems.length;
            for (let i = 0; taskCount > i; i++) {
                if (this.$refs.taskItems[i].taskInfo.edit) { // если при клике на карту какой-то из task в состоянии edit
                    if (!this.$refs.taskItems[i].text) { // если пустое поле
                        alert("Заполните поле №" + (i+1));
                        isHasText = 0;
                        break;
                    }
                }
            }
            return isHasText;
        },
        getTaskItemsInfo() { // получение массива текста items из TaskItem
            let arrText = [];
            let taskCount = this.$refs.taskItems.length;
            for (let j = 0; taskCount > j; j++) {
                arrText.push(this.$refs.taskItems[j].text);
            }
            return arrText;
        },
        updateCardItem(type, mode, id, title, text, taskid, complete) {
            if (this.onceData.edit) { // если карточка еще редактируется, или не сохранена
                alert("Завершите редактирование карточки")
            }
            else {
                this.$emit("updateCard", type, mode, id, title, text, taskid, complete);
            }
        },
        updateCard() {
            if (!this.title) {
                alert("Заполните поле названия задачи")
            }
            else {
                if (this.isTaskItemsEntered()) {
                    this.text = this.getTaskItemsInfo();
                    this.$emit("updateCard", "task", "add", this.onceData.id, this.title, this.text, 0, false);
                }
            }
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