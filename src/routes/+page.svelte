<script lang="ts">
	import Icon from '@iconify/svelte';
	import PersonCard from '$lib/components/day1/PersonCard.svelte';

	export let data;
	let sortCount: number = 0;

  let group = data.people.reduce(
  (result:any, currentValue:any) => {
    (result[currentValue['tally']] = result[currentValue['tally']] || []).push(currentValue);
    return result;
  }, {});

  const minTally = Math.min(...Object.keys(group).map(Number))
  const maxTally = Math.max(...Object.keys(group).map(Number))

  let goodestPeople = group[maxTally]
  let baddestPeople = group[minTally]

  console.log(goodestPeople)


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

<section class="mt-4">
  <div class="flex flex-row justify-center md:space-x-4 p-4">
    <PersonCard people={goodestPeople} goodOrBad={'good'} />
    <PersonCard people={baddestPeople} goodOrBad={'bad'} />
  </div>
</section>

<section class="py-10 mx-4">
<h1 class="text-4xl mb-4 font-extrabold text-center">Santa's List</h1>
	<div class="max-w-[800px] h-[75vh] overflow-y-auto mx-auto border-2 border-accent rounded-md">
		<table class="table table-zebra">
			<thead class="sticky top-0 bg-base-300">
				<tr class="text-lg">
					<th>#</th>
					<th>Name</th>
					<th>Tally <button class="btn btn-sm btn-outline btn-accent-content" on:click={sortList}>
							<Icon icon="pixelarticons:sort" />
						</button>
					</th>
				</tr>
			</thead>
			<tbody class="">
				{#each sortedList as person, i}
					<tr class="hover text-lg">
						<th>{i + 1}</th>
						<td>{person.name}</td>
						<td class="flex items-center">
							<div class="px-2">
								{#if person.tally > 0}
									<Icon icon="pixelarticons:mood-happy" width="24" class="text-success" />
								{:else if person.tally == 0}
									<Icon icon="pixelarticons:mood-neutral" width="24" />
								{:else}
									<Icon icon="pixelarticons:mood-sad" width="24" class="text-error" />
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
