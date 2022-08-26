<script lang="ts">
  import Mosaic from "./lib/Mosaic.svelte";
  import TopBar from "./lib/TopBar.svelte";
  import type { mosaic } from "./lib/type/commonType";

  const mosaicData: mosaic = {
    direction: "column",
    first: "a",
    second: {
      direction: "row",
      first: {
        direction: "column",
        first: "b",
        second: "c",
      },
      second: "d",
    },
  };
</script>

<div class="mosaic-ex">
  <TopBar />
  <Mosaic {mosaicData} />
</div>

<style>
</style>
