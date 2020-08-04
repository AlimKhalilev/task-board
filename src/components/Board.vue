<template>
    <section class="section-outer section-main">
        <div class="section-inner">
            <Pane @openAuth="openAuth" @addCard="addCard" v-bind:mainData="mainData"/>
            <div class="section-main-cards">
                <div v-if="isLoadData && mainData.length == 0" class="section-main-cards-empty">
                    <h2>Добро пожаловать в TaskBoard!</h2>
                    <h3>Добавьте свою первую запись, нажав на <svg><use xlink:href="../assets//main.svg#icon_add"></use></svg> слева</h3>
                </div>
                <Card @updateCard="updateCard" v-for="onceData in filterData(mainData)" :key="onceData.id" v-bind:onceData="onceData"/>
            </div>
        </div>
    </section>
</template>

<script>
import Pane from '@/components/Pane.vue'
import Card from '@/components/Card.vue'
import cookie from '@/components/Cookie.vue'
import axios from 'axios'
export default {
    data() {
        return {
            isLoadData: false,
            maxCardID: 0,
            maxTaskID: 0,
            mainData: []
        }
    },
    mounted() {
        document.title = "Главная - TaskBoard"

        axios // запрос на получшение всех карточек из бд
            .post(cookie.linkAPI, {
                type: "getAllCards",
                _ym_rwots: cookie.getCookie("_ym_rwots")
            })
            .then(response => {
                if (response.data) {
                    this.mainData = response.data;
                    if (this.mainData.length >= 1) { // уже есть карточки в бд
                        this.maxCardID = Number(this.mainData[this.mainData.length-1].id);
                        this.maxTaskID = this.getMaxTaskId();
                    }
                    this.isLoadData = true;
                }
                else {
                    console.log("Data error");
                }
            })
            .catch(error => console.log(error));

    },
    methods: {
        filterData(data) {
            return data.slice().reverse(); // обратный массив
        },
        openAuth() {
            this.$emit("openAuth", 0); // кидаем на авторизацию
        },
        addCard(method) {
            if (method == "note") { // если запись
                this.mainData.push(
                    {id: this.getNewCardId(), type: "note", edit: true, info: // устанавливаем временный id для карты
                        {
                            title: "",
                            text: "",
                            date: this.getNowDate(),
                            time: this.getNowTime()
                        }
                    },
                )
            }
            else { // если задача
                this.mainData.push(
                    {id:this.getNewCardId(), type: "task", edit: true, info:
                        {
                            title: "",
                            dateAdd: this.getNowDate(),
                            timeAdd: this.getNowTime(),
                            dateComplete: "",
                            timeComplete: "",
                            tasksInfo: [
                                {
                                    id: this.getMaxTaskId() + 1,
                                    text: "",
                                    complete: false,
                                    dateAdd: this.getNowDate(),
                                    timeAdd: this.getNowTime(),
                                    dateComplete: "",
                                    timeComplete: "",
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
                    if (mode == "update") {

                        // if (this.mainData[index].id > this.maxCardID) {
                        //     console.log("Добавление")
                        // }
                        // else {
                        //     console.log("Редактирование")
                        // }

                        axios // запрос на обновление данных карточки в бд
                            .post(cookie.linkAPI, {
                                type: "updateCardNote",
                                mode: (this.mainData[index].id > this.maxCardID ? "add" : "edit"),
                                _ym_rwots: cookie.getCookie("_ym_rwots"),
                                cardID: this.mainData[index].id,
                                title: title,
                                text: text
                            })
                            .then(response => {
                                if (response.data) { // если обновление карточки
                                    this.mainData[index].edit = false;
                                    this.mainData[index].info.title = title;
                                    this.mainData[index].info.text = text;
                                    //this.mainData[index].info.date = response.data.date; // если в ред. надо обновлять дату и время
                                    //this.mainData[index].info.time = response.data.time;
                                    
                                    if (response.data.id) { // если добавление карточки
                                        this.maxCardID = response.data.id;
                                        this.mainData[index].id = response.data.id; // присвоить ключ, полученный с синхры api database
                                        this.mainData[index].info.date = response.data.date;
                                        this.mainData[index].info.time = response.data.time;
                                    }
                                }
                                else {
                                    console.log("Data error");
                                }
                            })
                            .catch(error => console.log(error));

                    }
                    if (mode == "edit") {
                        this.mainData[index].edit = true;
                    }
                    if (mode == "delete") {

                        axios // запрос на удаление карточки из бд
                            .post(cookie.linkAPI, {
                                type: "deleteCardNote",
                                cardID: this.mainData[index].id
                            })
                            .then(response => {
                                if (response.data) { // если удаление успешно
                                    this.mainData.splice(index, 1); // с index элемента удалить 1
                                }
                                else {
                                    console.log("Data error");
                                }
                            })
                            .catch(error => console.log(error));
                    }
                }
                else { // действия с задачей
                    //console.log(mode, taskid, (this.mainData[index].id > this.maxCardID ? "addTask" : "editTask"));
                    //console.log((this.mainData[index].id > this.maxCardID ? "addTask" : "editTask"))
                    if (mode == "add") {
                        mode = (this.mainData[index].id > this.maxCardID ? "addTask" : "editTask");
                    }
                    if (mode == "addTask" || mode == "editTask" || mode == "delete") {
                        axios // запрос на обновление данных Task Item
                            .post(cookie.linkAPI, {
                                type: "updateTask",
                                mode: mode,
                                _ym_rwots: cookie.getCookie("_ym_rwots"),
                                cardID: this.mainData[index].id,
                                title: title,
                                text: text
                            })
                            .then(response => {
                                if (response.data) { // если обновление карточки
                                    console.log(mode);
                                    console.log(response.data);

                                    if (response.data.delete) { // удаление task
                                        this.mainData.splice(index, 1); // с index элемента удалить 1
                                    }

                                    if (response.data.edit) { // редактирование task
                                        this.mainData[index].edit = false;
                                        this.mainData[index].info.title = title;

                                        if (response.data.id) { // если добавление task
                                            this.maxCardID = response.data.id;
                                            this.mainData[index].id = response.data.id; // присвоить ключ, полученный с синхры api database
                                            this.mainData[index].info.dateAdd = response.data.date;
                                            this.mainData[index].info.timeAdd = response.data.time;

                                            for (let i = 0; i < response.data.taskItemArr.length; i++) { // блок для внесения изменений в task Item
                                                this.mainData[index].info.tasksInfo[i].id = response.data.taskItemArr[i];
                                                this.mainData[index].info.tasksInfo[i].edit = false;
                                                this.mainData[index].info.tasksInfo[i].text = response.data.text[i];
                                            }
                                        }
                                    }
                                }
                                else {
                                    console.log("Data error");
                                }
                            })
                            .catch(error => console.log(error));
                    }
                    if (mode == "edit") { // включить редактирование
                        this.mainData[index].edit = true;
                    }
                    if (mode == "newItem") { // добавление нового пункта
                        this.mainData[index].info.tasksInfo.push(
                            {
                                id: Date.now(), // дабы исключить совпадающие ключи
                                text: "",
                                complete: false,
                                dateAdd: this.getNowDate(),
                                timeAdd: this.getNowTime(),
                                dateComplete: "",
                                timeComplete: "",
                                edit: true
                            }
                        )
                    }

                    if (taskid) { // если действия с task item'a
                        let taskIndex = this.getTaskIndexDataById(index, taskid)
                        if (taskIndex != -1) {
                            let mainTaskData = this.mainData[index].info.tasksInfo[taskIndex];
                            if (mode == "addItem") {
                                mode = (mainTaskData.id > this.maxTaskID ? "addTaskItem" : "editTaskItem"); // получение точной инфы из task item
                            }
                            if (mode == "sendComplete" || mode == "addTaskItem" || mode == "editTaskItem" || mode == "deleteItem") { // если эдит или чекбокс
                                if (mode == "sendComplete" && this.checkFullComplete(index)) {
                                    mode = "sendCompleteFull";
                                }
                                if (mode == "deleteItem" && this.mainData[index].info.tasksInfo.length == 1) { // если удаляется пункт и он последний
                                    mode = "deleteItemLast";
                                }

                                console.log(mode, taskIndex)
                                
                                axios // запрос на обновление данных Task Item
                                    .post(cookie.linkAPI, {
                                        type: "updateTaskItem",
                                        mode: mode,
                                        cardID: this.mainData[index].id,
                                        taskID: mainTaskData.id,
                                        complete: complete,
                                        text: text
                                    })
                                    .then(response => {
                                        if (response.data) { // если обновление карточки

                                            if (response.data.complete) { // если чекбокс
                                                mainTaskData.complete = response.data.complete;
                                                mainTaskData.dateComplete = response.data.date;
                                                mainTaskData.timeComplete = response.data.time;

                                                if (response.data.completeFull) { // если все пункты выполнены
                                                    this.mainData[index].info.dateComplete = response.data.date;
                                                    this.mainData[index].info.timeComplete = response.data.time;
                                                }
                                            }

                                            if (response.data.delete) { // если удаление
                                                this.mainData[index].info.tasksInfo.splice(taskIndex, 1); // с taskIndex элемента удалить 1
                                            }

                                            if (response.data.deleteLast) { // если удаляется последний элемент (удалить всю карточку)
                                                this.mainData.splice(index, 1); // с index элемента удалить 1
                                            }

                                            if (response.data.edit) {
                                                mainTaskData.text = text;
                                                mainTaskData.edit = false;

                                                if (response.data.id) { // если добавление task item
                                                    this.maxTaskID = response.data.id;
                                                    this.mainData[index].info.tasksInfo[taskIndex].id = response.data.id; // присвоить ключ, полученный с синхры api database
                                                    mainTaskData.dateAdd = response.data.date;
                                                    mainTaskData.timeAdd = response.data.time;
                                                }
                                            }
                                            
                                        }
                                        else {
                                            console.log("Data error");
                                        }
                                    })
                                    .catch(error => console.log(error));
                            }
                            if (mode == "editItem") {
                                this.mainData[index].info.tasksInfo[taskIndex].edit = true;
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
        },
        getNewCardId() { // получение нового id для новой карточки
            return (!this.mainData.length ? 1 : Number(this.mainData[this.mainData.length-1].id) + 1);
        },
        getMaxTaskId() {
            let dataTaskCount = 0;
            let dataCount = this.mainData.length;
            let arrMax = [];

            for (let i = dataCount-1; i >= 0; i--) { // перебор всех карточек
                if (this.mainData[i].type == "task") { // останавливаемся на task card (перебор с конца)
                    dataTaskCount = this.mainData[i].info.tasksInfo.length - 1
                    if (dataTaskCount != -1) {
                        arrMax.push(this.mainData[i].info.tasksInfo[dataTaskCount].id); // (возвращаем самый последний id)
                    }
                }
            }
            return (!arrMax ? 1 : Math.max.apply(null, arrMax));
        },
        checkFullComplete(index) {
            let count = 0;
            let checkData = this.mainData[index].info.tasksInfo;

            for (let i = 0; i < checkData.length; i++) {
                if (checkData[i].complete) {
                    count++;
                }
            }

            if (count == (checkData.length - 1)) {
                return true
            }
            else {
                return false;
            }
        },
        getNowDate() {
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth()).padStart(2, '0');
            let yy = String(today.getFullYear()).substring(2, 4);
            return `${dd}.${mm}.${yy}`;
        },
        getNowTime() {
            let today = new Date();
            let hh = String(today.getHours()).padStart(2, '0');
            let mm = String(today.getMinutes()).padStart(2, '0');
            return `${hh}:${mm}`;
        }
    },
    components: {
        Pane,
        Card
    }
}

</script>