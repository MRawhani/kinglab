<script>
import { Bar } from 'vue-chartjs';

export default {
	extends: Bar,
	props: {
		data: {
			type: Object,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
	},
	data: () => ({}),
	mounted() {
		this.renderChart(this.data, {
			responsive: true,
			maintainAspectRatio: false,
			legend: {
				display: false,
			},
			title: {
				display: true,
				text: this.title,
			},
			scales: {
				yAxes: [
					{
						ticks: {
							beginAtZero: true,
							stepSize: 5,
							max: Math.max(...this.data.datasets[0].data) + 5,
						},
					},
				],
			},
		});
	},
};
</script>
