<template>
	<div id="task-board">
		<router-view/>
	</div>
</template>

<script>

export default {
	name: 'app',
	components: {

	}
}

</script>

<style lang="scss">
	@import "./assets/scss/lib/normalize";
	@import "./assets/scss/lib/colors";
	@import "./assets/scss/lib/grid";
	@import "./assets/scss/lib/mixins";

	@import "./assets/scss/board";
	@import "./assets/scss/reg-auth";
	@import "./assets/scss/pane";
	@import "./assets/scss/pane-item";
	@import "./assets/scss/card";
	@import "./assets/scss/card-item";
</style>