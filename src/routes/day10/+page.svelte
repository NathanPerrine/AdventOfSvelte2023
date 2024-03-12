<script lang="ts">
  import Title from '$lib/components/Title.svelte';
	import { slide } from 'svelte/transition';
  import type { PageData } from './$types';

  export let data: PageData;
  let count = 10
  $: count
  let countDown = setInterval(() => {
    if (count > 0){
      count--
    } else clearInterval(countDown)
  }, 1000)

</script>

<section>
  <!-- Title -->
  <Title day={10} />


  <!-- Main -->
  <main class="pt-4">
    <h3 class="text-xl text-center text-primary">Wait here a moment for a message from Santa.</h3>

    <p class="text-2xl text-center" transition:slide={{ duration: 1000 }}>
      {count}
    </p>

  </main>
</section>