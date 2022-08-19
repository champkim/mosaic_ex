<script lang="ts">
  import PanelTopBar from "./PanelTopBar.svelte";
  export let node = "";
</script>

<div class="panel">
  <PanelTopBar />
  <div class="contents">Window {node}</div>
</div>

<style>
  .panel {
    width: 100%;
    background: #fefefe;
    border: 2px solid #636363;
  }
</style>
