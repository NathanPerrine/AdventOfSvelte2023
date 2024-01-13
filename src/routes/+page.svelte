<script lang="ts">
	import Icon from '@iconify/svelte';

	export let data;
	let sortCount: number = 0;

	// function sort(a: number, b: number, type: string)

	function sortList() {
		switch (sortCount) {
			case 0:
				// descending sort
				sortedList = sortedList.sort((a: { tally: number }, b: { tally: number }) =>
					a.tally < b.tally ? -1 : 1
				);
				sortCount++;
				break;
			case 1:
				// ascending sort
				sortedList = sortedList.sort((a: { tally: number }, b: { tally: number }) =>
					a.tally > b.tally ? -1 : 1
				);
				sortCount++;
				break;
			default:
				// reset / failsafe
				sortedList = data.people.slice();
				sortCount = 0;
				break;
		}
		console.log(sortedList);
	}

	$: sortedList = data.people.slice();
</script>

<section class="py-20 max-h-[75%]">
	<div class="flex flex-col overflow-x-scroll overflow-y-scroll max-w-[800px] mx-auto w-full max-h-[75%]">
		<table class="table table-zebra  border">
			<thead>
				<tr class="text-lg">
					<th>#</th>
					<th>Name</th>
					<th>Tally <button class="btn btn-sm btn-outline btn-accent" on:click={sortList}>
							<Icon icon="pixelarticons:sort" />
						</button>
					</th>
				</tr>
			</thead>
			<tbody>
				{#each sortedList as person, i}
					<tr class="hover text-lg border-none">
						<th>{i + 1}</th>
						<td>{person.name}</td>
						<td class="flex items-center">
							<div class="px-2">
								{#if person.tally > 0}
									<Icon icon="pixelarticons:mood-happy" width="24" class="text-green-300" />
								{:else if person.tally == 0}
									<Icon icon="pixelarticons:mood-neutral" width="24" />
								{:else}
									<Icon icon="pixelarticons:mood-sad" width="24" class="text-red-300" />
								{/if}
							</div>

							{person.tally}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
