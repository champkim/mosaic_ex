<script lang="ts">
  import PanelTopBar from "./PanelTopBar.svelte";
  let index = 0;
</script>

<div class="panel">
  <PanelTopBar />
  <div class="contents">Window {index}</div>
</div>

<style>
  .panel {
    width: 100%;
    background: #fefefe;
    border: 2px solid #636363;
  }
</style>
