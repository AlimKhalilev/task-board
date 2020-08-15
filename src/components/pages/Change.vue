<template>
    <div class="form">
        <div class="form-container">
            <div class="form-container-header">
                <h2>Смена пароля</h2>
            </div>
            <form class="form-container-inner" v-on:submit.prevent="sendAuth">
                <input type="text" name="pass" placeholder="Текущий пароль" v-model="pass">
                <input type="text" name="pass_repeat" placeholder="Новый пароль" v-model="pass_new">
                <input type="submit" value="Изменить">
                <div class="validate" v-if="validateMsg" v-bind:class="{success: successReg}">
                    <p v-html="validateMsg"></p>
                </div>
            </form>
            <div class="form-container-footer">
                <span>Вернуться на <router-link to="/">главную</router-link></span>
            </div>
        </div>
    </div>
</template>

<script>
import cookie from '@/components/Cookie.vue'
import axios from 'axios'
export default {
    data() {
        return {
            pass: "",
            pass_repeat: "",
            pass_new: "",
            validateMsg: "",
            successReg: false
        }
    },
    mounted() {
        document.title = "Смена пароля - TaskBoard"
    },
    methods: {
        sendAuth() {
            if (this.pass == "" || this.pass_new == "") { // проверка на заполненность полей
                this.validateMsg = 'Заполните все поля!';
                return;
            }
            axios // запрос на авторизацию
                .post(cookie.linkAPI, {
                    type: "sendChange",
                    _ym_rwots: cookie.getCookie("_ym_rwots"),
                    pass: this.pass,
                    pass_new: this.pass_new
                })
                .then(response => {
                    if (response.data.status) { // успешно
                        this.successReg = true;
                        this.validateMsg = 'Пароль успешно сменён!';
                        setTimeout(() => this.$router.push({path: '/'}), 2000); // переход на главную страницу через 2 сек
                    }
                    else { // не успешно
                        if (response.data.message == "errorDatabase") {
                            this.validateMsg = 'Произошла ошибка.. <br>Повторите попытку';
                        }
                        if (response.data.message == "noPass") {
                            this.validateMsg = 'Неверный текущий пароль..';
                        }
                    }
                }
                )
                .catch(error => console.log(error));
        }
    }
}
</script>