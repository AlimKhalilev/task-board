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
                <div class="account-links-menu" v-if="windowWidth <= 576">
                    <div class="navbar_mobile_open">
                        <input type="checkbox" v-model="menu">
                        <span aria-label="line1"></span>
                        <span aria-label="line2"></span>
                        <span aria-label="line3"></span>
                    </div>
                </div>
            </div>
        </div>

        <SlideUpDown :active="menu" :duration="delay" :tag="'aside'">
            <div class="items-cover">
                <div class="items">
                    <PaneItem v-for="onceData in filterData(mainData)" :key="onceData.id" v-bind:onceData="onceData"/>
                </div>
            </div>
            <div class="author">
                <h4>{{ author }}</h4>
            </div>
        </SlideUpDown>

    </div>
</template>

<script>
import cookie from '@/components/Cookie.vue'
import PaneItem from '@/components/PaneItem.vue'
import SlideUpDown from 'vue-slide-up-down'

export default {
    props: ["mainData"],
    data() {
        return {
            delay: 0,
            windowWidth: screen.width,
            menu: (screen.width <= 576 ? false : true),
            login: cookie.getCookie("login"),
            author: "TaskBoard v1.0 by F.Champ"
        }
    },
    mounted() {
        this.delay = 700; // чтобы изначально не было прогрузки
    },
    methods: {
        filterData(data) {
            return data.slice().reverse(); // обратный массив
        },
        exitLogin() {
            cookie.deleteCookie("login");
            cookie.deleteCookie("_ym_gflne");
            this.$emit("openAuth", 0); // кидаем на авторизацию
        },
        addCard(method) {
            this.$emit("addCard", method);
            // setTimeout(() => 
            //     document.getElementsByTagName("html")[0].scrollIntoView({behavior: "smooth", block: "end"}), 
            // 50); // плавная прокрутка вниз
        }
    },
    components: {
        PaneItem,
        SlideUpDown
    }
}
</script>