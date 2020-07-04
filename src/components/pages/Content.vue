<template>
    <Board v-if="isAuth == 1" @openAuth="openPage"/>
    <AuthForm v-else-if="isAuth == 0" @openAuth="openPage"/>
</template>

<script>
import AuthForm from '@/components/pages/Auth.vue'
import Board from '@/components/pages/Board.vue'
import axios from 'axios'
export default {
    data() {
        return {
            login: this.getCookie("login"),
            isAuth: null, // по дефолту еще не известно что загружать
        }
    },
    mounted() {
        document.title = "Главная - TaskBoard"

        if (this.getCookie("login") == "" || this.getCookie("_ym_gflne") == "") {
            this.isAuth = 0; // кидаем на авторизацию
        }
        else {
            axios
                .post("https://files.thechampguess.ru/taskboard.php", {
                    type: "checkAuth",
                    login: this.getCookie("login"),
                    _ym_gflne: this.getCookie("_ym_gflne")
                })
                .then(response => {
                    if (response.data == "success") { // если учетка из куки подтверждена
                        this.isAuth = 1; // уже авторизированы
                    }
                    else {
                        this.isAuth = 0;
                    }
                }
                )
                .catch(error => console.log(error));
        }
    },
    methods: {
        getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
                }
            }
            return "";
        },
        openPage(state) {
            this.isAuth = state; // авторизировались
        }
    },
    components: {
        AuthForm,
        Board
    }
}
</script>