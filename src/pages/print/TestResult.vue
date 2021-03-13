<template>
	<div class="result-print">
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
					نتيجة الفحص
				</div>
				<div class="logo">
					<img src="~@/assets/logo.jpg" alt="logo" width="220" />
				</div>
			</div>
			<main>
				<h3>Molecular pathology report (PCR unit)</h3>
				<div class="data">
					<table class="result">
						<tbody>
							<tr>
								<td rowspan="3" style="background-color: #ccc">Patient Data</td>
								<td>Name</td>
								<td>{{ data.agent.name }}</td>
								<td>Age</td>
								<td>{{ data.agent.age }}</td>
							</tr>
							<tr>
								<td>Sex</td>
								<td>{{ data.agent.gender === 1 ? 'Male' : 'Female' }}</td>
								<td>PASSPORT NO</td>
								<td colspan="2">{{ data.agent.identity_number }}</td>
							</tr>
							<tr>
								<td>Time collection</td>
								<td>{{ new Date(data.invoice.created_at).toLocaleDateString() }}</td>
								<td>Time received</td>
								<td colspan="2">{{ new Date().toLocaleDateString() }}</td>
							</tr>
							<tr>
								<td colspan="5"></td>
							</tr>
							<tr>
								<td style="background-color: #ccc">COVID-19 PCR TEST</td>
								<td colspan="4">
									{{ data.result.result === 'Positive' ? 'Detected (Positive)' : 'Not Detected (Negative)' }}
								</td>
							</tr>
							<tr>
								<td colspan="5"></td>
							</tr>
							<tr>
								<td style="background-color: #ccc">PCR Processing</td>
								<td colspan="4">
									<ol style="margin: 0">
										<li>RNA was extracting using automated nuclelc Acid Extracting System.</li>
										<li>Extracting RNA was Apmlified using real Time PCR kit for detection of COVID-19.</li>
										<li>The test is curried out by using real time PCR (Trademark of BIO-RADCFX96).</li>
									</ol>
								</td>
							</tr>
							<tr>
								<td colspan="5"></td>
							</tr>
							<tr>
								<td style="background-color: #ccc">PCR Interpretion</td>
								<td colspan="4">
									<ol style="margin: 0">
										<li>This Assay is quantitative detection of COVID-19 virus.</li>
										<li>
											Both positive and negative control for the tested virus showed expected result, excluding false positive
											result.
										</li>
										<li>
											Not detected result may not rule out current or future infection, please correlate with clinical finding.
										</li>
										<li>Lower respiratory sample is recommended in sever and progressive disease.</li>
									</ol>
								</td>
							</tr>
							<tr>
								<td colspan="5"></td>
							</tr>
							<tr style="border-top: 1px solid #333">
								<td style="background-color: #ccc">Lab authority</td>
								<td colspan="3">
									{{ new Date().toLocaleDateString() }}
								</td>
								<td>
									{{ data.invoice.user || user.data.name }}
								</td>
							</tr>
						</tbody>
					</table>
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
import { resultsActions, authComputed } from '../../state/mapper';

export default {
	name: 'TestResult',
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
	},
	mounted() {
		window.addEventListener('afterprint', () => {
			this.updateDelivered(this.invoiceId);
		});
	},
	async created() {
		try {
			this.isLoading = true;
			this.data = await this.loadResultData(this.invoiceId);
		} catch (error) {
			console.error(error);
		}

		this.isLoading = false;
	},
	methods: {
		loadResultData: resultsActions.getResultDataAction,
		updateDelivered: resultsActions.editDeliveredAction,
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

.result-print {
	background-color: white;
	font-size: 14px;
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

.result-print main > h3 {
	direction: ltr;
	text-align: center;
	margin-top: 2rem;
	margin-bottom: 1rem;
}

.result-print table {
	direction: ltr;
	width: 100%;
	min-width: 100%;
	border-collapse: collapse;
}

.result-print table tr > td {
	border: 1px solid #333;
	padding: 1rem 0.5rem;
}

.result-print footer {
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
