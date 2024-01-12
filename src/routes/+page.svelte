<script lang="ts">
	import Icon from '@iconify/svelte';

	export let data;
  let sortCount: number = 0

  // function sort(a: number, b: number, type: string)

	function sortList() {
    switch (sortCount) {
      case 0:
        // descending sort
        sortedList = sortedList.sort((a: {tally: number}, b: {tally: number}) => (a.tally < b.tally ? -1 : 1));
        sortCount++
        break
      case 1:
        // ascending sort
        sortedList = sortedList.sort((a: {tally: number}, b: {tally: number}) => (a.tally > b.tally ? -1 : 1));
        sortCount++
        break
      default:
        // reset / failsafe
        sortedList = data.people.slice()
        sortCount = 0
        break
    }
	}

  $: sortedList = data.people.slice()
</script>

<div class="overflow-x-auto">
	<table class="table">
		<!-- {/* head */} -->
		<thead>
			<tr>
				<th></th>
				<th>Name</th>
				<th>Tally <button class="btn btn-sm btn-outline btn-accent" on:click={sortList}>
          <Icon icon="pixelarticons:sort" />
					</button>
				</th>
			</tr>
		</thead>
		<tbody>
			<!-- {/* rows */} -->
			{#each sortedList as person, i}
				<tr class="bg-base-200">
					<th>{i}</th>
					<td>{person.name}</td>
					<td>{person.tally}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
