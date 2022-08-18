<script lang="ts">
  import Panel from "./Panel.svelte";
  let nodes: string[] = ["1", "2"];
</script>

<div class="mosaic">
  {#each nodes as _, index}
    <Panel />
    {#if index - 1 !== nodes.length}
      <div class="width-grap" />
    {/if}
  {/each}
</div>

<style>
  .mosaic {
    display: block;
    width: calc(100%-4px);
    height: calc(100%-4px);
    padding: 4px;
    background: #636363;
    display: flex;
    flex-direction: row;
  }
  .width-grap {
    cursor: ew-resize;
    width: 4px;
  }
</style>
