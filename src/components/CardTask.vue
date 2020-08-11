<template>
    <div class="card" tabindex="0">

        <div class="card-header">

            <input v-on:keyup.enter="updateCard" placeholder="Название задачи" type="text" v-if="onceData.edit" v-model="title" ref="titleDOM">
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
                <button @click="addNewItem" class="card-footer-add-new"><svg><use xlink:href="../assets//main.svg#icon_add"></use></svg></button>
                <button v-if="!onceData.edit" @click="editMode" class="card-footer-add-change"><svg><use xlink:href="../assets/main.svg#icon_pencil"></use></svg></button>
                <button v-if="!onceData.edit" @click="deleteMode" class="card-footer-add-delete"><svg><use xlink:href="../assets/main.svg#icon_close"></use></svg></button>
                <button v-if="onceData.edit" @click="updateCard" aria-label="checkbox"></button>
                <div class="card-footer-add-dropdown" v-if="isDelete">
                    <h5>Удалить задачу?</h5>
                    <div class="card-footer-add-dropdown-content">
                        <button @click="deleteCard('yes')">Да</button>
                        <button @click="deleteCard('no')">Нет</button>
                    </div>
                </div>
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
            text: "",
            isEdit: false,
            isDelete: false,
            isAddItem: false
        }
    },
    updated() {
        if (this.onceData.edit && !this.isEdit) { // клацнули на edit
            this.isEdit = true;
            this.$refs.titleDOM.focus(); // ставим focus на title, когда EDIT MODE
        }
        if (!this.onceData.edit && this.isEdit) {
            this.isEdit = false;
            this.$el.focus(); // ставим фокус на карточку
        }
        if (this.isAddItem) { // добавили новый пункт
            let innnd = (this.$el.querySelectorAll(".card-container-items-item").length - 1);
            this.$el.getElementsByClassName("card-container-items-item")[innnd].querySelector("textarea").focus();
            this.isAddItem = false;
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
            this.$refs.titleDOM.focus(); // ставим focus на title, когда EDIT MODE
            if (!this.title) {
                alert("Заполните поле названия задачи")
            }
            else {
                if (this.onceData.id <= this.$parent.$parent.maxCardID) { // edit
                    this.$emit("updateCard", "task", "add", this.onceData.id, this.title, this.text, 0, false);
                }
                else { // add
                    if (this.isTaskItemsEntered()) {
                        this.text = this.getTaskItemsInfo();
                        this.$emit("updateCard", "task", "add", this.onceData.id, this.title, this.text, 0, false);
                    }
                }
            }
        },
        editMode() {
            this.$emit("updateCard", "task", "edit", this.onceData.id, this.title, this.text, 0, false);
        },
        deleteMode() {
            this.isDelete = !this.isDelete;
        },
        deleteCard(mode) {
            if (mode == "yes") {
                this.$emit("updateCard", "task", "delete", this.onceData.id, this.title, this.text, 0, false);
            }
            if (mode == "no") {
                this.isDelete = false;
            }
        },
        addNewItem() {
            this.$emit("updateCard", "task", "newItem", this.onceData.id, this.title, this.text, 0, false);
            this.isAddItem = true;
        },
    },
    components: {
        CardTaskItem
    }
}
</script>