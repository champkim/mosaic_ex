<script lang="ts">
  import Mosaic from "./lib/Mosaic.svelte";
  import TopBar from "./lib/TopBar.svelte";
  //import { MosaicNodes } from "./lib/stores/nodestores";
  //import { get } from "svelte/store";

  // let currentNode: MosaicParent<number> = {
  //   direction: "row",
  //   first: 1,
  //   //second: 'b'
  //   second: {
  //     direction: "column",
  //     first: 2,
  //     second: 3,
  //   },
  // };

  // console.log(currentNode);
  //console.log(get(MosaicNodes));
  //let currentNode: MosaicNode<number> = get(MosaicNodes);

  //<Mosaic mosaicData={currentNode} />
</script>

<div class="mosaic-ex">
  <TopBar />
  <Mosaic />
</div>

<style>
</style>
