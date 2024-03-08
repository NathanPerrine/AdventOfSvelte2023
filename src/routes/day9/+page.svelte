<script lang="ts">
    import Title from '$lib/components/Title.svelte';
import type { PageData } from './$types';

    export let data: PageData;
</script>

<section class="snow border border-accent">
  <!-- Title -->
  <Title day={9} />

  {#each {length: 50} as _, i}
    <div class="snowflake"></div>
  {/each}


  <main>

  </main>




</section>

<style lang="scss">
  .snow {
    height: calc(100vh - 60px) !important;
    padding: 0;
    margin: 0;
    position: relative;
    overflow: hidden;
    background: linear-gradient(#123, #111);
  }

  .snowflake {
    --size: 1vw;
    width: var(--size);
    height: var(--size);
    background: white;
    border-radius: 50%;
    position: absolute;
    top: -5vh;
  }

  @keyframes snowfall {
    0% {transform: translate3d(var(--left-ini), 0, 0);}
    100% {transform: translate3d(var(--left-end), 110vh, 0);}
  }

  @for $i from 1 through 50 {
    .snowflake:nth-child(#{$i}) {
      --size: #{random(5) * 0.2}vw;
      --left-ini: #{random(20) - 10}vw;
      --left-end: #{random(20) - 10}vw;
      left: #{random(100)}vw;
      animation: snowfall #{5 + random(100)}s linear infinite;
      animation-delay: -#{random(10)}s;
    }
  }

  .snowflake:nth-child(6n) {
    filter: blur(1px);
  }

</style>