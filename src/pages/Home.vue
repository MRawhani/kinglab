<template>
	<Layout title="الرئيسية">
		<v-row>
			<v-col md="3" sm="6" cols="12">
				<v-card class="d-flex justify-space-between align-center pa-5 bg-first" dark>
					<div class="">
						<span class="text-h3">{{ stats.agents }}</span>
						<p class="mb-0">
							اجمالي عدد العملاء
						</p>
					</div>
					<div class="">
						<v-icon class="circle" large>mdi-human-male-female</v-icon>
					</div>
				</v-card>
			</v-col>
			<v-col md="3" sm="6" cols="12">
				<v-card class="d-flex justify-space-between align-center pa-5 bg-second" dark>
					<div class="">
						<span class="text-h3">{{ stats.tests }}</span>
						<p class="mb-0">
							اجمالي عدد الفحوصات
						</p>
					</div>
					<div class="">
						<v-icon class="circle" large>mdi-test-tube</v-icon>
					</div>
				</v-card>
			</v-col>
			<v-col md="3" sm="6" cols="12">
				<v-card class="d-flex justify-space-between align-center pa-5 bg-thired " dark>
					<div class="">
						<span class="text-h3">{{ stats.companies }}</span>
						<p class="mb-0">
							اجمالي عدد الشركات
						</p>
					</div>
					<div class="">
						<v-icon class="circle" large>mdi-domain</v-icon>
					</div>
				</v-card>
			</v-col>
			<v-col md="3" sm="6" cols="12">
				<v-card class="d-flex justify-space-between align-center pa-5 bg-forth" dark>
					<div class="">
						<span class="text-h3">{{ stats.companyAgents }}</span>
						<p class="mb-0">
							اجمالي عدد عملاء الشركات
						</p>
					</div>
					<div class="">
						<v-icon class="circle" large>mdi-human-male-female</v-icon>
					</div>
				</v-card>
			</v-col>
		</v-row>
		<v-row class="mt-6">
			<v-col cols="12" md="6">
				<v-card>
					<v-card-text>
						<agents-per-branch :data="agentsPerBranchd" :title="'عدد العملاء حسب الفرع'"></agents-per-branch>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="12" md="6">
				<v-card>
					<v-card-text>
						<agents-per-branch :data="testsPerBranchd" :title="'عدد الفحوصات حسب الفرع'"></agents-per-branch>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</Layout>
</template>

<script>
import AgentsPerBranch from '../components/charts/agents-per-branch.vue';
import Layout from './layout/Layout';
import { homeComputed } from '../state/mapper.js';

export default {
	name: 'Home',

	components: {
		Layout,
		AgentsPerBranch,
	},

	page: {
		title: 'Home',
	},
	data: () => ({}),
	computed: {
		...homeComputed,
		agentsPerBranchd() {
			return {
				labels: this.branchAgents.map((branch) => branch.branch),
				datasets: [
					{
						label: 'العملاء',
						backgroundColor: 'rgba(33, 193, 214, 0.4)',
						borderColor: 'rgba(33, 193, 214, 0.8)',
						borderWidth: 1,
						data: this.branchAgents.map((branch) => branch.count),
					},
				],
			};
		},
		testsPerBranchd() {
			return {
				labels: this.branchTests.map((branch) => branch.branch),
				datasets: [
					{
						label: 'الفحوصات',
						backgroundColor: 'rgba(124, 77, 255, 0.4)',
						borderColor: 'rgba(124, 77, 255, 0.8)',
						borderWidth: 1,
						data: this.branchTests.map((branch) => branch.count),
					},
				],
			};
		},
	},
	methods: {},
};
</script>

<style lang="scss" scoped>
.bg-first {
	background: rgb(33, 193, 214);
	background: linear-gradient(207deg, rgba(33, 193, 214, 1) 0%, rgba(104, 222, 181, 1) 100%);
}

.bg-second {
	background: rgb(124, 77, 255);
	background: linear-gradient(207deg, rgba(124, 77, 255, 1) 0%, rgba(166, 179, 255, 1) 100%);
}

.bg-thired {
	background: rgb(255, 149, 0);
	background: linear-gradient(207deg, rgba(255, 149, 0, 1) 0%, rgba(255, 201, 111, 1) 100%);
}

.bg-forth {
	background: rgb(83, 109, 254);
	background: linear-gradient(207deg, rgba(83, 109, 254, 1) 0%, rgba(135, 153, 254, 1) 100%);
}

.circle {
	border: 2px solid white;
	border-radius: 50%;
	padding: 0.35rem;
}
</style>
