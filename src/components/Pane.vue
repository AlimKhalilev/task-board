<template>
    <div class="section-main-pane">
        <div class="account">
            <h4 class="account-name">

                <svg><use xlink:href="../assets/main.svg#icon_user"></use></svg>
                <span>{{ login }}</span>
            </h4>
            <div class="account-links">
                <div class="account-links-icon add_card">
                    <svg><use xlink:href="../assets//main.svg#icon_add"></use></svg>
                    <div class="account-links-icon-dropdown">
                        <span @click="addCard('task')">Добавить задачу</span>
                        <span @click="addCard('note')">Добавить запись</span>
                    </div>
                </div>
                <div class="account-links-icon">
                    <svg @click="exitLogin"><use xlink:href="../assets/main.svg#icon_logout"></use></svg>
                </div>
            </div>
        </div>
        <div class="items">
            <PaneItem v-for="onceData in mainData" :key="onceData.id" v-bind:onceData="onceData"/>
        </div>
        <div class="author">
            <h4>{{ author }}</h4>
        </div>
    </div>
</template>

<script>
import cookie from '@/components/Cookie.vue'
import PaneItem from '@/components/PaneItem.vue'
export default {
    props: ["mainData"],
    data() {
        return {
            login: cookie.getCookie("login"),
            author: "TaskBoard v1.0 by F.Champ"
        }
    },
    methods: {
        exitLogin() {
            cookie.deleteCookie("login");
            cookie.deleteCookie("_ym_gflne");
            this.$emit("openAuth", 0); // кидаем на авторизацию
        },
        addCard(method) {
            this.$emit("addCard", method);
        }
    },
    components: {
        PaneItem
    }
}
</script>