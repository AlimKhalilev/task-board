<template>
    <div class="card-container-items-item">
        <label class="card-container-items-item-text">
            <input @change="sendComplete" type="checkbox" v-model="complete" :disabled="complete" v-if="!taskInfo.edit">
            <span v-if="!taskInfo.edit">{{ text }}</span>
            <textarea placeholder="Текст записи" type="text" v-if="taskInfo.edit" v-model="text"></textarea>
        </label>
        <div class="card-container-items-item-edit">
            <div class="card-container-items-item-edit-date">
                <span class="completed">{{ taskInfo.dateComplete }} / {{ taskInfo.timeComplete }}</span>
                <span>{{ taskInfo.dateAdd }} / {{ taskInfo.timeAdd }}</span>
                <svg><use xlink:href="../assets/main.svg#icon_calendar"></use></svg>
            </div>
            <div class="card-container-items-item-edit-links">
                <svg v-if="!taskInfo.edit" @click="editItem"><use xlink:href="../assets/main.svg#icon_pencil"></use></svg>
                <svg v-if="!taskInfo.edit" @click="deleteItem"><use xlink:href="../assets/main.svg#icon_close"></use></svg>
                <span v-if="taskInfo.edit" @click="addItem" data-label="checkbox"></span>
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
            complete: this.taskInfo.complete
        }
    },
    methods: {
        addItem() {
            this.$emit("updateCardItem", "task", "addItem", this.cardId, "", this.text, this.taskInfo.id, 0); // передается только текст
        },
        editItem() {
            this.$emit("updateCardItem", "task", "editItem", this.cardId, "", this.text, this.taskInfo.id, 0); // передается только текст
        },
        deleteItem() {
            this.$emit("updateCardItem", "task", "deleteItem", this.cardId, "", this.text, this.taskInfo.id, 0); // передается только текст
        },
        sendComplete() {
            this.$emit("updateCardItem", "task", "sendComplete", this.cardId, "", this.text, this.taskInfo.id, this.complete); // передается только текст
        }
    }
}
</script>