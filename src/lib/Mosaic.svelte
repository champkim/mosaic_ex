<script lang="ts">
  import MosaicPanel from "./MosaicPanel.svelte";
  import { MosaicPanels } from "./stores/MosaicPanels";
  // import type {
  //   MosaicKey,
  //   MosaicParent,
  //   MosaicNode,
  //   MosaicBranch,
  //   MosaicDirection,
  //   MarkUps,
  //   MosaicPath,
  //   ResizeOptions,
  //   TileRenderer,
  // } from "./type/commonType";
  // import { v4 as uuid } from "uuid";
  //export let mosaicId;
</script>

<div id="mosaic" class="mosaic" style="flex-direction:row">
  {#each $MosaicPanels as markup}
    <div class="mosiacpanel" style="inset:{markup.style}">
      <!-- <MosaicPanel name={markup.name} /> -->
      <MosaicPanel renderToolbar={markup.name != "2"} path={markup.path}>
        Window {markup.name}</MosaicPanel
      >
      <!-- <div class="contents">Window {name || 1}</div> -->
      <!-- <div class="contents">Window {markup.name || 1}</div> -->
    </div>
  {/each}
</div>

<!-- <div class="mosaic" style="flex-direction:{mosaicData}">
  <Panel node={mosaicData} />  
</div> 
-->
<style>
  .mosiacpanel {
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
