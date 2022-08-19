<script lang="ts">
  import Panel from "./Panel.svelte";
  let nodes: string[] = ["1", "2"];

  // const BORDER_SIZE = 4;
  // const panel = document.getElementById("right_panel");

  // let m_pos;
  // function resize(e) {
  //   const dx = m_pos - e.x;
  //   m_pos = e.x;
  //   panel.style.width = parseInt(getComputedStyle(panel, "").width) + dx + "px";
  // }

  // panel.addEventListener(
  //   "mousedown",
  //   function (e) {
  //     if (e.offsetX < BORDER_SIZE) {
  //       m_pos = e.x;
  //       document.addEventListener("mousemove", resize, false);
  //     }
  //   },
  //   false
  // );

  // document.addEventListener(
  //   "mouseup",
  //   function () {
  //     document.removeEventListener("mousemove", resize, false);
  //   },
  //   false
  // );
</script>

<div class="mosaic">
  {#each nodes as node, index}
    <Panel {node} />
    {#if index - 1 !== nodes.length}
      <div class="width-grap" />
    {/if}
  {/each}
</div>

<style>
  .mosaic {
    display: block;
    width: calc(100% - 8px);
    height: calc(100% - 56px);
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
