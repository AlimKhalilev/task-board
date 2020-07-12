<template>
    <section class="section-outer section-main">
        <div class="section-inner">
            <Pane @openAuth="openAuth" @addCard="addCard" v-bind:mainData="mainData"/>
            <div class="section-main-cards">
                <div v-if="mainData.length == 0" class="section-main-cards-empty">
                    <h2>Добро пожаловать в TaskBoard!</h2>
                    <h3>Добавьте свою первую запись, нажав на <svg><use xlink:href="../assets//main.svg#icon_add"></use></svg> слева</h3>
                </div>
                <Card @updateCard="updateCard" v-for="onceData in mainData" :key="onceData.id" v-bind:onceData="onceData"/>
            </div>
        </div>
    </section>
</template>

<script>
import Pane from '@/components/Pane.vue'
import Card from '@/components/Card.vue'
import moment from 'moment'
export default {
    data() {
        return {
            //mainData: []
            mainData: [
                {id:12414112, type: "note", edit: false, info:
                    {
                        title: "Без тайтла",
                        text: "Привет, сегодня хорошая погода, вот бы доделать TaskBoard..",
                        date: "24.03.20",
                        time: "13:47"
                    }
                },
                {id:7684349, type: "task", edit: false, info:
                    {
                        title: "Первые задачи",
                        dateAdd: "24.03.20",
                        timeAdd: "13:52",
                        dateComplete: "24.03.20",
                        timeComplete: "13:52",
                        tasksInfo: [
                            {
                                id: 55684349,
                                text: "Пообедать",
                                complete: true,
                                dateAdd: "24.03.20",
                                timeAdd: "13:52",
                                dateComplete: "24.03.20",
                                timeComplete: "13:52",
                                edit: false
                            },
                            {
                                id: 55684312,
                                text: "Отдохнуть",
                                complete: false,
                                dateAdd: "24.03.20",
                                timeAdd: "13:52",
                                dateComplete: "24.03.20",
                                timeComplete: "13:52",
                                edit: false
                            }
                        ]
                    }
                }
            ]
        }
    },
    mounted() {
        document.title = "Главная - TaskBoard"
    },
    methods: {
        openAuth() {
            this.$emit("openAuth", 0); // кидаем на авторизацию
        },
        addCard(method) {
            //console.log(method, Date.now());
            if (method == "note") { // если запись
                this.mainData.push(
                    {id:Date.now(), type: "note", edit: true, info:
                        {
                            title: "",
                            text: "",
                            date: moment().format('DD.MM.YY'),
                            time: moment().format('HH:mm')
                        }
                    },
                )
            }
            else { // если задача
                this.mainData.push(
                    {id:Date.now(), type: "task", edit: true, info:
                        {
                            title: "",
                            dateAdd: moment().format('DD.MM.YY'),
                            timeAdd: moment().format('HH:mm'),
                            dateComplete: "**.**.**",
                            timeComplete: "**:**",
                            tasksInfo: [
                                {
                                    id: Date.now(),
                                    text: "",
                                    complete: false,
                                    dateAdd: moment().format('DD.MM.YY'),
                                    timeAdd: moment().format('HH:mm'),
                                    dateComplete: "**.**.**",
                                    timeComplete: "**:**",
                                    edit: true
                                }
                            ]
                        }
                    }
                )
            }
        },
        updateCard(type, mode, id, title, text, taskid, complete) {
            let index = this.getIndexDataById(id) // получаем index по id
            if (index != -1) {
                if (type == "note") { // действия с записями
                    if (mode == "add") {
                        this.mainData[index].edit = false;
                        this.mainData[index].info.title = title;
                        this.mainData[index].info.text = text;
                        this.mainData[index].info.date = moment().format('DD.MM.YY');
                        this.mainData[index].info.time = moment().format('HH:mm');
                    }
                    if (mode == "edit") {
                        this.mainData[index].edit = true;
                    }
                    if (mode == "delete") {
                        this.mainData.splice(index, 1); // с index элемента удалить 1
                    }
                }
                else { // действия с задачей
                    if (mode == "add") {
                        this.mainData[index].edit = false;
                        this.mainData[index].info.title = title;
                        this.mainData[index].info.dateAdd = moment().format('DD.MM.YY');
                        this.mainData[index].info.timeAdd = moment().format('HH:mm');
                    }
                    if (mode == "edit") {
                        this.mainData[index].edit = true;
                    }
                    if (mode == "delete") {
                        this.mainData.splice(index, 1); // с index элемента удалить 1
                    }
                    if (mode == "newItem") {
                        this.mainData[index].info.tasksInfo.push(
                            {
                                id: Date.now(),
                                text: "",
                                complete: false,
                                dateAdd: moment().format('DD.MM.YY'),
                                timeAdd: moment().format('HH:mm'),
                                dateComplete: "**.**.**",
                                timeComplete: "**:**",
                                edit: true
                            }
                        )
                    }

                    if (taskid) { // если действия с task item'a
                        let taskIndex = this.getTaskIndexDataById(index, taskid)
                        if (taskIndex != -1) {
                            if (mode == "addItem") {
                                this.mainData[index].info.tasksInfo[taskIndex].text = text;
                                this.mainData[index].info.tasksInfo[taskIndex].edit = false;
                            }
                            if (mode == "editItem") { 
                                this.mainData[index].info.tasksInfo[taskIndex].edit = true;
                            }
                            if (mode == "deleteItem") {
                                this.mainData[index].info.tasksInfo.splice(taskIndex, 1); // с taskIndex элемента удалить 1
                            }
                            if (mode == "sendComplete") {
                                this.mainData[index].info.tasksInfo[taskIndex].complete = complete;
                                this.mainData[index].info.tasksInfo[taskIndex].dateComplete = moment().format('DD.MM.YY');
                                this.mainData[index].info.tasksInfo[taskIndex].timeComplete = moment().format('HH:mm');
                            }
                        }
                        else {
                            console.log("Индекс массива задачи не определен..")
                        }
                    }
                }
            }
            else {
                console.log("Индекс массива не определен..")
            }
        },
        getIndexDataById(id) {
            let backId = -1;
            this.mainData.forEach(function(elem, index) {
                //console.log(elem.id, id);
                if (elem.id == id) {
                    backId = index;
                }
            });
            return backId;
        },
        getTaskIndexDataById(cardid, id) {
            let backId = -1;
            this.mainData[cardid].info.tasksInfo.forEach(function(elem, index) {
                //console.log(elem.id, id);
                if (elem.id == id) {
                    backId = index;
                }
            });
            return backId;
        }
    },
    components: {
        Pane,
        Card
    }
}
</script>