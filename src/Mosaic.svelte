<script lang="ts">
  import MosaicPanel from "./MosaicPanel.svelte";
  import { MosaicRender } from "./lib/MosaicRoot";
  // import type { MosaicDirection } from "./lib/type/commonType";
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
  let offsetWidth: number[] = [];
  let offsetHeight: number[] = [];
</script>

<div id="mosaic" class="mosaic" style="flex-direction:row">
  {#each $MosaicRender as markup, index}
    <div
      class="mosiacpanel"
      style="inset:{markup.style}"
      bind:offsetWidth={offsetWidth[index]}
      bind:offsetHeight={offsetHeight[index]}
    >
      <!-- <MosaicPanel name={markup.name} /> -->
      <!-- ref={(element) => (this.rootElement = element)} -->
      <MosaicPanel
        renderToolbar={markup.name != "2"}
        path={markup.path}
        direction={offsetWidth[index] > offsetHeight[index] ? "row" : "column"}
      >
        <!-- panelDirection={offsetWidth > offsetHeight ? "row" : "column"} -->
        <!-- direction={this.element.offsetWidth > this.element.offsetHeight? "row": "column"} -->
        <!-- rootElement={this.rootElement} -->

        <span slot="title">Window {markup.name}</span>
        <!-- {(markup.direction = offsetWidth[index] > offsetHeight[index] ? "row" : "column")} -->
        <h1 slot="contents">Window {markup.name}</h1>
        <!-- {offsetWidth[index]} x {offsetHeight[index]} -->
        <!-- {markup.direction} -->

        <!-- direction={this.element.offsetWidth > this.element.offsetHeight? "row": "column"} -->
      </MosaicPanel>

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
  h1 {
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }

  .mosiacpanel {
    background: #fefefe;
    border: 1px solid #636363;
    margin: 3px;
    border-radius: 4px;
    position: absolute;
    text-align: center;
  }

  .mosaic {
    position: relative;
    display: block;
    width: calc(100% - 8px);
    height: calc(100% - 56px - 40px);
    padding: 4px;
    background: #636363;
    display: flex;
    overflow: hidden;
  }
</style>
