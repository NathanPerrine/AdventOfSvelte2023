<script lang="ts">
  export let day: number
  import days from '$lib/shared/stores/days.json'

</script>

<section id={days[day-1].title} class="mt-4 px-4">
  <h1 class="text-3xl font-bold">Day {day}: {days[day-1].title}</h1>
  <p>{days[day-1].description}</p>
</section>