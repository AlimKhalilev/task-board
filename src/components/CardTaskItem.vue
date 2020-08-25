<template>
    <div class="card-container-items-item" tabindex="0">
        <div class="card-container-items-item-text" @click="sendCompleteMode">
            <input type="checkbox" v-model="taskInfo.complete" :disabled="taskInfo.complete" v-if="!taskInfo.edit">
            <span v-if="!taskInfo.edit">{{ text }}</span>
            <textarea v-on:keydown.ctrl.enter="addItem" placeholder="Текст задачи" type="text" v-if="taskInfo.edit" v-model="text" ref="textDOM"></textarea>
        </div>
        <div class="card-container-items-item-edit">
            <div class="card-container-items-item-edit-date">
                <span v-if="taskInfo.timeComplete != '00:00' && taskInfo.timeComplete != ''" class="completed">{{ taskInfo.dateComplete }} / {{ taskInfo.timeComplete }}</span>
                <span>{{ taskInfo.dateAdd }} / {{ taskInfo.timeAdd }}</span>
                <svg><use xlink:href="../assets/main.svg#icon_calendar"></use></svg>
            </div>
            <div class="card-container-items-item-edit-links">
                <button v-if="!taskInfo.edit" @click="editItem"><svg ><use xlink:href="../assets/main.svg#icon_pencil"></use></svg></button>
                <button @click="deleteMode"><svg class="delete-task"><use xlink:href="../assets/main.svg#icon_close"></use></svg></button>
                <button v-if="taskInfo.edit" @click="addItem" aria-label="checkbox"></button>
                <div class="card-container-items-item-edit-links-dropdown" v-if="isDelete">
                    <h5>Удалить задачу?</h5>
                    <div class="card-container-items-item-edit-links-dropdown-content">
                        <button @click="deleteItem('yes')">Да</button>
                        <button @click="deleteItem('no')">Нет</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-container-items-item-dropdown" v-if="isComplete">
            <h5>Выполнить задачу?</h5>
            <div class="card-container-items-item-dropdown-content">
                <button @click="sendComplete('yes')">Да</button>
                <button @click="sendComplete('no')">Нет</button>
            </div>
        </div>
    </div>
</template>

<script>
import Toast from '@/components/Toast.vue'
import { mapActions, mapMutations } from 'vuex'
export default {
    props: ["taskInfo", "cardIndex", "cardID", "taskIndex", "cardSaved", "isFullDelete", "isFullComplete"],
    data() {
        return {
            text: this.taskInfo.text,
            isEdit: false,
            isDelete: false,
            isComplete: false
        }
    },
    updated() {
        if (this.taskInfo.edit && !this.isEdit) { // клацнули на edit
            this.isEdit = true;
            this.setTextFocus(); // ставим focus на title, когда EDIT MODE
        }
        if (!this.taskInfo.edit && this.isEdit) {
            this.isEdit = false;
            this.$el.focus(); // ставим фокус на карточку
        }
    },
    methods: {
        ...mapActions(["sendDataResponse"]),
        ...mapMutations(["deleteTaskItemStore", "changeTaskItemEdit"]),
        addItem() {
            if (!this.text) {
                Toast.show("Заполните поле текста задачи");
            }
            if (this.text && !this.cardSaved) { // если карточка, в которой добавляется taskItem не сохранена
                Toast.show("Завершите редактирование карточки");
            }
            if (this.text && this.cardSaved) { // если поле заполнено и карточка сохранена
                this.sendDataResponse({
                    type: "updateTaskItem",
                    mode: (this.taskInfo.saved ? "updateTaskItem" : "addTaskItem"),
                    cardIndex: this.cardIndex,
                    taskIndex: this.taskIndex,
                    cardID: this.cardID,
                    taskID: this.taskInfo.id,
                    text: this.text
                })
            }
        },
        editItem() {
            this.changeTaskItemEdit({cardIndex: this.cardIndex, taskIndex: this.taskIndex, edit: true})
        },
        deleteMode() {
            if (this.taskInfo.edit && this.taskInfo.saved) {
                this.changeTaskItemEdit({cardIndex: this.cardIndex, taskIndex: this.taskIndex, edit: false})
                this.text = this.taskInfo.text;
            }
            else {
                this.isDelete = !this.isDelete;
            }
        },
        deleteItem(mode) {
            if (mode == "yes") {
                if (this.taskInfo.saved) { // если Edit mode и taskItem сохранен, откатываем значения
                    this.sendDataResponse({
                        card: "task",
                        type: (this.isFullDelete ? "updateTask" : "updateTaskItem"),
                        mode: (this.isFullDelete ? "deleteTask" : "deleteTaskItem"),
                        cardIndex: this.cardIndex,
                        taskIndex: this.taskIndex,
                        cardID: this.cardID,
                        taskID: this.taskInfo.id
                    })
                }
                else {
                    this.deleteTaskItemStore({cardIndex: this.cardIndex, taskIndex: this.taskIndex})
                }
            }
            if (mode == "no") {
                this.isDelete = false;
            }
        },
        sendCompleteMode() {
            if (!this.taskInfo.complete && !this.taskInfo.edit) {
                this.isComplete = !this.isComplete; // если пункт еще не выполнен || и он не редактируется
            }
        },
        sendComplete(mode) {
            if (mode == "yes") {
                this.sendDataResponse({
                    type: "updateTaskItem",
                    mode: (this.isFullComplete ? "sendCompleteFull" : "sendComplete"),
                    cardIndex: this.cardIndex,
                    taskIndex: this.taskIndex,
                    cardID: this.cardID,
                    taskID: this.taskInfo.id
                })
            }
            this.isComplete = false;
        },
        setTextFocus() {
            this.$refs.textDOM.focus();
        }
    }
}
</script>