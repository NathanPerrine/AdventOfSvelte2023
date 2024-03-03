<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from './Chart.svelte';
	import Header from '$lib/components/header/header.svelte';
	import Layout from '../+layout.svelte';
	import Title from '$lib/components/Title.svelte';

	type HeartRateRes = {
		heartRate: number;
		time: string;
	};

	let heartRates = <HeartRateRes[]>[];
	$: heartRates;
	let currentHeartRate: HeartRateRes;
	$: currentHeartRate = heartRates[heartRates.length - 1];
	let averageHeartRate: number;

	let timeFilter: string | number = 'all';
	let timeMax: number;

	$: if (heartRates) {
		if (timeFilter === 'all') {
			timeMax = -heartRates.length;
		} else if (typeof timeFilter === 'number') {
			timeMax = timeFilter;
		}

		averageHeartRate =
			heartRates
				.map((heartRate) => heartRate.heartRate)
				?.slice(Math.max(heartRates.length + timeMax, 0))
				.reduce((acc, val) => acc + val, 0) / (timeFilter === 'all' ? heartRates.length : -timeMax);
	}

	$: lineLabels = heartRates
		.map((heartRate) => heartRate.time)
		.slice(Math.max(heartRates.length + timeMax, 0));
	$: lineData = heartRates
		.map((heartRate) => heartRate.heartRate)
		.slice(Math.max(heartRates.length + timeMax, 0));

	onMount(() => {
		const interval = setInterval(async () => {
			const res = await fetch('https://advent.sveltesociety.dev/data/2023/day-four.json');
			const data = await res.json();
			const newHeartRate: HeartRateRes = {
				heartRate: data.heartRate,
				time: new Date().toLocaleTimeString()
			};
			heartRates = [...heartRates, newHeartRate];
		}, 1000);
		return () => clearInterval(interval);
	});

	function allTime() {
		timeFilter = 'all';
	}
	function tenSeconds() {
		timeFilter = -10;
	}
	function sixtySeconds() {
		timeFilter = -60;
	}
</script>

<section>
	<!-- Title -->
	<Title day={4} />

	<main>
		<div class="mt-6 mx-auto w-11/12">
			<div class="w-full flex flex-wrap justify-around">
				<div class="card my-2 w-36 sm:w-48 bg-base-200 shadow-xl border border-primary">
					<figure class="px-5 sm:px-10 pt-5 sm:pt-10">
						<svg
							class="heart"
							xmlns="http://www.w3.org/2000/svg"
							width="4em"
							height="4em"
							viewBox="0 0 24 24"
							><path
								fill="currentColor"
								fill-rule="evenodd"
								d="M8.962 19.37C6.019 16.972 2 13.009 2 9.26C2 3.35 7.5.663 12 5.5C16.5.663 22 3.349 22 9.26c0 3.748-4.02 7.711-6.962 10.11C13.706 20.458 13.04 21 12 21c-1.04 0-1.706-.543-3.038-1.63m1.131-8.624c.09-.128.164-.234.23-.325c.056.098.119.211.194.348l1.71 3.11c.166.302.33.598.493.813c.175.23.482.545.975.555c.493.009.813-.295.996-.518c.172-.209.345-.498.523-.794l.055-.093c.221-.367.36-.598.483-.764c.113-.153.179-.203.228-.23c.049-.028.125-.059.315-.077c.206-.02.474-.02.904-.02H18a.75.75 0 0 0 0-1.5h-.834c-.387 0-.73 0-1.016.027a2.23 2.23 0 0 0-.91.264a2.222 2.222 0 0 0-.694.644c-.171.231-.347.525-.546.857l-.048.08c-.087.144-.159.264-.224.368l-.21-.377l-1.709-3.108c-.154-.28-.307-.56-.463-.765c-.17-.223-.462-.52-.93-.544c-.467-.026-.789.237-.982.441c-.177.187-.36.448-.543.71l-.31.442c-.227.325-.37.527-.493.673c-.113.134-.176.178-.223.202c-.046.025-.118.051-.293.067c-.19.017-.438.018-.834.018H6a.75.75 0 0 0 0 1.5h.768c.357 0 .674 0 .94-.024c.29-.027.571-.085.85-.23c.28-.146.489-.343.676-.565c.173-.204.354-.463.559-.756z"
								clip-rule="evenodd"
							/></svg
						>
					</figure>
					<div class="card-body items-center text-center">
						<h2 class="card-title text-sm sm:text-xl">Current Heart Rate</h2>
						{#if currentHeartRate}
							<p class="h-4">{currentHeartRate?.heartRate}</p>
						{:else}
							<div class="skeleton h-4 w-full"></div>
						{/if}
					</div>
				</div>
				<div class="card my-2 w-36 sm:w-48 bg-base-200 shadow-xl border border-info">
					<figure class="px-5 sm:px-10 pt-5 sm:pt-10">
						<svg
							class="heart"
							xmlns="http://www.w3.org/2000/svg"
							width="4em"
							height="4em"
							viewBox="0 0 24 24"
							><path
								fill="currentColor"
								fill-rule="evenodd"
								d="M8.962 19.37C6.019 16.972 2 13.009 2 9.26C2 3.35 7.5.663 12 5.5C16.5.663 22 3.349 22 9.26c0 3.748-4.02 7.711-6.962 10.11C13.706 20.458 13.04 21 12 21c-1.04 0-1.706-.543-3.038-1.63m1.131-8.624c.09-.128.164-.234.23-.325c.056.098.119.211.194.348l1.71 3.11c.166.302.33.598.493.813c.175.23.482.545.975.555c.493.009.813-.295.996-.518c.172-.209.345-.498.523-.794l.055-.093c.221-.367.36-.598.483-.764c.113-.153.179-.203.228-.23c.049-.028.125-.059.315-.077c.206-.02.474-.02.904-.02H18a.75.75 0 0 0 0-1.5h-.834c-.387 0-.73 0-1.016.027a2.23 2.23 0 0 0-.91.264a2.222 2.222 0 0 0-.694.644c-.171.231-.347.525-.546.857l-.048.08c-.087.144-.159.264-.224.368l-.21-.377l-1.709-3.108c-.154-.28-.307-.56-.463-.765c-.17-.223-.462-.52-.93-.544c-.467-.026-.789.237-.982.441c-.177.187-.36.448-.543.71l-.31.442c-.227.325-.37.527-.493.673c-.113.134-.176.178-.223.202c-.046.025-.118.051-.293.067c-.19.017-.438.018-.834.018H6a.75.75 0 0 0 0 1.5h.768c.357 0 .674 0 .94-.024c.29-.027.571-.085.85-.23c.28-.146.489-.343.676-.565c.173-.204.354-.463.559-.756z"
								clip-rule="evenodd"
							/></svg
						>
					</figure>
					<div class="card-body py-4 items-center text-center">
						<h2 class="card-title text-sm sm:text-xl">Minimum Heart Rate:</h2>
						{#if averageHeartRate}
							{#if timeFilter === 'all'}
								<p>All time</p>
							{:else if timeFilter === -10}
								<p>Last 10 seconds</p>
							{:else if timeFilter === -60}
								<p>Last 60 seconds</p>
							{/if}
							<p class="h-4">{Math.min(...lineData)}</p>
						{:else}
							<div class="skeleton h-4 w-full"></div>
						{/if}
					</div>
				</div>
				<div class="card my-2 w-36 sm:w-48 bg-base-200 shadow-xl border border-primary">
					<figure class="px-5 sm:px-10 pt-5 sm:pt-10">
						<svg
							class="heart"
							xmlns="http://www.w3.org/2000/svg"
							width="4em"
							height="4em"
							viewBox="0 0 24 24"
							><path
								fill="currentColor"
								fill-rule="evenodd"
								d="M8.962 19.37C6.019 16.972 2 13.009 2 9.26C2 3.35 7.5.663 12 5.5C16.5.663 22 3.349 22 9.26c0 3.748-4.02 7.711-6.962 10.11C13.706 20.458 13.04 21 12 21c-1.04 0-1.706-.543-3.038-1.63m1.131-8.624c.09-.128.164-.234.23-.325c.056.098.119.211.194.348l1.71 3.11c.166.302.33.598.493.813c.175.23.482.545.975.555c.493.009.813-.295.996-.518c.172-.209.345-.498.523-.794l.055-.093c.221-.367.36-.598.483-.764c.113-.153.179-.203.228-.23c.049-.028.125-.059.315-.077c.206-.02.474-.02.904-.02H18a.75.75 0 0 0 0-1.5h-.834c-.387 0-.73 0-1.016.027a2.23 2.23 0 0 0-.91.264a2.222 2.222 0 0 0-.694.644c-.171.231-.347.525-.546.857l-.048.08c-.087.144-.159.264-.224.368l-.21-.377l-1.709-3.108c-.154-.28-.307-.56-.463-.765c-.17-.223-.462-.52-.93-.544c-.467-.026-.789.237-.982.441c-.177.187-.36.448-.543.71l-.31.442c-.227.325-.37.527-.493.673c-.113.134-.176.178-.223.202c-.046.025-.118.051-.293.067c-.19.017-.438.018-.834.018H6a.75.75 0 0 0 0 1.5h.768c.357 0 .674 0 .94-.024c.29-.027.571-.085.85-.23c.28-.146.489-.343.676-.565c.173-.204.354-.463.559-.756z"
								clip-rule="evenodd"
							/></svg
						>
					</figure>
					<div class="card-body py-4 items-center text-center">
						<h2 class="card-title text-sm sm:text-xl">Average Heart Rate:</h2>
						{#if averageHeartRate}
							{#if timeFilter === 'all'}
								<p>All time</p>
							{:else if timeFilter === -10}
								<p>Last 10 seconds</p>
							{:else if timeFilter === -60}
								<p>Last 60 seconds</p>
							{/if}
							<p class="h-4">{averageHeartRate.toFixed(2)}</p>
						{:else}
							<div class="skeleton h-4 w-full"></div>
						{/if}
					</div>
				</div>
				<div class="card my-2 w-36 sm:w-48 bg-base-200 shadow-xl border border-red-500">
					<figure class="px-5 sm:px-10 pt-5 sm:pt-10">
						<svg
							class="heart"
							xmlns="http://www.w3.org/2000/svg"
							width="4em"
							height="4em"
							viewBox="0 0 24 24"
							><path
								fill="currentColor"
								fill-rule="evenodd"
								d="M8.962 19.37C6.019 16.972 2 13.009 2 9.26C2 3.35 7.5.663 12 5.5C16.5.663 22 3.349 22 9.26c0 3.748-4.02 7.711-6.962 10.11C13.706 20.458 13.04 21 12 21c-1.04 0-1.706-.543-3.038-1.63m1.131-8.624c.09-.128.164-.234.23-.325c.056.098.119.211.194.348l1.71 3.11c.166.302.33.598.493.813c.175.23.482.545.975.555c.493.009.813-.295.996-.518c.172-.209.345-.498.523-.794l.055-.093c.221-.367.36-.598.483-.764c.113-.153.179-.203.228-.23c.049-.028.125-.059.315-.077c.206-.02.474-.02.904-.02H18a.75.75 0 0 0 0-1.5h-.834c-.387 0-.73 0-1.016.027a2.23 2.23 0 0 0-.91.264a2.222 2.222 0 0 0-.694.644c-.171.231-.347.525-.546.857l-.048.08c-.087.144-.159.264-.224.368l-.21-.377l-1.709-3.108c-.154-.28-.307-.56-.463-.765c-.17-.223-.462-.52-.93-.544c-.467-.026-.789.237-.982.441c-.177.187-.36.448-.543.71l-.31.442c-.227.325-.37.527-.493.673c-.113.134-.176.178-.223.202c-.046.025-.118.051-.293.067c-.19.017-.438.018-.834.018H6a.75.75 0 0 0 0 1.5h.768c.357 0 .674 0 .94-.024c.29-.027.571-.085.85-.23c.28-.146.489-.343.676-.565c.173-.204.354-.463.559-.756z"
								clip-rule="evenodd"
							/></svg
						>
					</figure>
					<div class="card-body py-4 items-center text-center">
						<h2 class="card-title text-sm sm:text-xl">Maximum Heart Rate:</h2>
						{#if averageHeartRate}
							{#if timeFilter === 'all'}
								<p>All time</p>
							{:else if timeFilter === -10}
								<p>Last 10 seconds</p>
							{:else if timeFilter === -60}
								<p>Last 60 seconds</p>
							{/if}
							<p class="h-4">{Math.max(...lineData)}</p>
						{:else}
							<div class="skeleton h-4 w-full"></div>
						{/if}
					</div>
				</div>
			</div>

			<Chart labels={lineLabels} heartRates={lineData} />
			<div class="flex justify-center md:justify-around flex-wrap">
				<button
					on:click={allTime}
					class="btn btn-secondary btn-sm md:btn-md w-24 m-2"
					class:!btn-primary={timeFilter == 'all'}>All Time</button
				>
				<button
					on:click={tenSeconds}
					class="btn btn-secondary btn-sm md:btn-md w-24 m-2"
					class:!btn-primary={timeFilter == -10}>Last 10 seconds</button
				>
				<button
					on:click={sixtySeconds}
					class="btn btn-secondary btn-sm md:btn-md w-24 m-2"
					class:!btn-primary={timeFilter == -60}>Last 60 seconds</button
				>
			</div>
		</div>
	</main>
</section>

<style>
	.heart {
		animation: beat 2s infinite;
	}

	@keyframes beat {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
