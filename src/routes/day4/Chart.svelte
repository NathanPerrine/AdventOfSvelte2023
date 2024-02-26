<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	export let labels: string[];
	export let heartRates: number[];

	let ctx: HTMLCanvasElement;
	let myChart: Chart;

	$: if (myChart) {
		myChart.data.datasets[0].data = heartRates;
		myChart.data.labels = labels;
		myChart.update();
	}

	onMount(async () => {
		myChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: ['red', 'blue'],
				datasets: [
					{
						label: 'Heart Rate',
						data: heartRates,
						backgroundColor: [
							'rgba(255, 99, 132, 0.2)',
							'rgba(54, 162, 235, 0.2)',
							'rgba(255, 206, 86, 0.2)',
							'rgba(75, 192, 192, 0.2)',
							'rgba(153, 102, 255, 0.2)',
							'rgba(255, 159, 64, 0.2)'
						],
						borderColor: [
							'rgba(255, 99, 132, 1)',
							'rgba(54, 162, 235, 1)',
							'rgba(255, 206, 86, 1)',
							'rgba(75, 192, 192, 1)',
							'rgba(153, 102, 255, 1)',
							'rgba(255, 159, 64, 1)'
						],
						borderWidth: 0.5
					}
				]
			},
			options: {
        animation: false,
				maintainAspectRatio: false,
				scales: {
					y: {
						beginAtZero: false
					}
				}
			}
		});
	});
</script>

<div class="card bg-gradient-info relative h-[20vh] w-full">
	<canvas id="myChart" bind:this={ctx} />
</div>
