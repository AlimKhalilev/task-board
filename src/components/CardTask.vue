<template>
    <div class="card" tabindex="0">

        <div class="card-header">

            <input v-on:keydown.ctrl.enter="updateCard" placeholder="Название задачи" type="text" v-if="onceData.edit" v-model="title" ref="titleDOM">
            <h3 v-else>{{ title }}</h3>

            <div class="card-header-links" v-if="!onceData.edit">
                <svg><use xlink:href="../assets/main.svg#icon_window_max"></use></svg>
            </div>
        </div>
        
        <div class="card-container">
            <div class="card-container-items">

                <CardTaskItem ref="taskItems" v-for="(taskInfo, taskIndex) in onceData.info.tasksInfo" :key="taskInfo.id" 
                    v-bind:taskInfo="taskInfo" 
                    v-bind:cardIndex="index" 
                    v-bind:cardID="onceData.id" 
                    v-bind:taskIndex="taskIndex" 
                    v-bind:cardSaved="onceData.saved" 
                    v-bind:isFullDelete="onceData.info.tasksInfo.length == 1 ? true : false"
                    v-bind:isFullComplete="(onceData.info.tasksInfo.length - onceData.info.tasksInfo.reduce((accum, current) => accum + Number(current.complete), 0) == 1 ? true : false)"
                />

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
                <button @click="addNewItem" class="card-footer-add-new"><svg><use xlink:href="../assets/main.svg#icon_add"></use></svg></button>
                <button v-if="!onceData.edit" @click="changeCardEdit({index, edit: true})" class="card-footer-add-change"><svg><use xlink:href="../assets/main.svg#icon_pencil"></use></svg></button>
                <button @click="deleteMode" class="card-footer-add-delete"><svg><use xlink:href="../assets/main.svg#icon_close"></use></svg></button>
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
import Toast from '@/components/Toast.vue'
import cookie from '@/components/Cookie.vue'
import CardTaskItem from '@/components/CardTaskItem.vue'
import { mapActions, mapMutations } from 'vuex'

export default {
    props: ["onceData", "index"],
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
            this.$refs.taskItems[this.$refs.taskItems.length - 1].setTextFocus(); // focus на последний item
            this.isAddItem = false;
        }
    },
    methods: {
        ...mapActions(["sendDataResponse"]),
        ...mapMutations(["deleteCardStore", "changeCardEdit", "addNewTaskItem"]),
        isTaskItemsEntered() { // Проверка на заполненность полей в TaskItem
            let isHasText = 1;
            let taskCount = this.$refs.taskItems.length;
            for (let i = 0; taskCount > i; i++) {
                if (this.$refs.taskItems[i].taskInfo.edit) { // если при клике на карту какой-то из task в состоянии edit
                    if (!this.$refs.taskItems[i].text) { // если пустое поле
                        Toast.show("Заполните поле №" + (i+1));
                        this.$refs.taskItems[i].setTextFocus(); // ставим focus на text item
                        isHasText = 0;
                        break;
                    }
                }
            }
            return isHasText;
        },
        updateCard() {
            if (!this.title) {
                Toast.show("Заполните поле названия задачи");
                this.$refs.titleDOM.focus(); // ставим focus на title, когда EDIT MODE
            }
            else {
                if (this.onceData.saved) { // update
                    this.sendCardInfo()
                }
                else { // add
                    if (this.isTaskItemsEntered()) {
                        this.text = this.$refs.taskItems.map(arr => arr.text); // получение массива текста items из TaskItem
                        this.sendCardInfo()
                    }
                }
            }
        },
        sendCardInfo() {
            this.sendDataResponse({
                card: "task",
                type: "updateTask", 
                mode: (this.onceData.saved ? "editTask" : "addTask"), 
                cardIndex: this.index,
                cardID: this.onceData.id,
                title: this.title, 
                text: this.text
            })
        },
        deleteMode() {
            if (this.onceData.edit && this.onceData.saved) { // если Edit mode и карточка сохранена, откатываем значения
                this.changeCardEdit({index: this.index, edit: false})
                this.text = this.onceData.info.text
                this.title = this.onceData.info.title
            }
            else {
                this.isDelete = !this.isDelete;
            }
        },
        deleteCard(mode) {
            if (mode == "yes") {
                if (this.onceData.saved) {
                    this.sendDataResponse({
                        card: "task",
                        type: "updateTask",
                        mode: "deleteTask",
                        cardIndex: this.index,
                        cardID: this.onceData.id,
                    })
                }
                else {
                    this.deleteCardStore(this.index)
                }
            }
            if (mode == "no") {
                this.isDelete = false;
            }
        },
        addNewItem() {
            this.addNewTaskItem({
                content: {
                    id: Date.now(),
                    text: "",
                    complete: false,
                    dateAdd: cookie.getNowDate(),
                    timeAdd: cookie.getNowTime(),
                    dateComplete: "",
                    timeComplete: "",
                    edit: true,
                    saved: false
                },
                index: this.index
            })
            this.isAddItem = true;
        }
    },
    components: {
        CardTaskItem
    }
}
</script>