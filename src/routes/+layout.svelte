<script lang="ts">
  import "../app.css";
  import Header from "$lib/components/header/header.svelte";
  export let data;
</script>

<Header />

<slot />