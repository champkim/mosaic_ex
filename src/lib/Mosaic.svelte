<script lang="ts">
  import Panel from "./Panel.svelte";
  import type { mosaic } from "./type/commonType";
  export let mosaicData: mosaic;
</script>

<div class="mosaic" style="flex-direction:{mosaicData.direction}">
  <Panel node={mosaicData} direction={mosaicData.direction} />
</div>

<style>
  .mosaic {
    position: relative;
    display: block;
    width: calc(100% - 8px);
    height: calc(100% - 56px);
    padding: 4px;
    background: #636363;
    display: flex;
  }
</style>
