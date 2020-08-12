<template>
    <section class="section-outer section-main">
        <div class="section-inner">
            <Pane @openAuth="openAuth" @addCard="addCard" v-bind:mainData="mainData"/>
            <div class="section-main-cards" v-bind:class="{empty: !mainData.length}">
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
            firstLoad: false,
            isLoadData: false,
            maxCardID: 0,
            maxTaskID: 0,
            mainData: []
        }
    },
    updated() { // БЛОК ДЛЯ АНИМАЦИИ
        let newCard = document.getElementsByClassName("card")[0].querySelector(".card-header > input"); // проверка на фокус при доб. карты
        if (newCard != null) {
            newCard.focus();
        }
        if (!this.firstLoad) { // вызываем только 1 раз после первой загрузки
            let timeEqual = 0.2;

            if (!document.querySelectorAll(".card").length) { // если карточек нет
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
            this.firstLoad = true;
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
                    {id:Date.now(), type: "note", edit: true, info: // устанавливаем временный id для карты
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
                    {id:Date.now(), type: "task", edit: true, info:
                        {
                            title: "",
                            dateAdd: this.getNowDate(),
                            timeAdd: this.getNowTime(),
                            dateComplete: "",
                            timeComplete: "",
                            tasksInfo: [
                                {
                                    id: Date.now()+1,
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
            let EditIndex = 1500000000000;
            let index = this.getIndexDataById(id) // получаем index по id
            if (mode == "delete" && this.mainData[index].id > EditIndex) { // если удаляем, но карточка еще не в бд
                this.mainData.splice(index, 1); // с index элемента удалить 1 
                return;
            }
            if (index != -1) {
                if (type == "note") { // действия с записями
                    if (mode == "update") {

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
                                console.log(response.data);
                                if (response.data.status) { // если успешно и обновление карточки
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
                                if (response.data.status) { // если удаление успешно
                                    if (this.maxCardID == this.mainData[index].id) { // если мы удалили последнюю карточку
                                        this.maxCardID = this.mainData[index-1].id // присваиваем ID последней карты предыдущ. карту
                                    }
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
                                if (response.data.status) { // если обновление карточки TASK || успешный ответ
                                    console.log(mode);
                                    console.log(response.data);

                                    if (response.data.delete) { // удаление task
                                        if (this.maxCardID == this.mainData[index].id) { // если мы удалили последнюю карточку
                                            this.maxCardID = this.mainData[index-1].id; // присваиваем ID последней карты предыдущ. карту
                                        }
                                        this.mainData.splice(index, 1); // с index элемента удалить 1
                                        this.maxTaskID = this.getMaxTaskId();
                                    }

                                    if (response.data.edit) { // редактирование task
                                        this.mainData[index].edit = false;
                                        this.mainData[index].info.title = title;

                                        if (response.data.id) { // если добавление task
                                            this.maxCardID = response.data.id;
                                            this.maxTaskID = response.data.taskItemArr[response.data.taskItemArr.length - 1];
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
                                id: Date.now(), // уникальный ключ для новой задачи
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
                                
                                if (mode == "deleteItem" && mainTaskData.id > EditIndex) { // удаляем пустышку задачу
                                    if (this.mainData[index].info.tasksInfo.length == 1) { // если в пустышке удаляем последний TaskItem
                                        alert("В карточке должна быть как минимум 1 задача!");
                                        return;
                                    }
                                    this.mainData[index].info.tasksInfo.splice(taskIndex, 1);
                                    return
                                }

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
                                        if (response.data.status) { // если обновление карточки || успешно

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
                                                this.maxTaskID = this.getMaxTaskId();
                                            }

                                            if (response.data.deleteLast) { // если удаляется последний элемент (удалить всю карточку)
                                                if (this.maxCardID == this.mainData[index].id) { // если мы удалили последнюю карточку
                                                    this.maxCardID = this.mainData[index-1].id; // присваиваем ID последней карты предыдущ. карту
                                                }
                                                this.mainData.splice(index, 1); // с index элемента удалить 1
                                                this.maxTaskID = this.getMaxTaskId();
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
        getMaxTaskId() {
            let dataTaskIndex = 0;
            let arrMax = [];

            for (let i = 0; i < this.mainData.length; i++) { // перебор всех карточек
                if (this.mainData[i].type == "task") { // выбираем все карточки Task
                    dataTaskIndex = this.mainData[i].info.tasksInfo.length - 1
                    arrMax.push(this.mainData[i].info.tasksInfo[dataTaskIndex].id); // (возвращаем самый последний id)
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

        // if (screen.width > 768) { // добавляем гор. скролл на мышь если не моб.устройство mounted
        //     let paneCards = document.getElementsByClassName('section-main-cards')[0];
        //     if (paneCards.addEventListener) {
        //         paneCards.addEventListener("mousewheel", this.scrollHorizontally, false); // IE9, Chrome, Safari, Opera
        //         paneCards.addEventListener("DOMMouseScroll", this.scrollHorizontally, false); // Firefox
        //     } 
        //     else {
        //         paneCards.attachEvent("onmousewheel", this.scrollHorizontally); // IE 6/7/8
        //     }
        // }

        //         scrollHorizontally(e) { // method
        //     let needScroll = true; // скролл нужен

        //     if (e.target.closest(".card") != null) { // ищем карточку
        //         let containerCard = e.target.closest(".card").querySelector(".card-container"); // берем класс container
        //         if (e.target.closest(".card-container") && containerCard.scrollHeight != containerCard.offsetHeight) { // если есть скролл и это 100% container
        //             needScroll = false; // скролл не нужен
        //         }
        //     }

        //     if (needScroll) {
        //         let paneCards = document.getElementsByClassName('section-main-cards')[0];
        //         let scrollSpeed = 100;
        //         let scrollCount = paneCards.scrollLeft;
        //         e = window.event || e;
        //         let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        //         scrollCount -= (delta*scrollSpeed);
        //         //paneCards.scrollTo({left: scrollCount, behavior: 'smooth'});
        //         paneCards.scrollLeft = scrollCount;
        //         e.preventDefault();
        //     }

        // },

</script>