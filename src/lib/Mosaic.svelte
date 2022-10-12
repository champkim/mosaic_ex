<script lang="ts">
  import Panel from "./Panel.svelte";
  import PanelWindow from "./PanelWindow.svelte";
  import { MosaicPanels } from "./stores/MosaicPanel";
</script>

<div id="mosaic" class="mosaic" style="flex-direction:row">
  {#each $MosaicPanels as markup}
    <div class="panel" style="inset:{markup.style}">
      <PanelWindow name={markup.name} />
      <!-- <div class="contents">Window {markup.name || 1}</div> -->
    </div>
  {/each}
</div>

<!-- <div class="mosaic" style="flex-direction:{mosaicData}">
  <Panel node={mosaicData} />  
</div> 
-->
<style>
  .panel {
    background: #fefefe;
    border: 1px solid #636363;
    margin: 3px;
    border-radius: 4px;
    position: absolute;
  }

  .mosaic {
    position: relative;
    display: block;
    width: calc(100% - 8px);
    height: calc(100% - 56px - 40px);
    padding: 4px;
    background: #636363;
    display: flex;
  }
</style>
