<script lang="ts">
  import { Splitpanes } from "svelte-splitpanes";
  import Panel from "./lib/Panel.svelte";
  import type { mosaic } from "./type/common";

  const addPanel = (nodes: Array<any>, index?) => {
    console.log(nodes, index);
    if (index >= 0 && typeof nodes[index] === "string") {
      nodes[index] = {
        horizontal: false,
        nodes: [nodes[index], "create"],
      };
    } else if (typeof nodes[index] === "object") {
      nodes[index].nodes.push("new");
    } else {
      nodes.push("c");
    }
    console.log(nodes, mosaicData);
    mosaicData = mosaicData;
  };

  const deletePanel = (nodes, index) => {
    nodes.splice(index, 1);
    mosaicData = mosaicData;
  };

  let mosaicData: mosaic = {
    horizontal: false,
    nodes: [
      "a",
      {
        horizontal: true,
        nodes: [
          "b",
          "c",
          {
            horizontal: false,
            nodes: ["d", "e", "f", { horizontal: true, nodes: ["g", "h"] }],
          },
        ],
      },
    ],
  };
</script>

<div>
  <button on:click={() => addPanel(mosaicData.nodes)}>+</button>
</div>
<Splitpanes class="default-theme" style="height: 100%">
  {#each mosaicData.nodes as node, index}
    <Panel
      {node}
      nodes={mosaicData.nodes}
      {index}
      {deletePanel}
      addPanel={() => addPanel(mosaicData.nodes, index)}
    />
  {/each}
</Splitpanes>
