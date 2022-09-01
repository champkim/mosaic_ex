<script lang="ts">
  import PanelTopBar from "./PanelTopBar.svelte";
  import Split from "./Split.svelte";
  import type { direction, mosaic } from "./type/commonType";
  export let node: mosaic;
  export let inset: string = `0 0 0 0`;
  export let direction: direction;

  const BASIC_PERCENT = 50;

  let newInset = inset.split(" ");
  let newInset2 = inset.split(" ");
  const splitPercent = node.splitPercent ?? BASIC_PERCENT;

  newInset[direction === "row" ? 2 : 1] = `${splitPercent}%`;
  $: firstInset = newInset.join(" ");

  newInset2[direction === "row" ? 0 : 3] = `${100 - splitPercent}%`;
  $: secondInset = newInset2.join(" ");

  console.log(node, newInset, newInset.join(" "));

  // $: inset = direction === "row" ? "0 50% 0 0" : "0 0 50% 0";
</script>

{#if typeof node === "string"}
  <div class="panel" style="inset: {inset}">
    <PanelTopBar />
    <div class="contents">Window {node}</div>
    <input type="text" />
  </div>
{:else if typeof node === "object"}
  <svelte:self
    node={node.first}
    direction={node.direction}
    inset={firstInset}
  />
  {#if node.second}
    <Split direction={node.direction} inset={secondInset} />
  {/if}
  <svelte:self
    node={node.second}
    direction={node.direction}
    inset={secondInset}
  />
{/if}

<style>
  .panel {
    background: #fefefe;
    border: 1px solid #636363;
    margin: 3px;
    border-radius: 4px;
    position: absolute;
  }
</style>
