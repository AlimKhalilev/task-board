<template>
    <div class="card" tabindex="0">

        <div class="card-header">
            <input v-on:keydown.ctrl.enter="updateCard" placeholder="Название записи" type="text" v-if="this.onceData.edit" v-model="title" ref="titleDOM">
            <h3 v-else>{{ title }}</h3>

            <div class="card-header-links" v-if="!this.onceData.edit">
                <svg><use xlink:href="../assets/main.svg#icon_window_max"></use></svg>
            </div>
        </div>
        
        <div class="card-container">
            <div class="card-container-items">
                <div class="card-container-items-content">
                    <textarea v-on:keydown.ctrl.enter="updateCard" placeholder="Текст записи" type="text" v-if="this.onceData.edit" v-model="text" ref="textDOM"></textarea>
                    <span v-else v-html="lineSkip(text)"></span>
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
                <button v-if="!this.onceData.edit" @click="changeCardEdit({index, edit: true})" class="card-footer-edit-change"><svg><use xlink:href="../assets/main.svg#icon_pencil"></use></svg></button>
                <button @click="deleteMode" class="card-footer-edit-delete"><svg><use xlink:href="../assets/main.svg#icon_close"></use></svg></button>
                <button v-if="this.onceData.edit" @click="updateCard" aria-label="checkbox"></button>
                <div class="card-footer-edit-dropdown" v-if="isDelete">
                    <h5>Удалить запись?</h5>
                    <div class="card-footer-edit-dropdown-content">
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
import { mapActions, mapMutations } from 'vuex'

export default {
    props: ["onceData", "index"],
    data() {
        return {
            text: this.onceData.info.text,
            title: this.onceData.info.title,
            isEdit: false, // переключатель для update (для фокуса)
            isDelete: false,
        }
    },
    updated() {
        if (this.onceData.edit && !this.isEdit) {
            this.isEdit = true;
            this.$refs.titleDOM.focus(); // ставим focus на title, когда EDIT MODE
        }
        if (!this.onceData.edit && this.isEdit) {
            this.isEdit = false;
            this.$el.focus(); // ставим фокус на карточку
        }
    },
    methods: {
        ...mapActions(["sendDataResponse"]),
        ...mapMutations(["deleteCardStore", "changeCardEdit"]),
        updateCard() {
            if (!this.title) { // пустая строка ложь и наоборот
                Toast.show("Заполните поле названия записи!");
                this.$refs.titleDOM.focus();
            }
            if (this.title && !this.text) {
                Toast.show("Заполните поле текста записи!");
                this.$refs.textDOM.focus();
            }
            if (this.title && this.text) {
                this.sendDataResponse({
                    card: "note",
                    type: "updateNote", 
                    mode: (this.onceData.saved ? "editNote" : "addNote"), 
                    cardIndex: this.index,
                    cardID: this.onceData.id,
                    title: this.title, 
                    text: this.text
                })
            }
        },
        deleteCard(mode) {
            if (mode == "yes") {
                if (this.onceData.saved) {
                    this.sendDataResponse({
                        card: "note",
                        type: "updateNote",
                        mode: "deleteNote",
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
        lineSkip(text) {
            return text.replace(/\n/g, "<br>");
        }
    }
}
</script>