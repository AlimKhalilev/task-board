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
import cookie from '@/components/Cookie.vue'
import moment from 'moment'
import axios from 'axios'
export default {
    data() {
        return {
            maxCardID: 0,
            mainData: []
        }
    },
    mounted() {
        document.title = "Главная - TaskBoard"

        axios // запрос на получшение всех карточек из бд
            .post("https://files.thechampguess.ru/taskboard.php", {
                type: "getAllCards",
                login: cookie.getCookie("login")
            })
            .then(response => {
                if (response.data) {
                    this.mainData = response.data;
                    this.maxCardID = Number(this.mainData[this.mainData.length-1].id);
                }
                else {
                    console.log("Data error");
                }
            })
            .catch(error => console.log(error));

    },
    methods: {
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
                            date: moment().format('DD.MM.YY'),
                            time: moment().format('HH:mm')
                        }
                    },
                )
            }
            else { // если задача
                this.mainData.push(
                    {id:this.getNewCardId(), type: "task", edit: true, info:
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
                    if (mode == "update") {

                        // if (this.mainData[index].id > this.maxCardID) {
                        //     console.log("Добавление")
                        // }
                        // else {
                        //     console.log("Редактирование")
                        // }

                        axios // запрос на обновление данных карточки в бд
                            .post("https://files.thechampguess.ru/taskboard.php", {
                                type: "updateCardNote",
                                mode: (this.mainData[index].id > this.maxCardID ? "add" : "edit"),
                                login: cookie.getCookie("login"),
                                cardID: this.mainData[index].id,
                                title: title,
                                text: text
                            })
                            .then(response => {
                                if (response.data) { // если обновление карточки
                                    this.mainData[index].edit = false;
                                    this.mainData[index].info.title = title;
                                    this.mainData[index].info.text = text;
                                    this.mainData[index].info.date = response.data.date;
                                    this.mainData[index].info.time = response.data.time;

                                    
                                    if (response.data.id) { // если добавление карточки
                                        this.mainData[index].id = response.data.id; // присвоить ключ, полученный с синхры api database
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
                            .post("https://files.thechampguess.ru/taskboard.php", {
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
                    if (mode == "add") { // добавление \ редактирование
                        this.mainData[index].edit = false;
                        this.mainData[index].info.title = title;
                        this.mainData[index].info.dateAdd = moment().format('DD.MM.YY');
                        this.mainData[index].info.timeAdd = moment().format('HH:mm');
                    }
                    if (mode == "edit") { // включить редактирование
                        this.mainData[index].edit = true;
                    }
                    if (mode == "delete") { // удаление
                        this.mainData.splice(index, 1); // с index элемента удалить 1
                    }
                    if (mode == "newItem") { // добавление нового пункта
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
                            if (mode == "sendComplete") { // когда чекбокс галочка
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
        },
        getNewCardId() { // получение нового id для новой карточки
            return (!this.mainData.length ? 1 : Number(this.mainData[this.mainData.length-1].id) + 1);
        }
    },
    components: {
        Pane,
        Card
    }
}


/*
----- Запрос на получение всей инфы (из таблицы NOTE) --------

SELECT CardID AS ID, title, text, date, time FROM `note` WHERE cardID IN(
	SELECT ID FROM `cards` WHERE owner = (
		SELECT ID FROM `users` WHERE `login` = '$login'   
	)
)

-------- Запрос на получение инфы из всех карточек (NOTE, TASK)

SELECT cardID AS ID, type, title, text, date AS dateAdd, time AS timeAdd, date AS dateEnd, time AS timeEnd FROM `note`, `cards` WHERE cardID IN(
	SELECT ID FROM `cards` WHERE owner = (
		SELECT ID FROM `users` WHERE `login` = '$login'   
	)
) AND (cards.ID = note.ID) UNION ALL 

SELECT cardID AS ID, type, title, title AS text, dateAdd, timeAdd, dateEnd, timeEnd FROM `task`, `cards` WHERE cardID IN(
	SELECT ID FROM `cards` WHERE owner = (
		SELECT ID FROM `users` WHERE `login` = '$login'   
	)
) AND (cards.ID = task.cardID) ORDER BY ID


-------- Запрос для добавления карточки NOTE

START TRANSACTION;
SELECT @cardID:=MAX(cards.ID)+1, @noteID:=MAX(note.ID)+1 FROM `cards`, `note`;
INSERT INTO `cards` (`ID`, `owner`, `type`) VALUES (@cardID, (SELECT ID FROM `users` WHERE `login`='$login'), 1);
INSERT INTO `note`(`ID`, `cardID`, `title`, `text`, `date`, `time`) VALUES (@noteID, @cardID, 'title', 'text', '2020-07-14', '21:01:00');
COMMIT;

*/


            /* mainData: [
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
            */


</script>