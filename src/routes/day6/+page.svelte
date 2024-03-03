<script lang="ts">
	import Title from '$lib/components/Title.svelte';
  import Icon from '@iconify/svelte';
  import days from '$lib/shared/stores/days.json'

	let previousTime = 0;
	let clicks = 0;
	let beats = 0;
	let beatLength = 4;
	let measures = 0;
	let currentTime = 0;
	let bpm = 0;
	let timeDifference = 0;
	let bpmTotal = 0;
	let bpmFinal = 0;
	let beatTimeout: number;
	let active = true;
	$: bpmFinal;
	$: clicks;

	let beatClick = false;

	function beatsPerMinute() {
		console.log('clicked Beat');
		if (previousTime === 0) {
			previousTime = Date.now();
			beats++;
		} else if (Date.now() - previousTime > 2000) {
			// reset display + start counting beats again
			reset();
			beat();
		} else {
			beat();

			// Check if there's a current beatTimeout, if so clear it
			if (beatTimeout) {
				clearTimeout(beatTimeout);
			}
			// Start a 2 second timeout to deactivate the current display
			beatTimeout = setTimeout(() => {
				active = false;
			}, 2000);
		}
	}
	function beat() {
		// calc time difference & reset previous time
		currentTime = Date.now();
		timeDifference = currentTime - previousTime;
		previousTime = currentTime;
		// calc current BMP
		bpm = 60 / timeDifference;
		// Add BPM Total
		bpmTotal += bpm;
		// Increment total clicks
		clicks++;
		// Increment total beats for display display
		beats++;
		// Calculate final BPM
		bpmFinal = (bpmTotal / clicks) * 1000;
		active = true;

		if (beats > beatLength) {
			beats = 1;
			measures++;
		}
	}
	function reset() {
		previousTime = 0;
		clicks = 0;
		bpm = 0;
		bpmTotal = 0;
		bpmFinal = 0;
		beats = 0;
		measures = 0;
	}

	function beatDown() {
		// console.log('beatDown')
		beatClick = true;
	}
	function beatUp() {
		// console.log('beatUp')
		beatClick = false;
	}
</script>

<section>
	<!-- Title -->
	<Title day={6} />

	<main class="mt-8">
		<!-- beat section -->
		<div
			id="beat-section"
			class="w-full max-w-[350px] h-[350px] mx-auto flex flex-col items-center justify-between"
		>
			<!-- counter display -->
			<h1 id="counter-display" class="text-center text-2xl mx-auto">BPM</h1>

			<!-- beat display -->
			<div
				class="w-full my-2 flex-1 border-2 border-accent rounded-lg overflow-hidden card bg-primary"
			>
				<h1
					class="text-6xl text-center font-bold transition-all duration-500 text-primary-content"
					class:opacity-50={!active}
				>
					{bpmFinal.toFixed(0)}
				</h1>

				<div class="flex flex-wrap overflow-hidden">
					{#each { length: measures } as _}
						<span class="flex mx-2">
							{#each { length: beatLength } as _}
								<span
									class="text-primary-content transition-all duration-500"
									class:opacity-50={!active}
								>
									<Icon icon="solar:star-bold-duotone" />
								</span>
							{/each}
						</span>
					{/each}

					<div class="flex mx-2">
						{#each { length: beats } as _}
							<span
								class="text-primary-content transition-all duration-500"
								class:opacity-50={!active}
							>
								<Icon icon="solar:star-bold-duotone" />
							</span>
						{/each}
					</div>
				</div>
			</div>
			<!-- counter button -->
			<div class="flex">
				<span
					class={'relative text-2xl mr-2 pointer-events-none ' +
						(beatClick ? 'left-4' : 'point-right')}>👉</span
				>
				<button
					class="btn btn-accent w-32 text-xl mb-2"
					on:mousedown={beatDown}
					on:mouseup={beatUp}
					on:click={beatsPerMinute}>Beat</button
				>
				<span
					class={'relative text-2xl ml-2 pointer-events-none ' +
						(beatClick ? 'right-4' : 'point-left')}>👈</span
				>
			</div>
		</div>

		<!-- embeded video container -->
		<div class="flex flex-wrap justify-around mt-8">
			<div class="w-full text-center">Practice your beat with these videos!</div>
			<iframe
				class="m-2"
				width="560"
				height="315"
				src="https://www.youtube.com/embed/c1GxjzHm5us?si=jYrsUKQMWWvSILHF"
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
			></iframe>
			<iframe
				class="m-2"
				width="560"
				height="315"
				src="https://www.youtube.com/embed/iUAZXZV2wNA?si=4KxN4EAWEflFaqNn"
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
			></iframe>
		</div>
	</main>
</section>

<style>
	.point-right {
		animation: floatRight 2s ease 0s;
		animation-iteration-count: infinite;
	}
	.point-left {
		animation: floatLeft 2s ease 0s;
		animation-iteration-count: infinite;
	}

	@keyframes floatRight {
		0% {
			left: 0;
		}
		50% {
			left: 8px;
		}
		100% {
			left: 0;
		}
	}
	@keyframes floatLeft {
		0% {
			right: 0;
		}
		50% {
			right: 8px;
		}
		100% {
			right: 0;
		}
	}
</style>
