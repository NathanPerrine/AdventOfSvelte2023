<script lang="ts">
    import Title from '$lib/components/Title.svelte';
import type { PageData } from './$types';

    export let data: PageData;
</script>

<section class="snow border border-accent h-full">
  <!-- Title -->
  <Title day={9} />


  <main>

  </main>





</section>

<style>
  .snow {
    /* height: 90vh; */

  }

  :global(body) {
    background-color: pink;
  }
</style>