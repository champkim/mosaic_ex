<script lang="ts">
  import type { direction, insetrect } from './type/commonType'
  export let direction: direction
  export let insetrec: insetrect

  let insetStr: string = '0% 0% 0% 0%'
  insetStr = `${insetrec.top}% ${insetrec.right}% ${insetrec.bottom}% ${insetrec.left}% `
  console.log('[Split] ' + insetStr + '[direction] ' + direction)
</script>

<div
  class="split {direction}"
  style="inset: {`${insetrec.top}% ${insetrec.right}% ${insetrec.bottom}% ${insetrec.left}% `}"
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
