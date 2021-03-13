<template>
	<v-app-bar app fixed color="white" clipped-right elevation="10">
		<div class="d-flex align-center justify-space-between d-block top-bar">
			<div class="d-flex align-center">
				<v-app-bar-nav-icon class="d-lg-none d-block" @click.stop="$emit('meunClicked')"></v-app-bar-nav-icon>
				<v-toolbar-title class="text-h5 ms-2">King lab</v-toolbar-title>
			</div>
			<img src="../../assets/logo.jpg" width="130" />
		</div>
	</v-app-bar>
</template>

<script>
export default {
	name: 'TopNavbar',
};
</script>

<style lang="scss" scoped>
.top-bar {
	width: 100%;
}
</style>
