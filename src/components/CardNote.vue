<template>
    <div class="card">

        <div class="card-header">
            <h3>{{ onceData.info.title }}</h3>
            <div class="card-header-links">
                <svg><use xlink:href="../assets/main.svg#icon_window_max"></use></svg>
            </div>
        </div>
        
        <div class="card-container">
            <div class="card-container-items">
                <div class="card-container-items-content">
                    <span>{{ onceData.info.text }}</span>
                </div>
            </div>
        </div>

        <div class="card-footer">
            <div class="card-footer-date">
                <svg><use xlink:href="../assets/main.svg#icon_calendar"></use></svg>
                <span>{{ onceData.info.date }} / {{ onceData.info.time }}</span>
            </div>
            <div class="card-footer-edit">
                <svg><use xlink:href="../assets/main.svg#icon_pencil"></use></svg>
                <svg><use xlink:href="../assets/main.svg#icon_close"></use></svg>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    props: ["onceData"],
    data() {
        return {

        }
    }
}
</script>