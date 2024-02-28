<script lang="ts">
	import { crossfade, fade, fly } from 'svelte/transition';
	import type { PageData } from './$types';
	import type { PersonPresentObj } from './+page';
	import { quintOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';

	export let data: PageData;

	let unsorted: PersonPresentObj[];
	$: unsorted = data.people.filter((person) => person.status === 'unsorted');
	let inSleigh: PersonPresentObj[];
	$: inSleigh = data.people.filter((person) => person.status === 'sleigh');

	const [send, receive] = crossfade({
		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;
			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
            transform: ${transform} scale(${t})
            opacity: ${t}
          `
			};
		}
	});

	$: unsortedWeight = unsorted
		.map((person) => person.weight)
		.reduce((a: number, b: number) => a + b, 0);
	$: sleighWeight = inSleigh
		.map((person) => person.weight)
		.reduce((a: number, b: number) => a + b, 0);

	let draggedPerson: PersonPresentObj;
	let draggedFrom: string;

	// Unsorted drag events
	$: draggingOverUnsorted = false;
	function dragEnterUnsorted() {
		draggingOverUnsorted = true;
	}
	function dragLeaveUnsorted() {
		draggingOverUnsorted = false;
	}
	function assignDropUnsorted(e: DragEvent) {
		if (draggedFrom != 'inSleigh') return;
		if (!(Object.keys(draggedPerson).length === 0)) {
			const index = data.people.findIndex((person) => person.id === draggedPerson.id);
			data.people[index].status = 'unsorted';
			unsorted = unsorted;
		}

		draggingOverUnsorted = false;
		draggingOverinSleigh = false;
		draggedFrom = '';
	}
	function getDraggingUnsorted(e: DragEvent) {
		draggedFrom = '';
		const id = (e.target as HTMLElement).getAttribute('data-id');
		const person = unsorted.find((person) => person.id === id);
		if (person) {
			draggedPerson = person;
			draggedFrom = 'unsorted';
		}
	}

	// inSleigh drag events
	$: draggingOverinSleigh = false;
	function dragEnterinSleigh() {
		draggingOverinSleigh = true;
	}
	function dragLeaveinSleigh() {
		draggingOverinSleigh = false;
	}
	function assignDropinSleigh(e: DragEvent) {
		if (draggedFrom != 'unsorted') return;
		if (!(Object.keys(draggedPerson).length === 0)) {
			const index = data.people.findIndex((person) => person.id === draggedPerson.id);
			data.people[index].status = 'sleigh';
			inSleigh = inSleigh;
		}

		draggingOverUnsorted = false;
		draggingOverinSleigh = false;
		draggedFrom = '';
	}
	function getDragginginSleigh(e: DragEvent) {
		draggedFrom = '';
		const id = (e.target as HTMLElement).getAttribute('data-id');
		const person = inSleigh.find((person) => person.id === id);
		if (person) {
			draggedPerson = person;
			draggedFrom = 'inSleigh';
		}
	}

	// drag events for both
	function dragOver(e: DragEvent) {
		e.preventDefault();
	}

	function sendIt() {
		transitionToggle = !transitionToggle;
		setTimeout(() => {
			inSleigh.forEach((sleighPerson) => {
				data.people = data.people.filter((person) => person.id != sleighPerson.id);
			});
			toggleBack();
		}, 10);

		function toggleBack() {
			setTimeout(() => {
				console.log('toggleback');
				transitionToggle = !transitionToggle;
			}, 10);
		}
	}

	$: transitionToggle = false;

	function autoLoad() {
		unsorted.forEach((autoPerson) => {
			if (sleighWeight + autoPerson.weight <= 100.0) {
				const index = data.people.findIndex((person) => person.id === autoPerson.id);
				data.people[index].status = 'sleigh';
				inSleigh = inSleigh;
				sleighWeight += autoPerson.weight;
			}
		});
	}
</script>

<section id="title" class="mt-4 px-4">
  <h1 class="text-3xl font-bold">Day 3 - Jingle Bell Balancer</h1>
  <p>Sleigh Load balancer: a tool that can help plan out present loads up to 100kg.</p>
  <p class="hidden sm:block">Drag and drop tiles from either column into the other to help plan out a load, or use the "Auto Load &rarr;" button to generate a quick load up to the maximum capacity.</p>
</section>

<section>
	<div
		class="w-11/12 h-[70vh] sm:h-[80vh] mx-auto mt-6 sm:mt-12 flex flex-wrap flex-row sm:flex-row gap-8 justify-center"
	>
		<!-- unordered group div -->
		<div
			class="border border-secondary w-2/5 max-h-full sm:w-1/3 flex flex-col items-center"
			class:ring={draggingOverUnsorted}
			class:[&_*]:pointer-events-none={draggingOverUnsorted}
			role="list"
			on:dragenter={dragEnterUnsorted}
			on:dragleave={dragLeaveUnsorted}
			on:dragover={dragOver}
			on:drop={assignDropUnsorted}
		>
			<div class="pt-4 px-4 min-h-44">
				<h2 class="text-2xl font-bold text-center">Unsorted</h2>
				<p>Remaining weight: {unsortedWeight.toFixed(2)} kg</p>
				<p class="hidden sm:block">Drag and drop gifts into the sleigh</p>
				<div class="flex justify-center my-3 sm:my-0">
					<button class="btn btn-info btn-sm" on:click={autoLoad}>Auto load &rarr;</button>
				</div>
			</div>
			<div class="divider divider-primary mb-0 h-0"></div>
			<div
				class="w-full flex flex-col overflow-auto [&>*:nth-child(3n-2)]:bg-base-100 [&>*:nth-child(3n-1)]:bg-base-200 [&>*:nth-child(3n)]:bg-base-300"
			>
				{#each unsorted as person, i (person.id)}
					<div
						draggable="true"
						on:drag={getDraggingUnsorted}
						role="listitem"
						data-id={person.id}
						class="w-full shadow-xl border-b border-accent cursor-pointer"
						in:receive={{ key: person }}
						out:send={{ key: person }}
						animate:flip
					>
						<div class="card-body p-4">
							<h2 class="card-title">{person.name}</h2>
							<p>Present weight: {person.weight} kg</p>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- sorted sleigh group -->
		<div
			class="border border-secondary w-2/5 max-h-full sm:w-1/3 flex flex-col items-center"
			class:ring={draggingOverinSleigh}
			class:[&_*]:pointer-events-none={draggingOverinSleigh}
			role="list"
			on:dragenter={dragEnterinSleigh}
			on:dragleave={dragLeaveinSleigh}
			on:dragover={dragOver}
			on:drop={assignDropinSleigh}
		>
			<div class="pt-4 px-4 h-44">
				<h2 class="text-2xl font-bold text-center">Sleigh</h2>
				<p>Total weight: {sleighWeight.toFixed(2)} kg</p>
				<p>
					Status:
					{#if sleighWeight <= 100.0}
						<span class="text-success">Good</span>
					{:else}
						<span class="font-bold text-error">Too heavy</span>
					{/if}
				</p>
				<div class="flex justify-center pt-4">
					<button
						on:click={sendIt}
						class="btn btn-success btn-sm"
						class:btn-disabled={sleighWeight > 100.0}
						disabled={0 > sleighWeight || sleighWeight > 100.0}>Send it!</button
					>
				</div>
			</div>
			<div class="divider divider-primary mb-0 h-0"></div>
			<div
				class="w-full flex flex-col flex-1 items-center overflow-auto [&>*:nth-child(3n-2)]:bg-base-100 [&>*:nth-child(3n-1)]:bg-base-200 [&>*:nth-child(3n)]:bg-base-300"
			>
				{#if !transitionToggle}
					{#each inSleigh as person, i (person.id)}
						<div
							draggable="true"
							on:drag={getDragginginSleigh}
							role="listitem"
							data-id={person.id}
							class="w-full shadow-xl border-b border-accent cursor-pointer"
							in:receive={{ key: person }}
							out:send={{ key: person }}
							animate:flip
						>
							<div class="card-body p-4">
								<h2 class="card-title">{person.name}</h2>
								<p>Present weight: {person.weight} kg</p>
							</div>
						</div>
					{/each}
				{:else}
					{#each inSleigh as person, i (person.id)}
						<div
							draggable="true"
							on:drag={getDragginginSleigh}
							role="listitem"
							data-id={person.id}
							class="w-full shadow-xl border-b border-accent cursor-pointer"
							out:fly={{ x: 100, y: -150, delay: i * 150 }}
						>
							<div class="card-body p-4">
								<h2 class="card-title">{person.name}</h2>
								<p>Present weight: {person.weight} kg</p>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</section>
