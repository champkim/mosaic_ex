<script lang="ts">
  import type { direction } from "./type/commonType";
  export let direction: direction;
  export let inset: string;
</script>

<div class="split {direction}" style="inset: {inset}" />

<style>
  .split {
    cursor: ew-resize;
    width: 8px !important;
    z-index: 1;
    position: absolute;
  }
  .split.row {
    height: 100%;
  }
  .split.row {
    width: 100%;
  }

  .split:hover {
    background: blue;
  }
</style>
