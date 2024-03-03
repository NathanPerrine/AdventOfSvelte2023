<script lang="ts">
	import type { PageData } from './../$types';
	import { slide, fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import cookie1 from '$lib/images/cookies/cookie1.svg';
	import cookie2 from '$lib/images/cookies/cookie2.svg';
	import cookie3 from '$lib/images/cookies/cookie3.svg';
	import milk from '$lib/images/cookies/milk.svg';
	import Title from '$lib/components/Title.svelte';
	export let data: PageData;

	const cookies = [cookie1, cookie2, cookie3, milk];
	let count = 0;
	$: count;
	function increment() {
		count++;
	}
	function decrement() {
		if (count > 0) {
			count--;
		}
	}
	function reset() {
		count = 0;
	}
</script>

<section>
	<!-- Title -->
	<Title day={2} />

	<main>
		<div class="h-12">
			{#key count}
				<h1 class="text-2xl text-center" transition:slide={{ duration: 1000 }}>{count}</h1>
			{/key}
		</div>
		<div class="flex justify-center">
			<button class="w-8 mx-2 btn btn-primary btn-sm" on:click={increment}>+</button>
			<button class="w-8 mx-2 btn btn-secondary btn-sm" on:click={decrement}>-</button>
			<button class="w-8 mx-2 btn btn-accent btn-sm" on:click={reset}>0</button>
		</div>

		<div class="flex items-center justify-center pt-4">
			{#if count > 4}
				<Icon icon="pixelarticons:mood-happy" width="36" class="text-success" />
			{:else}
				<Icon icon="pixelarticons:mood-neutral" width="36" />
			{/if}
		</div>

		<!-- cookie contianer -->
		<div
			class="w-11/12 max-w-4xl border border-accent flex flex-wrap content-start mt-4 h-[33vh] mx-auto overflow-auto p-4"
		>
			{#each { length: count } as _, i}
				<img
					transition:fly={{ y: 100 }}
					src={cookies[Math.floor(Math.random() * cookies.length)]}
					alt="cookie"
					class="w-12 h-12 m-2"
				/>
			{/each}
		</div>
	</main>
</section>
