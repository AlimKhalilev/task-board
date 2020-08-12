<template>
    <div class="form">
        <div class="form-container">
            <div class="form-container-header">
                <h2>Восстановление <br> пароля</h2>
            </div>
            <form class="form-container-inner" v-on:submit.prevent="sendAuth">
                <input type="text" name="login" placeholder="Логин" v-model="login">
                <input type="submit" value="Восстановить">
                <div class="validate" v-if="validateMsg" v-bind:class="{success: successReg}">
                    <p v-html="validateMsg"></p>
                </div>
            </form>
            <div class="form-container-footer">
                <span>Еще нет аккаунта? <router-link to="/reg">Регистрация</router-link></span>
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
            login: "",
            validateMsg: "",
            successReg: false
        }
    },
    mounted() {
        document.title = "Восстановление пароля - TaskBoard"
    },
    methods: {
        sendAuth() {
            if (this.login == "") { // проверка на заполненность полей
                this.validateMsg = 'Заполните все поля!';
            }
            axios // запрос на авторизацию
                .post(cookie.linkAPI, {
                    type: "sendRestore",
                    login: this.login
                })
                .then(response => {
                    console.log(response.data);
                    if (response.data.status) { // успешно
                        this.successReg = true;
                        this.validateMsg = 'Новый пароль отправлен <br>на вашу почту!';
                        setTimeout(() => this.$router.push({path: '/'}), 2000); // переход на главную страницу через 2 сек
                    }
                    else { // не успешно
                        if (response.data.message == "errorDatabase") {
                            this.validateMsg = 'Произошла ошибка.. <br>Повторите попытку';
                        }
                        if (response.data.message == "noLogin") {
                            this.validateMsg = 'Учётная запись не найдена..';
                        }
                    }
                }
                )
                .catch(error => console.log(error));
        }
    }
}
</script>