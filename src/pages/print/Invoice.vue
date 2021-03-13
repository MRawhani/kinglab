<template>
	<div class="invoice-print">
		<div v-if="isLoading" class="text-center mt-12 ">
			<v-progress-circular indeterminate size="48" color="primary"></v-progress-circular>
		</div>
		<div v-else class="wrapper">
			<div class="header">
				<div class="lab-info">
					<h3>مختبر كينغ لاب التشخيصي</h3>
					<h3>King Diagnostic Lab</h3>
				</div>
				<div class="title">
					سند قبض
				</div>
				<div class="logo">
					<img src="~@/assets/logo.jpg" alt="logo" width="220" />
				</div>
			</div>
			<main>
				<div class="head mt-5 text-subtitle-2">
					<div class="">رقم السند: {{ data.invoice.invoice_no }}</div>
					<div class="">التاريخ: {{ createdAt }}</div>
				</div>
				<table class="mt-3">
					<tbody>
						<tr>
							<td>
								اسم العميل: <span class="ms-2 text-subtitle-2">{{ data.agent.name }}</span>
							</td>
							<td style="text-align: left;">
								نوع التأشيرة: <span class="ms-2 text-subtitle-2">{{ data.agent.travel_type }}</span>
							</td>
						</tr>
						<tr>
							<td>
								رقم الجواز: <span class="ms-2 text-subtitle-2">{{ data.agent.identity_number }}</span>
							</td>
							<td style="text-align: left">
								اسم الفحص: <span class="ms-2 text-subtitle-2">{{ testName }}</span>
							</td>
						</tr>
						<tr>
							<td>
								المبلغ المستلم: <span class="ms-2 text-subtitle-2">{{ data.invoice.amount || data.invoice.total }} ريال</span>
							</td>
							<td style="text-align: left">
								المبلغ المتبقي: <span class="ms-2 text-subtitle-2">{{ data.invoice.remain }} ريال</span>
							</td>
						</tr>
					</tbody>
				</table>
				<div class="d-flex mt-4">
					<v-spacer></v-spacer>
					الموظف المختص: <span class="ms-2 text-subtitle-2">{{ user.data.name }}</span>
				</div>
			</main>
			<footer>
				<div class="logo">
					<img src="~@/assets/logo.jpg" alt="logo" width="150" />
				</div>
				<div class="address">
					<span></span>
					<p>عدن - المنصورة - تقاطع انيس</p>
					<span></span>
				</div>
			</footer>
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
import { invoicesActions, authComputed } from '../../state/mapper';

export default {
	name: 'Invoice',
	props: {
		invoiceId: {
			type: String,
			required: true,
		},
	},
	data: () => ({
		data: {},
		isLoading: false,
	}),
	computed: {
		user: authComputed.currentUser,
		testName() {
			return this.data.invoice.test ? this.data.invoice.test : this.data.invoice.agents[0].testName;
		},
		createdAt() {
			if (this.data.invoice.created_at) return new Date(this.data.invoice.created_at).toLocaleDateString();
			return new Date().toLocaleDateString();
		},
	},
	async created() {
		try {
			this.isLoading = true;
			console.log(this.invoiceId);
			this.data = await this.loadInvoiceData(parseInt(this.invoiceId));
		} catch (error) {
			console.error(error);
		}

		this.isLoading = false;
	},
	methods: {
		loadInvoiceData: invoicesActions.getInvoiceAction,

		print() {
			window.print();
		},

		close() {
			this.$router.go(-1);
		},
	},
};
</script>

<style lang="scss">
@media screen {
	.wrapper {
		max-width: 972px;
		margin: 8px auto;
	}
}

@media print {
	.print {
		display: none;
	}
}

.invoice-print {
	background-color: white;
	font-size: 14px;
}

.head {
	display: flex;
	justify-content: space-between;
}

.header {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	border-bottom: 3px solid red;
}

.title {
	text-align: center;
	padding: 1rem;
	align-self: center;
	font-size: 24px;
}

.lab-info {
	padding: 1rem;
	font-size: 18px;
	align-self: center;
}

.lab-info h3:first-child {
	color: red;
	margin-top: 0;
}

.lab-info h3:last-child {
	color: #2057a7;
	margin-bottom: 0;
}

.header .logo {
	text-align: left;
	padding: 0.5rem;
}

.invoice-print main > h3 {
	direction: ltr;
	text-align: center;
	margin-top: 2rem;
	margin-bottom: 1rem;
}

.invoice-print table {
	width: 100%;
	min-width: 100%;
	border-collapse: collapse;
}

.invoice-print table tr > td {
	border: 1px solid #333;
	padding: 1rem 0.5rem;
}

.invoice-print footer {
	margin-top: 1rem;
}

footer .logo {
	position: relative;
}

footer .logo::after {
	content: '';
	position: absolute;
	top: 55%;
	left: 0;
	width: calc(100% - 150px);
	height: 2px;
	background-color: #2057a7;
}

footer .address {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
}

footer .address > span {
	display: block;
	height: 2px;
	align-self: center;
}

footer .address > span:first-child {
	background-color: red;
}

footer .address > p {
	text-align: center;
}

footer .address > span:last-child {
	background-color: #2057a7;
}
</style>
