<template>
	<div class="">
		<div class="mt-8 mx-auto text-center" style="max-width: 400px">
			<div class="mt-3">
				<vue-qrcode :value="invoiceId"></vue-qrcode>
			</div>
			<div class="mt-3">
				<vue-qrcode :value="invoiceId"></vue-qrcode>
			</div>
			<div class="mt-3">
				<vue-qrcode :value="invoiceId"></vue-qrcode>
			</div>
		</div>
		<div class="d-flex justify-center my-4">
			<v-btn class="print me-4" color="primary" outlined @click="close">
				اغلاق
			</v-btn>
			<v-btn class="print" color="primary" @click="print">
				<v-icon left>mdi-printer</v-icon>
				طباعة
			</v-btn>
		</div>
	</div>
</template>

<script>
import VueQrcode from 'vue-qrcode';

export default { 
	name: 'ResultQrCode',    
	props: {
		invoiceId: {
			type: String,
			required: true,
		},
	},
	components: {
		VueQrcode,
	},

	methods: {
		print() {
			window.print();
		},

		close() {
			this.$router.go(-1);
		},
	},
};
</script>

<style lang="scss" scoped>
@media print {
	.print {
		display: none;
	}
}
</style>
