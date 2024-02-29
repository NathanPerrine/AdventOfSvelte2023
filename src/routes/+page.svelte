<script lang="ts">
  import type { PageData } from './$types';
  import days from '$lib/shared/stores/days.json'
</script>

<section>
  <h1 class="text-3xl font-bold m-4">Advent of Svelte: 2023</h1>

  <div class="flex flex-wrap">

    {#each days as day}
      <div class="card w-96 bg-base-100 shadow-xl border border-secondary m-4">
        <div class="card-body">
          <h2 class="card-title">{day.day}: {day.title}</h2>
          <p class="line-clamp-2 hover:line-clamp-none">{day.description}</p>
        </div>
        <div class="collapse">
          <input type="checkbox" />
          <div class="collapse-title text-lg font-bold">Progress</div>
          <div class="collapse-content">
              <div class="flex flex-col">
                <div>
                  <h3 class="text-lg font-bold">Code</h3>
                  <progress class="progress progress-primary w-full" value={day.progress.code} max="100"></progress>
                </div>
                <div>
                  <h3 class="text-lg font-bold">Styling</h3>
                  <p>Desktop</p>
                  <progress class="progress progress-secondary w-full" value={day.progress['styling-desktop']} max="100"></progress>
                  <p>Mobile</p>
                  <progress class="progress progress-accent w-full" value={day.progress['styling-mobile']} max="100"></progress>
                </div>
              </div>
          </div>
        </div>
        <div class="card-actions justify-end">
          <a href={day.href} class="mb-4 mr-4 btn btn-accent btn-sm">Go &rarr;</a>
        </div>
      </div>
    {/each}
  </div>
</section>