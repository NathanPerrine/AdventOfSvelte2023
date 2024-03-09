<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import Icon from '@iconify/svelte';
	import { tick } from 'svelte';
	import { Confetti } from 'svelte-confetti';

	// Countdown to christmas
	const COUNTDOWN_DATE = new Date('Dec 25, 2024 00:00:00').getTime();
	let days = 0;
	let hours = 0;
	let minutes = 0;
	let seconds = 0;
	// Countdown every second
	let countdown = setInterval(function () {
		// Current time
		let now = new Date().getTime();

		// Time distance between target time and now
		let timeDistance = COUNTDOWN_DATE - now;

		// Calc days, hours, minutes, seconds
		days = Math.floor(timeDistance / (1000 * 60 * 60 * 24));
		hours = Math.floor((timeDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		minutes = Math.floor((timeDistance % (1000 * 60 * 60)) / (1000 * 60));
		seconds = Math.floor((timeDistance % (1000 * 60)) / 1000);
	}, 1000);

	let activeConfetti = false;
	async function showConfetti() {
		activeConfetti = false;
		await tick();
		activeConfetti = true;
	}
</script>

<section class="snow">
	<!-- Title -->
	<Title day={9} />

	<!-- Snowflake container -->
	<div>
		{#each { length: 50 } as _, i}
			<div class="snowflake"></div>
		{/each}
	</div>

	<main class=" mt-4">
		<!-- Countdown -->
		<div>
			<h1 class="text-7xl font-bold text-primary text-center">
				{days}D {hours}H {minutes}m {seconds}s
			</h1>
			<h3 class="text-xl text-secondary text-center">Until christmas!</h3>
		</div>
		<div class="relative flex flex-col justify-center items-center mt-8">
			<button on:click={showConfetti} class="wiggle">
				<Icon icon="mdi:present-outline" width="24"></Icon>
			</button>
			<p>Open a present while we wait?</p>
			{#if activeConfetti}
				<div class="confetti">
					<Confetti y={[-1, 1]} x={[-1, 1]} noGravity duration={750} amount={100} />
				</div>
			{/if}
		</div>
	</main>
</section>

<style lang="scss">
	.confetti {
		position: absolute;
		top: 50%;
		left: 50%;
		pointer-events: none;
	}

	@keyframes wiggle {
		0% {transform: rotate(0deg);}
		20% {transform: rotate(-15deg);}
		40% {transform: rotate(15deg);}
		60% {transform: rotate(-7deg);}
		80% {transform: rotate(7deg);}
		90% {transform: rotate(-3deg);}
		95% {transform: rotate(2deg);}
		100% {transform: rotate(0deg);}
	}
	.wiggle:hover {
		display: inline-block;
		animation: 1s wiggle forwards running;
	}

	.snow {
		height: calc(100vh - 60px) !important;
		padding: 0;
		margin: 0;
		position: relative;
		overflow: hidden;
	}

	.snowflake {
		--size: 1vw;
		width: var(--size);
		height: var(--size);
		background: white;
		border-radius: 50%;
		position: absolute;
		top: -5vh;
	}

	@keyframes snowfall {
		0% {
			transform: translate3d(var(--left-ini), 0, 0);
		}
		100% {
			transform: translate3d(var(--left-end), 110vh, 0);
		}
	}

	@for $i from 1 through 50 {
		.snowflake:nth-child(#{$i}) {
			--size: #{random(5) * 0.2}vw;
			--left-ini: #{random(20) - 10}vw;
			--left-end: #{random(20) - 10}vw;
			left: #{random(100)}vw;
			animation: snowfall #{5 + random(100)}s linear infinite;
			animation-delay: -#{random(10)}s;
		}
	}

	.snowflake:nth-child(6n) {
		filter: blur(1px);
	}
</style>
