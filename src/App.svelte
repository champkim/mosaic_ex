<script lang="ts">
  import Footer from "./Footer.svelte";
  import Mosaic from "./Mosaic.svelte";
  import TopBar from "./TopBar.svelte";
  //   import type { MosaicNode } from "./lib/type/commonType";

  //   const initNode2: MosaicNode<number> = {
  //     direction: "row",
  //     first: 1,
  //     second: {
  //       direction: "column",
  //       first: 2,
  //       second: {
  //         direction: "row",
  //         first: 3,
  //         second: 4,
  //       },
  //     },
  //     splitPercentage: 40,
  //   };
  //
</script>

<div class="mosaic-ex">
  <TopBar />
  <Mosaic initNode={undefined} />
  <Footer />
</div>

<style>
</style>
