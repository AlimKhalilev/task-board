import cookie from '@/components/Cookie.vue'
import axios from 'axios'

export default {
    actions: {
        async getAllCards(ctx) {
            try {
                const response = await axios.post(cookie.linkAPI, { // запрос на получшение всех карточек из бд
                    type: "getAllCards",
                    _ym_rwots: cookie.getCookie("_ym_rwots")
                });
                ctx.commit('loadAllCards', response.data)
            }
            catch(e) {
                console.error(e)
            }
        },
        async sendDataResponse(ctx, data) {
            try {
                const response = await axios.post(cookie.linkAPI, { // запрос на действие с карточками Запись
                    type: data.type,
                    mode: data.mode,
                    cardID: data.cardID,
                    taskID: data.taskID,
                    title: data.title,
                    text: data.text,
                    complete: data.complete,
                    _ym_rwots: cookie.getCookie("_ym_rwots")
                });

                const allData = {outData: data, inData: response.data}
                if (response.data.updateCard || response.data.addCard) {
                    ctx.commit("updateCardStore", allData)
                }
                if (response.data.updateTaskItem || response.data.addTaskItem || response.data.complete) {
                    ctx.commit("updateTaskItemStore", allData)
                }
                if (response.data.deleteCard) {
                    ctx.commit("deleteCardStore", data.cardIndex)
                }
                if (response.data.deleteTaskItem) {
                    ctx.commit("deleteTaskItemStore", data)
                }

            }
            catch(e) {
                console.error(e)
            }
        },
    },
    mutations: {
        loadAllCards(state, data) {
            state.cards = data
            state.isLoadData = true
        },
        addNewCard(state, data) {
            state.cards.push(data)
        },
        addNewTaskItem(state, data) { 
            state.cards[data.index].info.tasksInfo.push(data.content)
        },
        changeCardEdit(state, data) {
            state.cards[data.index].edit = data.edit
        },
        deleteCardStore(state, index) {
            state.cards.splice(index, 1)
        },
        deleteTaskItemStore(state, data) {
            state.cards[data.cardIndex].info.tasksInfo.splice(data.taskIndex, 1)
        },
        changeTaskItemEdit(state, data) {
            state.cards[data.cardIndex].info.tasksInfo[data.taskIndex].edit = data.edit
        },
        updateCardStore(state, data) {
            if (data.inData.updateCard || data.inData.addCard) {
                state.cards[data.outData.cardIndex].edit = false
                state.cards[data.outData.cardIndex].info.title = data.outData.title
                if (data.outData.card == "note") {
                    state.cards[data.outData.cardIndex].info.text = data.outData.text
                }
            }
            if (data.inData.addCard) {
                state.cards[data.outData.cardIndex].id = data.inData.id
                state.cards[data.outData.cardIndex].saved = true
                if (data.outData.card == "note") {
                    state.cards[data.outData.cardIndex].info.date = data.inData.date
                    state.cards[data.outData.cardIndex].info.time = data.inData.time
                }
                else {
                    state.cards[data.outData.cardIndex].info.dateAdd = data.inData.date
                    state.cards[data.outData.cardIndex].info.timeAdd = data.inData.time
                    for (let i = 0; i < data.inData.taskItemArr.length; i++) {
                        state.cards[data.outData.cardIndex].info.tasksInfo[i].id = data.inData.taskItemArr[i]
                        state.cards[data.outData.cardIndex].info.tasksInfo[i].edit = false
                        state.cards[data.outData.cardIndex].info.tasksInfo[i].saved = true
                        state.cards[data.outData.cardIndex].info.tasksInfo[i].text = data.inData.text[i]
                    }
                }
            }
        },
        updateTaskItemStore(state, data) {
            if (data.inData.updateTaskItem || data.inData.addTaskItem) {
                state.cards[data.outData.cardIndex].info.tasksInfo[data.outData.taskIndex].text = data.outData.text
                state.cards[data.outData.cardIndex].info.tasksInfo[data.outData.taskIndex].edit = false
                if (data.inData.addTaskItem) {
                    state.cards[data.outData.cardIndex].info.tasksInfo[data.outData.taskIndex].id = data.inData.id
                    state.cards[data.outData.cardIndex].info.tasksInfo[data.outData.taskIndex].saved = true
                    state.cards[data.outData.cardIndex].info.tasksInfo[data.outData.taskIndex].dateAdd = data.inData.date
                    state.cards[data.outData.cardIndex].info.tasksInfo[data.outData.taskIndex].timeAdd = data.inData.time
                }
            }
            if (data.inData.complete) {
                state.cards[data.outData.cardIndex].info.tasksInfo[data.outData.taskIndex].complete = data.inData.complete
                state.cards[data.outData.cardIndex].info.tasksInfo[data.outData.taskIndex].dateComplete = data.inData.date
                state.cards[data.outData.cardIndex].info.tasksInfo[data.outData.taskIndex].timeComplete = data.inData.time

                if (data.inData.completeFull) {
                    state.cards[data.outData.cardIndex].info.dateComplete = data.inData.date
                    state.cards[data.outData.cardIndex].info.timeComplete = data.inData.time
                }
            }
        }
    },
    state: {
        cards: [],
        isLoadData: false,
    },
    getters: {
        mainData(state) {
            return state.cards;
        },
        isLoadData(state) {
            return state.isLoadData;
        },
    }
}