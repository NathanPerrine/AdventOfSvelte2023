<script lang="ts">
    import { page } from '$app/stores';
</script>

<div class="container">
  <h1 class="text-3xl font-bold">{$page.status}: {$page.error?.message}</h1>
  <p>Sorry, this page isn't ready yet. Check back soon.</p>
</div>

<style>
  .container{
    margin-left: 24px;
    margin-top: 24px;
  }
</style>