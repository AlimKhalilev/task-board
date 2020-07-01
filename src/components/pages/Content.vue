<template>
    <div>
        <h1>Главная страница</h1>
        <router-link to="/reg">Регистрация</router-link>
    </div>
</template>

<script>
export default {
    beforeCreate() {
        document.title = "Главная - TaskBoard"
    }
}
</script>