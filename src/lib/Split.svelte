<script lang="ts">
  import { onMount } from "svelte";
  import type { MosaicDirection } from "./type/commonType";
  import type { BoundingBox } from "./util/BoundingBox";

  export let direction: MosaicDirection;
  export let boundbox: BoundingBox;
  export let onResize: Function;
  let splitRef;

  let insetStr: string = "0% 0% 0% 0%";
  insetStr = `${boundbox.top}% ${boundbox.right}% ${boundbox.bottom}% ${boundbox.left}% `;
  
  onMount(() => {
    function resize(e) {
      const parent = splitRef.parentElement.getBoundingClientRect();
      if (direction === "column") {
        const percent = ((e.clientY - parent.top) / parent.height) * 100.0;
        console.log(percent);
        // setInsetRec({ ...insetrec, left: percent });
        onResize(percent)
      } else {
        const percent = ((e.clientX - parent.left) / parent.width) * 100.0;
        console.log(percent);
        onResize(percent)
        // setInsetRec({ ...insetrec, top: percent });
      }
    }

    splitRef.addEventListener(
      "mousedown",
      function (e) {
        document.addEventListener("mousemove", resize, false);
      },
      false
    );
    document.addEventListener(
      "mouseup",
      function () {
        document.removeEventListener("mousemove", resize, false);
      },
      false
    );
  });
</script>

<div bind:this={splitRef} class="split {direction}" style="inset: {insetStr}" />

<style>
  .split {
    z-index: 1;
    position: absolute;
  }
  .split.row {
    cursor: ew-resize;
    width: 6px !important;
    margin-left: -3px;
  }
  .split.column {
    cursor: ns-resize;
    height: 6px !important;
    margin-top: -3px;
  }

  .split:hover {
    background: rgba(125, 188, 255, 0.6);
  }
</style>
