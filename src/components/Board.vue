<template>
    <section class="section-outer section-main">
        <div class="section-inner">
            <Pane @openAuth="openAuth" v-bind:mainData="mainData"/>
            <Cards/>
        </div>
    </section>
</template>

<script>
import Pane from '@/components/Pane.vue'
import Cards from '@/components/Cards.vue'
export default {
    data() {
        return {
            mainData: [
                {type: "note", info:
                    {
                        title: "Без тайтла",
                        text: "Привет, сегодня хорошая погода, вот бы доделать TaskBoard..",
                        date: "24.03.2020",
                        time: "13:47"
                    }
                },
                {type: "note", info:
                    {
                        title: "Запись номер 2",
                        text: "И снова привет, и это уже наша вторая запись!",
                        date: "24.03.2020",
                        time: "13:52"
                    }
                },
                {type: "task", info:
                    {
                        title: "Первые задачи",
                        dateAdd: "24.03.2020",
                        timeAdd: "13:52",
                        dateComplete: "24.03.2020",
                        timeComplete: "13:52",
                        tasksInfo: [
                            {
                                text: "Пообедать",
                                complete: false,
                                dateAdd: "24.03.2020",
                                timeAdd: "13:52",
                                dateComplete: "24.03.2020",
                                timeComplete: "13:52",
                            },
                            {
                                text: "Отдохнуть",
                                complete: false,
                                dateAdd: "24.03.2020",
                                timeAdd: "13:52",
                                dateComplete: "24.03.2020",
                                timeComplete: "13:52",
                            },
                            {
                                text: "Вкалывать как собака",
                                complete: false,
                                dateAdd: "24.03.2020",
                                timeAdd: "13:52",
                                dateComplete: "24.03.2020",
                                timeComplete: "13:52",
                            }
                        ]
                    }
                }
            ]
        }
    },
    methods: {
        openAuth() {
            this.$emit("openAuth", 0); // кидаем на авторизацию
        }
    },
    components: {
        Pane,
        Cards
    }
}
</script>

<style lang="scss">
    @import '../assets/scss/board';
</style>