<template>
    <section class="section-outer section-main">
        <div class="section-inner">
            <Pane @openAuth="openAuth" v-bind:mainData="mainData"/>
            <div class="section-main-cards" v-bind:class="{empty: !mainData.length}">
                <div v-if="isLoadData && mainData.length == 0" class="section-main-cards-empty">
                    <h2>Добро пожаловать в TaskBoard!</h2>
                    <h3>Добавьте свою первую запись, нажав на <svg><use xlink:href="../assets/main.svg#icon_add"></use></svg> слева</h3>
                </div>

                <template v-for="(onceData, index) in filterData(mainData)">
                    <CardNote :key="onceData.id" v-if="onceData.type == 'note'" v-bind:onceData="onceData" v-bind:index="mainData.length - (index+1)"/>
                    <CardTask :key="onceData.id" v-else v-bind:onceData="onceData" v-bind:index="mainData.length - (index+1)"/>
                </template>

            </div>
        </div>
    </section>
</template>

<script>
import Pane from '@/components/Pane.vue'
import CardNote from '@/components/CardNote.vue'
import CardTask from '@/components/CardTask.vue'

import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
    computed: mapGetters(["mainData", "isLoadData", "isFirstLoad"]),
    async mounted() {
        await this.getAllCards()
    },
    updated() {
        if (!this.isFirstLoad) {
            this.animateAppearance(0.2) // анимируем
            this.completeFirstLoad() // и переключаем первую прогрузку данных
        }
        if (this.mainData.length >= 1) { // если уже загрузились и карточки есть
            let newCard = document.getElementsByClassName("card")[0].querySelector(".card-header > input"); // проверка на фокус при доб. карты (на title)
            if (newCard != null) {
                newCard.focus();
            }
        }
    },
    beforeCreate() {
        document.title = "Главная - TaskBoard"
    },
    methods: {
        ...mapActions(["getAllCards"]),
        ...mapMutations(["addNewCard", "completeFirstLoad"]),
        filterData(data) {
            return data.slice().reverse(); // обратный массив
        },
        openAuth() {
            this.$emit("openAuth", 0); // кидаем на авторизацию
        },
        animateAppearance(timeEqual) {
            if (!this.mainData.length) { // если карточек нет
                let elem = document.querySelector(".section-main-cards-empty");
                elem.style = 'opacity: 0; animation: fadeIn 0.7s ease-in-out 0s forwards';
                elem.addEventListener('animationend', () => {
                    elem.removeAttribute("style");
                });
            }
            else {
                document.querySelectorAll(".card").forEach(function(elem, i) {
                    let pane_item = document.querySelectorAll(".items-item")[i];
                    let style_str = 'opacity: 0; animation: fadeIn 0.7s ease-in-out '+(timeEqual + (i * timeEqual))+'s forwards';
                    elem.style = style_str;
                    pane_item.style = style_str;
                    elem.addEventListener('animationend', () => {
                        elem.removeAttribute("style");
                        pane_item.removeAttribute("style");
                    });
                });
            }
        }
    },
    components: {
        Pane,
        CardNote,
        CardTask,
    }
}
</script>