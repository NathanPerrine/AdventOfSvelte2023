<script lang="ts">
  import "../app.css";
  import Header from "$lib/components/header/header.svelte";
</script>

<Header />

<div class="max-w-7xl mx-auto">
  <slot />
</div>