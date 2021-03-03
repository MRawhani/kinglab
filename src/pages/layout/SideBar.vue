<template>
	<v-navigation-drawer v-model="showDrawer" app right clipped color="#f2f5f7" class="pt-6">
		<v-list nav dense>
			<v-list-item-group v-if="userType === 'user'" color="primary">
				<template v-for="(link, i) in links">
					<v-list-item v-if="canAccess(link.name)" :key="i" link :to="link.href">
						<v-list-item-icon>
							<v-icon>{{ link.icon }}</v-icon>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title>{{ link.title }}</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</template>
				<v-list-item @click="syncData">
					<v-list-item-icon>
						<v-icon>mdi-sync</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>مزامنة</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list-item-group>
			<v-list-item-group v-else color="primary">
				<v-list-item v-for="(link, i) in companyLinks" :key="i" link :to="link.href">
					<v-list-item-icon>
						<v-icon>{{ link.icon }}</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>{{ link.title }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list-item-group>
		</v-list>

		<v-dialog v-if="userType === 'user'" v-model="syncing" width="300" persistent>
			<v-card color="primary" dark max-width="300">
				<v-card-text>
					<span class="py-2 d-block">يرجى الانتظار</span>
					<v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
				</v-card-text>
			</v-card>
		</v-dialog>
	</v-navigation-drawer>
</template>

<script>
import { authComputed } from '../../state/mapper';
import store from '../../state/store';

export default {
	name: 'SideBar',

	props: {
		drawer: {
			type: Boolean,
			default: true,
		},
	},

	data() {
		return {
			syncing: false,
			showDrawer: this.drawer,
			links: [
				{ title: 'الرئيسية', icon: 'mdi-view-dashboard', href: '/', name: 'dashboard' },
				{ title: 'العملاء', icon: 'mdi-human-male-female', href: '/agents', name: 'agents' },
				{ title: 'العمليات', icon: 'mdi-inbox-full-outline', href: '/invoices', name: 'invoices' },
				{ title: 'الفحوصات', icon: 'mdi-test-tube', href: '/tests', name: 'tests' },
				{ title: 'التقارير', icon: 'mdi-chart-bar', href: '/reports', name: 'reports' },
				{ title: 'المستخدمين', icon: 'mdi-account-group', href: '/users', name: 'users' },
				{ title: 'الفروع', icon: 'mdi-hospital-building', href: '/branches', name: 'branches' },
				{ title: 'الشركات', icon: 'mdi-domain', href: '/companies', name: 'companies' },
			],
			companyLinks: [{ title: 'عملاء الشركة', icon: 'mdi-human-male-female', href: '/company-agents' }],
		};
	},

	computed: {
		...authComputed,
		userType() {
			if (!this.currentUser) return 'user';
			return this.currentUser.type;
		},
	},

	watch: {
		drawer() {
			this.showDrawer = !this.showDrawer;
		},
	},

	methods: {
		canAccess(page) {
			if (!this.currentUser) return false;
			return this.currentUser.permissions.includes(page);
		},

		async syncData() {
			this.syncing = true;

			try {
				await store.dispatch('branches/sync');
				await store.dispatch('companies/sync');
				await store.dispatch('users/sync');
				await store.dispatch('tests/sync');
				await store.dispatch('agents/sync');
				await store.dispatch('invoices/sync');
				await store.dispatch('loadBaseData');

				this.syncing = false;
			} catch (error) {
				this.$VAlert.error('عذرا حدث خطأ!');
				this.syncing = false;
			}
		},
	},
};
</script>

<style lang="scss" scoped></style>
