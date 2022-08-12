<script lang="ts">
  import type { mosaic } from "src/type/common";
  import { Splitpanes, Pane } from "svelte-splitpanes";
  export let node: mosaic | string = {};
  export let addPanel: Function;
  export let deletePanel: Function;
</script>

{#if typeof node === "string"}
  <Pane>
    <div on:drag={() => console.log("d")}>
      <button on:click={addPanel}>+</button>
      <button on:click={() => deletePanel(index)}>-</button>
    </div>
    <div>{node}</div>
  </Pane>
{:else if typeof node === "object"}
  <Pane>
    <Splitpanes horizontal={node.horizontal}>
      {#each node.nodes as newNode, index}
        <svelte:self
          nodes={node.nodes}
          {index}
          node={newNode}
          addPanel={() => addPanel(node.nodes, index)}
        />
      {/each}
    </Splitpanes>
  </Pane>
{:else}{/if}
