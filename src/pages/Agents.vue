<template>
	<layout>
		<div class="d-flex">
			<h1 class="text-h4">العملاء</h1>
			<v-spacer></v-spacer>
			<v-btn color="primary" dark class="mb-1 ms-2" @click="formDialog = true">
				<v-icon class="d-none d-sm-block me-2">mdi-plus</v-icon>
				<v-icon class="d-sm-none d-block">mdi-plus</v-icon>
				<span class="d-none d-sm-block"> إظافة عميل </span>
			</v-btn>
		</div>
		<v-divider class="my-4"></v-divider>
		<v-card>
			<v-toolbar flat color="white">
				<v-text-field v-model="search" label="بحث" dense outlined single-line hide-details append-icon="mdi-magnify"></v-text-field>
				<v-spacer></v-spacer>
				<v-btn color="primary" outlined class="mb-1 ms-2" :disabled="selected.length === 0" @click="openInvoice">
					<v-icon>mdi-plus</v-icon>
					<span class="d-none d-sm-block">إظافة فحص </span>
				</v-btn>

				<v-dialog v-model="formDialog" max-width="700px" @click:outside="closeForm">
					<agent-form
						ref="agentForm"
						:agent="updateAgent"
						:form-title="formTitle"
						:is-edit="isEditMode"
						@canceled="closeForm"
						@submited="saveAgent"
					></agent-form>
				</v-dialog>
				<v-dialog v-model="invoiceDialog" @click:outside="closeInvoiceForm" fullscreen>
					<invoice-form
						:key="invoiceKey"
						ref="invoiceForm"
						:agents="selectedAgents"
						@canceled="closeInvoiceForm"
						@submited="saveInvoice"
					></invoice-form>
				</v-dialog>
			</v-toolbar>
		</v-card>
		<v-data-table
			v-model="selected"
			:headers="headers"
			:loading="isLoading"
			:items="active"
			sort-by="id"
			sort-desc
			class="mt-8 elevation-16"
			:search="search"
			group-by="company"
			show-select
			single-select
		>
			<template v-slot:[`group.header`]="{ group }">
				<td colspan="7">
					{{ group !== 'NO' ? group : 'عادي' }}
				</td>
			</template>
			<template v-slot:[`item.actions`]="{ item }">
				<v-tooltip top>
					<template v-slot:activator="{ on }">
						<v-btn dark small min-width="40" color="success" @click="editAgent(item)" v-on="on">
							<v-icon size="18">mdi-pencil</v-icon>
						</v-btn>
					</template>
					<span> تعديل </span>
				</v-tooltip>
				<v-tooltip top v-if="canDelete">
					<template v-slot:activator="{ on }">
						<v-btn dark small min-width="40" class="mx-3" color="error" @click="deleteAgent(item)" v-on="on">
							<v-icon size="18">mdi-delete</v-icon>
						</v-btn>
					</template>
					<span>حذف</span>
				</v-tooltip>
			</template>
		</v-data-table>
		<v-dialog v-model="offlineDialog" max-width="350">
			<v-card>
				<v-card-title class="headline">لا يوجد انترنت</v-card-title>
				<v-card-text>عذرا لايمكن الطباعة بدون انترنت!</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" text @click="offlineDialog = false">اغلاق</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="existDialog" max-width="350">
			<v-card>
				<v-card-title class="headline">فحص مكرر</v-card-title>
				<v-card-text>سبق اظافة فحص لهذا العميل!</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" text @click="existDialog = false">اغلاق</v-btn>
					<v-btn color="primary" text @click="closeExistDialog">مواصلة العملية</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<confirm-dailog ref="confirm"></confirm-dailog>
	</layout>
</template>

<script>
// import Vue from 'vue';
import AgentForm from '../components/agents/agent-form.vue';
import ConfirmDailog from '../components/base/confirm-dailog';
import Layout from './layout/Layout.vue';
import { agentsComputed, agentsActions, invoicesActions, authComputed } from '../state/mapper';
import InvoiceForm from '../components/agents/invoice-form.vue';
import { print } from '../utils/print';

export default {
	name: 'Agents',

	components: { Layout, AgentForm, ConfirmDailog, InvoiceForm },

	data: () => ({
		search: '',
		isLoading: false,
		formDialog: false,
		invoiceDialog: false,
		offlineDialog: false,
		existDialog: false,
		isEditMode: false,
		addInvoiceAnyway: true,
		invoiceKey: 0,
		updateAgent: {
			name: '',
			age: '',
			gender: '',
			identity: '',
			identity_number: '',
		},
		agent: null,
		selected: [],
		result: [],
	}),

	computed: {
		...agentsComputed,
		...authComputed,
		headers() {
			return [
				{ text: 'الرقم', value: 'id', sortable: false },
				{ text: 'اسم العميل', value: 'name', sortable: false },
				{ text: 'عمر العميل', value: 'age', sortable: false },
				{ text: 'نوع الهوية', value: 'identity', sortable: false },
				{ text: 'نوع السفر', value: 'travel_type', sortable: false },
				{ text: 'إدارة', value: 'actions', sortable: false },
			];
		},
		formTitle() {
			return !this.isEditMode ? 'اظافة عميل' : 'تعديل عميل';
		},
		selectedAgents() {
			// eslint-disable-next-line vue/no-side-effects-in-computed-properties
			this.result = [];

			const agents = this.selected.length ? this.selected : this.agent ? [this.agent] : [];
			agents.forEach((agent) => {
				this.result.push({
					...agent,
					tests: [],
				});
			});

			return this.result;
		},
		canDelete() {
			return this.currentUser.permissions.includes('agents_delete');
		},
	},

	methods: {
		...agentsActions,
		...invoicesActions,

		editAgent(agent) {
			this.isEditMode = true;
			Object.assign(this.updateAgent, agent);
			this.formDialog = true;
		},

		async deleteAgent(agent) {
			try {
				const confirmed = await this.$refs.confirm.open('حذف مستخدم', 'هل انت متأكد من حذف هذا العميل؟');
				if (confirmed) {
					await this.deleteAgentAction(agent.id);
					this.$VAlert.success('تم حذف العميل');
				}
			} catch (error) {
				this.$VAlert.error('عذرا حدث خطأ!');
			}
		},

		async saveAgent(agent) {
			console.log(agent);
			try {
				if (this.isEditMode) {
					const agentId = this.updateAgent.id;
					await this.editAgentAction({ agentData: agent.data, agentId });
				} else {
					const data = await this.saveAgentAction(agent.data);
					this.agent = agent.withInvoice ? data : null;
					this.invoiceDialog = agent.withInvoice;
				}

				this.$VAlert.success('تم حفظ العميل');
			} catch (error) {
				this.$VAlert.error('عذرا حدث خطأ!');
			}
		},

		async saveInvoice({ data, withPrint }) {
			try {
				await this.saveInvoiceAction(data);
				this.$VAlert.success('تم حفظ الفاتورة');
				if (withPrint) {
					if (!window.navigator.onLine) {
						print(`/print/invoice/`);
					} else {
						this.offlineDialog = true;
					}
				}
			} catch (error) {
				this.$VAlert.error('عذرا حدث خطأ!');
			}
		},

		async openInvoice() {
			const agent = this.selected[0].name;
			const exist = await this.isAgentExistAction(agent);

			if (exist && this.addInvoiceAnyway) {
				this.existDialog = true;
				return;
			}

			this.invoiceKey++;
			this.invoiceDialog = true;
		},

		closeForm() {
			this.$refs.agentForm.reset();
			this.isEditMode = false;
			this.formDialog = false;
		},

		closeInvoiceForm() {
			this.$refs.invoiceForm.reset();
			this.invoiceDialog = false;
		},

		async closeExistDialog() {
			this.existDialog = false;
			this.addInvoiceAnyway = false;

			await this.openInvoice();
			this.addInvoiceAnyway = true;
		},
	},
};
</script>

<style lang="scss" scoped></style>
