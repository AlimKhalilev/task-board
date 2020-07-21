<template>
    <CardNote @updateCard="updateCard" v-if="onceData.type == 'note'" v-bind:onceData="onceData"/>
    <CardTask @updateCard="updateCard" v-else v-bind:onceData="onceData"/>
</template>

<script>
import CardNote from '@/components/CardNote.vue'
import CardTask from '@/components/CardTask.vue'
export default {
    props: ["onceData", "cardPos", "cardCount"],
    data() {
        return {

        }
    },
    methods: {
        updateCard(type, mode, id, title, text, taskid, complete) {
            this.$emit("updateCard", type, mode, id, title, text, taskid, complete);
        }
    },
    components: {
        CardNote,
        CardTask
    }
}
</script>