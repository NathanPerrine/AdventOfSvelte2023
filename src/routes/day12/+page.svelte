<script lang="ts">
  import Title from '$lib/components/Title.svelte';

  let stickers: string[] = []
  let stickerCount = 11

  for (let index = 1; index <= stickerCount; index++) {
    stickers.push(`https://advent.sveltesociety.dev/data/2023/day-twelve/${index}.png`)
  }

  function addToCanvas(stickerImg: string) {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement
    let context = canvas.getContext("2d")
    let sticker = new Image();
    sticker.src = stickerImg
    sticker.style["width"] = "50px"
    context?.drawImage(sticker, 10, 10, 25, 50)
  }
</script>

<section>
  <!-- Title -->
  <Title day={12} />

  <main class="w-11/12 pt-4 mx-auto">
    <!-- Stickers -->
    <div class="flex flex-wrap justify-start">
      {#each stickers as sticker (sticker)}
      <button on:click={() => {addToCanvas(sticker)}}>
        <img src={sticker} alt="sticker" width="50px"/>
      </button>
      {/each}
    </div>

    <!-- Canvas -->
    <canvas id="canvas" class="border border-accent w-11/12 h-80 mx-auto bg-slate-300"></canvas>
  </main>

</section>