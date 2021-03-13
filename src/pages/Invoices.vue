<template>
	<layout>
		<div class="d-flex">
			<h1 class="text-h4">العمليات</h1>
			<v-spacer></v-spacer>
		</div>
		<v-divider class="my-4"></v-divider>
		<v-card>
			<v-toolbar flat color="white">
				<v-text-field v-model="search" label="بحث" dense outlined single-line hide-details append-icon="mdi-magnify"></v-text-field>
				<v-spacer></v-spacer>
				<v-dialog v-model="invoiceDialog" max-width="700px" @click:outside="closeForm">
					<edit-invoice-form
						:key="invoiceKey"
						ref="invoiceForm"
						:invoice="invoice"
						@canceled="closeForm"
						@submited="saveResult"
					></edit-invoice-form>
				</v-dialog>
			</v-toolbar>
		</v-card>
		<v-data-table :headers="headers" :loading="isLoading" :items="active" sort-by="id" sort-desc class="mt-8 elevation-16" :search="search">
			<template v-slot:[`item.actions`]="{ item }">
				<v-menu offset-y close-on-click origin="center center" transition="scale-transition">
					<template #activator="{ on, attrs }">
						<v-btn icon v-bind="attrs" v-on="on">
							<v-icon>mdi-dots-vertical</v-icon>
						</v-btn>
					</template>

					<v-list dense>
						<v-list-item-group color="primary">
							<v-list-item @click="editInvoice(item)">
								<v-list-item-icon>
									<v-icon>mdi-pencil</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title> ادخال النتيجة </v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list-item-group>
						<v-list-item-group color="primary" v-if="item.remain !== 0">
							<v-list-item @click="addRemain(item)">
								<v-list-item-icon>
									<v-icon>mdi-cash</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title> المبلغ المتبقي </v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list-item-group>
						<v-list-item-group color="primary">
							<v-list-item @click="printResultClicked(item)">
								<v-list-item-icon>
									<v-icon>mdi-printer</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title> طباعة النتيجة</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list-item-group>
						<v-list-item-group color="primary">
							<v-list-item @click="printInvoice(item)">
								<v-list-item-icon>
									<v-icon>mdi-printer</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title> طباعة السند</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list-item-group>
						<v-list-item-group color="primary">
							<v-list-item @click="generateCode(item)">
								<v-list-item-icon>
									<v-icon>mdi-qrcode-plus</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title> QR Code</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list-item-group>
					</v-list>
				</v-menu>
			</template>
			<template v-slot:[`item.delivery_at`]="{ value }">
				{{ new Date(value).toLocaleDateString() }}
			</template>
		</v-data-table>

		<v-dialog v-model="remainDialog" persistent max-width="350">
			<v-card>
				<v-card-title>مبلغ متبقي</v-card-title>
				<v-divider></v-divider>
				<div class="pa-5">
					<v-text-field v-model="remainAmount" readonly dense outlined label="مبلغ متبقي"></v-text-field>
				</div>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" text @click="remainDialog = false">
						اغلاق
					</v-btn>
					<v-btn color="primary" text @click="updateRemain">
						تم الدفع
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<confirm-dailog ref="confirm"></confirm-dailog>
	</layout>
</template>

<script>
import Layout from './layout/Layout.vue';
import { invoicesComputed, invoicesActions, resultsActions } from '../state/mapper';
import EditInvoiceForm from '../components/invoices/edit-invoice-form.vue';
import ConfirmDailog from '../components/base/confirm-dailog.vue';

export default {
	name: 'Invoices',
	components: { Layout, EditInvoiceForm, ConfirmDailog },
	data: () => ({
		search: '',
		isLoading: false,
		isEditMode: false,
		invoiceDialog: false,
		remainDialog: false,
		invoiceKey: 0,
		invoice: {
			amount: '',
			total_amount: '',
			remain: '',
		},
		remainAmount: 0,
		currentId: 0,
	}),

	computed: {
		...invoicesComputed,
		headers() {
			return [
				{ text: 'رقم العملية', value: 'invoice_no', sortable: false },
				{ text: 'اسم العميل', value: 'name', sortable: false },
				{ text: 'اسم الفحص', value: 'test', sortable: false },
				{ text: 'الفرع', value: 'branch', sortable: false },
				{ text: 'المبلغ المتبقي', value: 'remain', sortable: false },
				{ text: 'تاريخ التسليم', value: 'delivery_at', sortable: false },
				{ text: 'إدارة', value: 'actions', sortable: false },
			];
		},
	},

	methods: {
		...invoicesActions,
		...resultsActions,

		editInvoice(invoice) {
			this.invoiceKey++;
			Object.assign(this.invoice, invoice);
			this.invoiceDialog = true;
		},
		async saveResult({ data, isEdit, id }) {
			try {
				this.isLoading = true;
				isEdit ? await this.editResultAction({ resultData: data, resultId: id }) : await this.saveResultAction(data);
				this.$VAlert.success('تم حفظ النتيجة');
				this.isLoading = false;
			} catch (error) {
				this.$VAlert.error('عذرا حدث خطأ!');
				this.isLoading = false;
				console.log(error);
			}
		},

		isDelivered(item) {
			return item.delivered ? 'green lighten-4' : '';
		},

		addRemain(item) {
			this.remainAmount = item.remain;
			this.currentId = item.invoice_id;
			this.remainDialog = true;
		},

		async updateRemain() {
			try {
				await this.editRemainAction(this.currentId);
				this.$VAlert.success('تم حفظ النتيجة');
				this.remainDialog = false;
			} catch (error) {
				this.$VAlert.error('عذرا حدث خطأ!');
				this.remainDialog = false;
			}
		},

		async generateCode(item) {
			try {
				await this.getResultAction(item.id);
				this.$router.push({ path: `/invoices/qrcode/${item.invoice_no}` });
			} catch (error) {
				this.$VAlert.info('لم يتم ادخال النتيجة بعد!');
			}
		},

		async printResultClicked(item) {
			if (item.remain !== 0) {
				const confirmd = await this.$refs.confirm.open('مبلغ متبقي', 'يرجى دفع باقي المبلغ قبل التمكن من طباعة النتيجة', 'طباعة');
				if (confirmd) {
					this.printResult(item);
				}

				return;
			}

			this.printResult(item);
		},

		async printResult(item) {
			try {
				await this.getResultAction(item.id);
				this.$router.push({ path: `/invoices/result/${item.id}` });
			} catch (error) {
				this.$VAlert.info('لم يتم ادخال النتيجة بعد!');
			}
		},

		async printInvoice(item) {
			try {
				await this.getResultAction(item.id);
				this.$router.push({ path: `/agents/invoice/${item.id}` });
			} catch (error) {
				console.error(error);
				this.$VAlert.error('عذرا حدث خطأ!');
			}
		},

		closeForm() {
			this.$refs.invoiceForm.reset();
			this.isEditMode = false;
			this.invoiceDialog = false;
		},
	},
};
</script>

<style lang="scss" scoped></style>
