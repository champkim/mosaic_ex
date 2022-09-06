<script lang="ts">
  import Mosaic from "./lib/Mosaic.svelte";
  import TopBar from "./lib/TopBar.svelte";
  import type { MosaicParent } from "./lib/type/commonType";

  let currentNode: MosaicParent<number> = {
    direction: "row",
    first: 1,
    //second: 'b'
    second: {
      direction: "column",
      first: 2,
      second: 3,
    },
  };

  //console.log(currentNode);
</script>

<div class="mosaic-ex">
  <TopBar bind:currentNode />
  <Mosaic bind:mosaicData={currentNode} />
</div>

<style>
</style>
