<script lang="ts">
  import Panel from "./Panel.svelte";
  import type { MosaicNode, MosaicBranch } from "./type/commonType";
  import { BoundingBox } from "./util/BoundingBox";
  export let mosaicData: MosaicNode<number>;

  let boundingBox: BoundingBox = BoundingBox.empty();
  let path: MosaicBranch[] = [];
</script>

<div class="mosaic" style="flex-direction:{mosaicData}">
  <Panel node={mosaicData} {boundingBox} {path} />
  <!-- direction={mosaicData.direction} /> -->
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
