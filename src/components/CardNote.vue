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
                <div class="card-container-items-content">
                    <textarea placeholder="Текст записи" type="text" v-if="onceData.edit" v-model="text"></textarea>
                    <span v-else>{{ text }}</span>
                </div>
            </div>
        </div>

        <div class="card-footer">
            <div class="card-footer-date">
                <svg><use xlink:href="../assets/main.svg#icon_calendar"></use></svg>
                <div class="card-footer-date-clock clock-once">
                    <span>{{ onceData.info.date }} / {{ onceData.info.time }}</span>
                </div>
            </div>
            <div class="card-footer-edit">
                <svg v-if="!onceData.edit" @click="editMode"><use xlink:href="../assets/main.svg#icon_pencil"></use></svg>
                <svg v-if="!onceData.edit" @click="deleteMode"><use xlink:href="../assets/main.svg#icon_close"></use></svg>
                <span v-if="onceData.edit" @click="updateCard" data-label="checkbox"></span>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    props: ["onceData"],
    data() {
        return {
            text: this.onceData.info.text,
            title: this.onceData.info.title,
        }
    },
    methods: {
        updateCard() {
            if (!this.title) { // пустая строка ложь и наоборот
                alert("Заполните поле названия записи")
            }
            if (this.title && !this.text) {
                alert("Заполните поле текста записи")
            }
            if (this.title && this.text) {
                this.$emit("updateCard", "note", "update", this.onceData.id, this.title, this.text, 0, false);
            }
        },
        editMode() {
            this.$emit("updateCard", "note", "edit", this.onceData.id, this.title, this.text, 0, false);
        },
        deleteMode() {
            this.$emit("updateCard", "note", "delete", this.onceData.id, this.title, this.text, 0, false);
        }
    }
}
</script>