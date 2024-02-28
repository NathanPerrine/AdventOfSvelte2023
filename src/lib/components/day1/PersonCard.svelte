<script lang="ts">
	import type { PersonObj } from "../../../routes/day1/+page.server";

  export let people : PersonObj[]
  export let goodOrBad : string
</script>

<div class={"card md:w-96 w-48 mt-4 md:mt-0 mx-1 bg-base-200 text-base-content border " +
  (goodOrBad == 'good'
    ? 'border-success'
    : 'border-error')}
  >

  <div class="card-body">
    <h2 class="card-title">
      {#if goodOrBad == 'good'}
      Goodest people
      {:else}
      Baddest people
      {/if}
    </h2>
    <div class="line-clamp-2 hover:line-clamp-none">
      {#each people as person}
      <p>
        {person.name}
      </p>
      {/each}
    </div>
    <p>Score: {people[0].tally}</p>
    <div class="card-actions md:justify-end justify-center">
      <div class={"rounded-full h-12 w-12  badge badge-primary badge-lg " +
      (goodOrBad == 'good'
        ? "bg-success text-success-content"
        : "bg-error text-error-content"
      )}
      >
      {people[0].tally}</div>
    </div>
  </div>
</div>