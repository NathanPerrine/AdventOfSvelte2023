<script lang="ts">
  import Icon from '@iconify/svelte';
  export let data;
  console.log(data)
  // console.log(data)
  // console.log(typeof(data))
  console.log(data.people)

  // let people = data
</script>

{#each data.people as person, i }
  <!-- {person.name} -->
{/each}

<div class="overflow-x-auto">
  <table class="table">
    <!-- {/* head */} -->
    <thead>
      <tr>
        <th></th>
        <th>Name</th>
        <th>Tally <button class="btn btn-sm btn-outline btn-accent"><Icon icon="pixelarticons:sort" /></button></th>
      </tr>
    </thead>
    <tbody>
      <!-- {/* rows */} -->
      {#each data.people as person, i}
        <tr class="bg-base-200">
          <th>{i}</th>
          <td>{person.name}</td>
          <td>{person.tally}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>