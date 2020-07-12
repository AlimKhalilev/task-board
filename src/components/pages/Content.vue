<template>
    <Board v-if="isAuth == 1" @openAuth="openPage"/>
    <AuthForm v-else-if="isAuth == 0" @openAuth="openPage"/>
</template>

<script>
import AuthForm from '@/components/Auth.vue'
import Board from '@/components/Board.vue'
import cookie from '@/components/Cookie.vue'
import axios from 'axios'
export default {
    data() {
        return {
            login: cookie.getCookie("login"),
            isAuth: null, // по дефолту еще не известно что загружать
        }
    },
    mounted() {
        if (cookie.getCookie("login") == "" || cookie.getCookie("_ym_gflne") == "") {
            this.isAuth = 0; // кидаем на авторизацию
        }
        else {
            axios
                .post("https://files.thechampguess.ru/taskboard.php", {
                    type: "checkAuth",
                    login: cookie.getCookie("login"),
                    _ym_gflne: cookie.getCookie("_ym_gflne")
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