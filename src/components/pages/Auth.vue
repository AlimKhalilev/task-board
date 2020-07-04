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

<style lang="scss">

</style>

<script>
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
            axios // запрос на авторизацию
                .post("https://files.thechampguess.ru/taskboard.php", {
                    type: "sendAuth",
                    login: this.login,
                    password: this.password
                })
                .then(response => {
                    if (response.data) { // если учетки нет
                        this.setCookie("login", this.login, 7);
                        this.setCookie("_ym_gflne", response.data, 7);
                        this.$emit("openAuth", 1); // зарегались
                    }
                    else { // если учетка есть
                        this.validateMsg = 'Введены неверные данные!';
                        return 0;
                    }
                }
                )
                .catch(error => console.log(error));
        },
        setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }
    }
}
</script>