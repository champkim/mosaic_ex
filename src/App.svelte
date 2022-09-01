<script lang="ts">
  import Mosaic from './lib/Mosaic.svelte'
  import TopBar from './lib/TopBar.svelte'
  import type { mosaic } from './lib/type/commonType'

  const mosaicData: mosaic = {
    direction: 'row',
    first: 'a',
    //second: 'b'
    second: {
      direction: 'column',
      first: 'b',
      second: 'c'
    }
  }
</script>

<div class="mosaic-ex">
  <TopBar />
  <Mosaic {mosaicData} />
</div>

<style>
</style>
