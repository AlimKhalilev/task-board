<template>
    <div class="form">
        <div class="form-container">
            <div class="form-container-header">
                <h2>Авторизация</h2>
            </div>
            <form class="form-container-inner" v-on:submit.prevent="sendAuth">
                <input type="text" name="login" placeholder="Логин" v-model="login">
                <input type="password" name="password" placeholder="Пароль" v-model="password">
                <input type="submit" value="Войти">
                <div class="validate" v-if="validateMsg">
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
            password: "",
            validateMsg: ""
        }
    },
    methods: {
        sendAuth() {
            if (this.login == "" || this.password == "") { // проверка на заполненность полей
                this.validateMsg = 'Заполните все поля!';
                return 0;
            }
            axios // запрос на авторизацию
                .post("https://files.thechampguess.ru/taskboard.php", {
                    type: "sendAuth",
                    login: this.login,
                    password: this.password
                })
                .then(response => {
                    if (response.data) { // если учетки нет
                        cookie.setCookie("login", this.login, 7);
                        cookie.setCookie("_ym_gflne", response.data, 7);
                        this.$emit("openAuth", 1); // зарегались
                    }
                    else { // если учетка есть
                        this.validateMsg = 'Введены неверные данные!';
                        return 0;
                    }
                }
                )
                .catch(error => console.log(error));
        }
    }
}
</script>