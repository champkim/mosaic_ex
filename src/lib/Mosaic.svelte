<script lang="ts">
  import Panel from "./Panel.svelte";
</script>

<div id="mosaic" class="mosaic" style="flex-direction:row">
  <Panel />
</div>

<!-- <div class="mosaic" style="flex-direction:{mosaicData}">
  <Panel node={mosaicData} />  
</div> 
-->
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
