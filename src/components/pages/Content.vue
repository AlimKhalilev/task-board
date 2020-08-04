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
            isAuth: null, // по дефолту еще не известно что загружать
        }
    },
    mounted() {
        if (!cookie.getCookie("_ym_rwots") || !cookie.getCookie("_ym_gflne")) {
            this.isAuth = 0; // кидаем на авторизацию
        }
        else {
            axios
                .post(cookie.linkAPI, {
                    type: "checkAuth",
                    _ym_rwots: cookie.getCookie("_ym_rwots"),
                    _ym_gflne: cookie.getCookie("_ym_gflne"),

                })
                .then(response => {
                    if (response.data.status) { // если учетка из куки подтверждена
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