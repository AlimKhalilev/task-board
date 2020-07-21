<template>
    <div class="form">
        <div class="form-container">
            <div class="form-container-header">
                <h2>Регистрация</h2>
            </div>
            <form class="form-container-inner" v-on:submit.prevent="sendReg">
                <input type="text" name="login" placeholder="Логин" v-model="login">
                <input type="text" name="password" placeholder="Пароль" v-model="password">
                <hr>
                <input type="text" name="name" placeholder="Имя" v-model="name">
                <input type="text" name="surname" placeholder="Фамилия" v-model="surname">
                <input type="email" name="mail" placeholder="Почта" v-model="mail">
                <input type="submit" value="Регистрация">
                <div class="validate" v-if="validateMsg" v-bind:class="{success: successReg}">
                    <p v-html="validateMsg"></p>
                </div>
            </form>
            <div class="form-container-footer">
                <span>Уже есть аккаунт? <router-link to="/">Авторизация</router-link></span>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import cookie from '@/components/Cookie.vue'
export default {
    mounted() {
        document.title = "Регистрация - TaskBoard"
    },
    data() {
        return {
            login: '',
            password: '',
            name: '', 
            surname: '',
            mail: '',
            validateMsg: '',
            successReg: false
        }
    },
    methods: {
        sendReg() {
            if (this.login == "" || this.password == "" || this.name == "" || this.surname == "" || this.mail == "") { // проверка на заполненность полей
                this.validateMsg = 'Заполните все поля!';
                return 0;
            }
            else {
                axios // проверка на несуществование учетки в бд (1 нет, 0 есть)
                    .post(cookie.linkAPI, {
                        type: "checkReg",
                        login: this.login
                    })
                    .then(response => {
                        if (response.data == "none") { // если учетки нет
                            this.sendRegData();
                        }
                        else { // если учетка есть
                            this.validateMsg = 'Логин уже существует! <br>Придумайте другой';
                            this.successReg = false;
                            return 0;
                        }
                    }
                    )
                    .catch(error => console.log(error));
            }
        },
        sendRegData() { // запрос в бд на регистрацию
            axios
                .post(cookie.linkAPI, {
                    type: "registration",
                    login: this.login,
                    password: this.password,
                    name: this.name, 
                    surname: this.surname,
                    mail: this.mail,
                })
                .then(response => {
                    if (response.data.status) { // если успешная запись в БД из API
                        this.validateMsg = 'Вы успешно <br>зарегистрировались!';
                        this.successReg = true;
                        setTimeout(() => this.$router.push({path: '/'}), 2000); // переход на главную страницу через 2 сек
                    }
                    else{
                        console.log("Empty data"); // пустое значение из API
                    }
                }
                )
                .catch(error => console.log(error));
        }
    }
}
</script>