<script lang="ts">
  import type { MosaicDirection } from "./type/commonType";
  import type { BoundingBox } from "./util/BoundingBox";

  export let direction: MosaicDirection;
  export let boundbox: BoundingBox;

  let insetStr: string = "0% 0% 0% 0%";
  insetStr = `${boundbox.top}% ${boundbox.right}% ${boundbox.bottom}% ${boundbox.left}% `;
  console.log("[Split] " + insetStr + "[direction] " + direction);
</script>

<div
  class="split {direction}"
  style="inset: {`${boundbox.top}% ${boundbox.right}% ${boundbox.bottom}% ${boundbox.left}% `}"
/>

<style>
  .split {
    cursor: ew-resize;
    z-index: 1;
    position: absolute;
  }
  .split.row {
    width: 6px !important;
    height: 100%;
  }
  .split.column {
    height: 6px !important;
    width: 100%;
  }

  .split:hover {
    background: blue;
  }
</style>
