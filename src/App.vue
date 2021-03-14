<template>
	<v-app>
		<RouterView :key="$route.fullPath" />
		<!-- <div id="notification" class="hidden">
			<p id="message"></p>
			<button id="close-button" @click="closeNotification">
				Close
			</button>
			<button id="restart-button" @click="restartApp" class="hidden">
				Restart
			</button>
		</div> -->
	</v-app>
</template>

<script>
export default {
	name: 'App',

	page: {
		titleTemplate(title) {
			title = typeof title === 'function' ? title(this.$store) : title;
			return title ? `${title} | King labs` : 'King labs';
		},
	},
	// methods: {
	// 	closeNotification: function() {
	// 		const notification = document.getElementById('notification');

	// 		notification.classList.add('hidden');
	// 	},
	// 	restartApp: function() {
	// 		window.ipcRenderer.send('restart_app');
	// 	},
	// },
	// mounted() {
	// 	const notification = document.getElementById('notification');
	// 	const message = document.getElementById('message');
	// 	const restartButton = document.getElementById('restart-button');

	// 	window.ipcRenderer.on('update_available', () => {
	// 		window.ipcRenderer.removeAllListeners('update_available');
	// 		message.innerText = 'A new update is available. Downloading now...';
	// 		notification.classList.remove('hidden');
	// 	});

	// 	window.ipcRenderer.on('update_downloaded', () => {
	// 		window.ipcRenderer.removeAllListeners('update_downloaded');
	// 		message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
	// 		restartButton.classList.remove('hidden');
	// 		notification.classList.remove('hidden');
	// 	});
	// },
	created() {
		
		this.$vuetify.rtl = true;
		this.$vuetify.lang.current = 'ar';
	},
};
</script>

<style lang="scss">
@import '~nprogress/nprogress.css';

#notification {
	position: fixed;
	bottom: 20px;
	left: 20px;
	width: 200px;
	padding: 20px;
	border-radius: 5px;
	background-color: white;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
.hidden {
	display: none;
}
.v-application {
	background-color: #f2f5f7 !important;
}

.v-application a {
	text-decoration: none !important;
}
</style>
