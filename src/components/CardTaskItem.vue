<template>
    <div class="card-container-items-item" tabindex="0">
        <div class="card-container-items-item-text" @click="sendCompleteMode">
            <input type="checkbox" v-model="complete" :disabled="complete" v-if="!taskInfo.edit">
            <span v-if="!taskInfo.edit">{{ text }}</span>
            <textarea v-on:keyup.ctrl.enter="addItem" placeholder="Текст задачи" type="text" v-if="taskInfo.edit" v-model="text" ref="textDOM"></textarea>
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
export default {
    props: ["taskInfo", "cardId"],
    data() {
        return {
            text: this.taskInfo.text,
            complete: this.taskInfo.complete,
            isEdit: false,
            isDelete: false,
            isComplete: false
        }
    },
    updated() {
        if (this.taskInfo.edit && !this.isEdit) { // клацнули на edit
            this.isEdit = true;
            this.$refs.textDOM.focus(); // ставим focus на title, когда EDIT MODE
        }
        if (!this.taskInfo.edit && this.isEdit) {
            this.isEdit = false;
            this.$el.focus(); // ставим фокус на карточку
        }
    },
    methods: {
        addItem() {
            if (!this.text) {
                alert("Заполните поле текста задачи");
            }
            else {
                this.$emit("updateCardItem", "task", "addItem", this.cardId, "", this.text, this.taskInfo.id, 0); // передается только текст
            }
        },
        editItem() {
            this.$emit("updateCardItem", "task", "editItem", this.cardId, "", this.text, this.taskInfo.id, 0); // передается edit true / false
        },
        deleteMode() {
            this.isDelete = !this.isDelete;
        },
        deleteItem(mode) {
            if (mode == "yes") {
                this.$emit("updateCardItem", "task", "deleteItem", this.cardId, "", this.text, this.taskInfo.id, 0); // передается delete mode
            }
            if (mode == "no") {
                this.isDelete = false;
            }
        },
        sendCompleteMode() {
            if (!this.complete && !this.taskInfo.edit) {
                this.isComplete = !this.isComplete; // если пункт еще не выполнен || и он не редактируется
            }
        },
        sendComplete(mode) {
            if (mode == "yes") {
                this.complete = true;
                this.$emit("updateCardItem", "task", "sendComplete", this.cardId, "", this.text, this.taskInfo.id, this.complete); // complete true/false
                this.isComplete = false;
            }
            if (mode == "no") {
                this.isComplete = false;
            }
        }
    }
}
</script>