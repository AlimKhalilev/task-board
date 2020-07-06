<template>
    <div>
        <h1>Вы авторизированы!</h1>
        <p>Логин: {{ login }}</p>
        <router-link to="/reg">Регистрация</router-link>
        <a href="#" @click="exitLogin">Выйти</a>
    </div>
</template>

<style lang="scss">

</style>

<script>
import cookie from '@/components/Cookie.vue'
export default {
    data() {
        return {
            login: cookie.getCookie("login"),
            isMounted: 0
        }
    },
    methods: {
        exitLogin() {
            cookie.deleteCookie("login");
            cookie.deleteCookie("_ym_gflne");
            cookie.$emit("openAuth", 0); // кидаем на авторизацию
        }
    }
}
</script>