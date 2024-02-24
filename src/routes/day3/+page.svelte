<script lang="ts">
	import { crossfade } from 'svelte/transition';
  import type { PageData } from './$types';
  import type { PersonPresentObj } from './+page';
	import { quintOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';

    export let data: PageData;

    let unsorted: PersonPresentObj[]
    $: unsorted = data.people.filter((person) => person.status === 'unsorted')
    let inSleigh: PersonPresentObj[]
    $: inSleigh = data.people.filter((person) => person.status === 'sleigh')

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
        }
      }
    });

    $: unsortedWeight = unsorted.map(person => person.weight).reduce((a: number, b: number) => a + b, 0);
    $: sleighWeight = inSleigh.map(person => person.weight).reduce((a: number, b: number) => a + b, 0);

    let draggedPerson : PersonPresentObj
    let draggedIndex: number
    let draggedFrom: string

    // Unsorted drag events
    $: draggingOverUnsorted = false;
    function dragEnterUnsorted() {
      draggingOverUnsorted = true;
    }
    function dragLeaveUnsorted() {
      draggingOverUnsorted = false;
    }
    function assignDropUnsorted(e: DragEvent) {
      if (draggedFrom != 'inSleigh') return
      if (!(Object.keys(draggedPerson).length === 0)) {
        const index = data.people.findIndex((person) => person.id === draggedPerson.id)
        data.people[index].status = 'unsorted'
        unsorted = unsorted
      }

      draggingOverUnsorted = false
      draggingOverinSleigh = false
      draggedFrom = ''
    }
    function getDraggingUnsorted(e: DragEvent) {
      draggedFrom = ''
      const id = (e.target as HTMLElement).getAttribute('data-id')
      const person = unsorted.find((person) => person.id === id);
      if (person) {
        draggedPerson = person
        draggedFrom = 'unsorted'
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
      if (draggedFrom != 'unsorted') return
      if (!(Object.keys(draggedPerson).length === 0)) {
        const index = data.people.findIndex((person) => person.id === draggedPerson.id)
        data.people[index].status = 'sleigh'
        inSleigh = inSleigh
      }

      draggingOverUnsorted = false
      draggingOverinSleigh = false
      draggedFrom = ''
    }
    function getDragginginSleigh(e: DragEvent) {
      draggedFrom = ''
      const id = (e.target as HTMLElement).getAttribute('data-id')
      const person = inSleigh.find((person) => person.id === id)
      if (person) {
        draggedPerson = person
        draggedFrom = 'inSleigh'
      }
    }

    // drag events for both
    function dragOver(e: DragEvent) {
      e.preventDefault();
    }

    function sendIt() {
      inSleigh.forEach(sleighPerson => {
        data.people = data.people.filter((person) => person.id != sleighPerson.id)
      });
    }

</script>

<div class="w-11/12 h-[90vh] mx-auto mt-12 flex gap-8 justify-center">

  <!-- unordered group div -->
  <div class="border border-secondary p-4 w-1/3 flex flex-col items-center"
    class:ring={draggingOverUnsorted}
    class:[&_*]:pointer-events-none={draggingOverUnsorted}
    role="list"
    on:dragenter={dragEnterUnsorted}
    on:dragleave={dragLeaveUnsorted}
    on:dragover={dragOver}
    on:drop={assignDropUnsorted}
  >
    <div class="min-h-32">
      <h2 class="text-2xl font-bold text-center">Unsorted</h2>
      <p>Remaining weight: {unsortedWeight.toFixed(2)} kg</p>
      <p>Status: </p>
    </div>
    <div class="divider divider-primary"></div>
    <div class="w-full flex flex-col flex-1 items-center overflow-auto">
      {#each unsorted as person, i (person.id) }
        <div draggable="true" on:drag={getDraggingUnsorted} role="listitem" data-id={person.id} class="card w-48 bg-base-200 shadow-xl border border-accent my-4 cursor-pointer"
        in:receive={{ key: person }}
        out:send={{ key: person }}
        animate:flip
        >
        <div class="card-body p-4">
          <h2 class="card-title">{person.name}</h2>
          <p>Present weight: {person.weight}</p>
        </div>
      </div>
      {/each}
    </div>
  </div>

  <!-- sorted sleigh group -->
  <div class="border border-secondary p-4 w-1/3 flex flex-col items-center"
    class:ring={draggingOverinSleigh}
    class:[&_*]:pointer-events-none={draggingOverinSleigh}
    role="list"
    on:dragenter={dragEnterinSleigh}
    on:dragleave={dragLeaveinSleigh}
    on:dragover={dragOver}
    on:drop={assignDropinSleigh}
  >
    <div class="min-h-32">
      <h2 class="text-2xl font-bold text-center">Sleigh</h2>
      <p>Total weight: {sleighWeight.toFixed(2)} kg</p>
      <p>Status:
        {#if sleighWeight <= 100.00}
          <span class="text-success">Good</span>
        {:else}
          <span class="font-bold text-error">Too heavy</span>
        {/if}
      </p>
      <div class="flex justify-center pt-4">
        <button on:click={sendIt} class="btn btn-success btn-sm"
          class:btn-disabled={sleighWeight > 100.00}
          disabled={0 > sleighWeight || sleighWeight > 100.00}
        >Send it!</button>
      </div>
    </div>
    <div class="divider divider-primary"></div>
    <div class="w-full flex flex-col flex-1 items-center overflow-auto">
      {#each inSleigh as person, i (person.id)}
      <div draggable="true" on:drag={getDragginginSleigh} role="listitem" data-id={person.id} class="card w-48 bg-base-200 shadow-xl border border-accent my-4 cursor-pointer"
      in:receive={{ key: person }}
      out:send={{ key: person }}
      animate:flip
      >
        <div class="card-body p-4">
          <h2 class="card-title">{person.name}</h2>
          <p>Present weight: {person.weight}</p>
        </div>
      </div>
      {/each}
    </div>
  </div>

</div>