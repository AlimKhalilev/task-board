<script>

import Vue from 'vue';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
Vue.use(VueToast);

export default {
    show(msg) {
        Vue.$toast.open({
            message: msg,
            type: 'error'
        });
    }
}
</script>