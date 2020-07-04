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
export default {
    data() {
        return {
            login: this.getCookie("login"),
            isMounted: 0
        }
    },
    methods: {
        deleteCookie(name) {
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        },
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
        exitLogin() {
            this.deleteCookie("login");
            this.deleteCookie("_ym_gflne");
            this.$emit("openAuth", 0); // кидаем на авторизацию
        }
    }
}
</script>