<script lang="ts">
	import type { PageData } from './$types';
	import { flip } from 'svelte/animate';
	import { crossfade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import Icon from '@iconify/svelte';
	import Title from '$lib/components/Title.svelte';
	export let data: PageData;

	const [send, receive] = crossfade({ duration: 500, easing: cubicInOut });

	type TaskType = 'CREATED_TOY' | 'WRAPPED_PRESENT';

	interface Task {
		elf: string;
		task: TaskType;
		minutesTaken: number;
		date: string;
	}

	type ElfData = {
		toyTasks: Task[];
		toyAverage: number;
		wrapTasks: Task[];
		wrapAverage: number;
	};
	let elfList: Elf[] = [];

	class Elf {
		name: string;
		toyTasks: Task[];
		wrapTasks: Task[];

		constructor(name: string) {
			this.name = name;
			this.toyTasks = [];
			this.wrapTasks = [];
		}

		getToyAverage(): string {
			const toyAverage = (
				this.toyTasks.reduce((acc, val) => acc + val.minutesTaken, 0) / this.toyTasks.length
			).toFixed(2);
			return toyAverage;
		}
		getWrapAverage(): string {
			const toyAverage = (
				this.wrapTasks.reduce((acc, val) => acc + val.minutesTaken, 0) / this.wrapTasks.length
			).toFixed(2);
			return toyAverage;
		}
	}

	data.tasks.forEach((task) => {
		let elfName = task.elf;
		let elf = elfList.find((elf) => elf.name === elfName);

		if (elf) {
			if (task.task === 'CREATED_TOY') {
				elf.toyTasks.push(task);
			} else if (task.task === 'WRAPPED_PRESENT') {
				elf.wrapTasks.push(task);
			}
		} else {
			let newElf = new Elf(elfName);
			if (task.task === 'CREATED_TOY') {
				newElf.toyTasks.push(task);
			} else if (task.task === 'WRAPPED_PRESENT') {
				newElf.wrapTasks.push(task);
			}

			elfList.push(newElf);
		}
	});

	let searchString = '';
	let filteredElfs: Elf[] = elfList;
	function searchElfs() {
		return (filteredElfs = elfList.filter((elf) => {
			let elfName = elf.name.toLowerCase();
			return elfName.includes(searchString.toLowerCase());
		}));
	}
	let currentSort = '';
	function sortElfsByToys() {
		if (currentSort === 'toys') {
			filteredElfs = filteredElfs.reverse();
		} else {
			currentSort = 'toys';
			filteredElfs = filteredElfs.sort((a, b) => {
				if (a.getToyAverage() > b.getToyAverage()) {
					return 1;
				}
				if (a.getToyAverage() < b.getToyAverage()) {
					return -1;
				}
				return 0;
			});
		}
	}
	function sortElfsByWrap() {
		if (currentSort === 'wrap') {
			filteredElfs = filteredElfs.reverse();
		} else {
			currentSort = 'wrap';
			filteredElfs = filteredElfs.sort((a, b) => {
				if (a.getWrapAverage() > b.getWrapAverage()) {
					return 1;
				}
				if (a.getWrapAverage() < b.getWrapAverage()) {
					return -1;
				}
				return 0;
			});
		}
	}
</script>

<section class="max-w-7xl mx-auto">
	<!-- Title -->
	<Title day={5} />

	<!-- Main -->
	<main class="w-full mt-8 mx-auto flex flex-wrap justify-between sm:justify-start">
		<div class="w-full flex flex-wrap justify-around mb-4">
			<input
				bind:value={searchString}
				on:input={searchElfs}
				type="text"
				placeholder="Search elfs by name"
				class="input input-bordered w-full max-w-xs mb-2 sm:my-0"
			/>
			<button
				class="btn btn-secondary w-36"
				class:!btn-primary={currentSort === 'toys'}
				on:click={sortElfsByToys}>Sort: <br /> Toys Task Time</button
			>
			<div class="flex items-center">
				<Icon icon="pixelarticons:sort" width="24" />
			</div>
			<button
				class="btn btn-secondary w-36"
				class:!btn-primary={currentSort === 'wrap'}
				on:click={sortElfsByWrap}>Sort: <br /> Wrap Task Time</button
			>
		</div>
		{#each filteredElfs as elf (elf.name)}
			<div
				class="card w-56 bg-base-200 border border-secondary m-2"
				in:receive={{ key: elf.name }}
				out:send={{ key: elf.name }}
				animate:flip={{ duration: 1000 }}
			>
				<div class="card-body py-4">
					<h2 class="card-title">Elf: {elf.name}</h2>
					<div class="flex">
						<div>
							<p>Toy Task Average:</p>
							{elf.getToyAverage()}
						</div>
						<div>
							<p>Wrap Task average</p>
							{elf.getWrapAverage()}
						</div>
					</div>
					<div class="card-actions">
						<label for={elf.name} class="btn btn-xs btn-primary w-full">
							Show all tasks <Icon icon="mdi:arrow-down-drop" width="24" />
						</label>
					</div>

					<!-- task modal -->
					<input type="checkbox" id={elf.name} class="modal-toggle" />
					<div class="modal" role="dialog">
						<div class="modal-box flex flex-row gap-2">
							<div class="w-full">
								<h2 class="text-xl font-bold">Toy tasks</h2>
								<ul class="my-2">
									{#each elf.toyTasks as tasks, i}
										<div class={'my-2 ' + (i % 2 === 0 ? 'bg-base-100' : 'bg-base-200')}>
											<li>Date: {tasks.date}</li>
											<li>Time: {tasks.minutesTaken}min</li>
										</div>
									{/each}
								</ul>
							</div>
							<div class="w-full">
								<h2 class="text-xl font-bold">Wrap tasks</h2>
								<ul>
									{#each elf.wrapTasks as tasks, i}
										<div class={'my-2 ' + (i % 2 === 0 ? 'bg-base-100' : 'bg-base-200')}>
											<li>Date: {tasks.date}</li>
											<li>Time: {tasks.minutesTaken}min</li>
										</div>
									{/each}
								</ul>
							</div>
						</div>
						<label class="modal-backdrop" for={elf.name}>Close</label>
						<!-- modal div end -->
					</div>
				</div>
			</div>
		{/each}
  </main>
</section>
