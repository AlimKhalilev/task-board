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

<style>
	*, ::before, ::after {
		box-sizing: border-box;
	}

	html, body {
		margin: 0;
		padding: 0;

		font-family: 'Comfortaa', cursive;
		font-size: 16px;
		background-color: #001925;
		color: #fff;
	}

	#task-board {

	}
</style>
