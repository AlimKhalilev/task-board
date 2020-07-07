<template>
    <CardNote v-if="onceData.type == 'note'" v-bind:onceData="onceData"/>
    <CardTask v-else v-bind:onceData="onceData"/>
</template>

<script>
import CardNote from '@/components/CardNote.vue'
import CardTask from '@/components/CardTask.vue'
export default {
    props: ["onceData"],
    data() {
        return {

        }
    },
    components: {
        CardNote,
        CardTask
    }
}
</script>