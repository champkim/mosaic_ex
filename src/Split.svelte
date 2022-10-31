<script lang="ts">
  import { onMount } from "svelte";
  import { MosaicRender } from "./lib/MosaicRoot";
  import type { MosaicDirection } from "./lib/type/commonType";
  import type { BoundingBox } from "./lib/util/BoundingBox";

  export let direction: MosaicDirection;
  export let boundbox: BoundingBox;
  export let path: string[];

  const TOUCH_EVENT_OPTIONS = {
    capture: true,
    passive: false,
  };

  let splitRef;

  let insetStr: string = "0% 0% 0% 0%";
  insetStr = `${boundbox.top}% ${boundbox.right}% ${boundbox.bottom}% ${boundbox.left}% `;

  onMount(() => {
    // 모바일 기기에서의 Touch 이벤트
    const isTouchScreen =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    const startEventName = isTouchScreen ? "touchstart" : "mousedown";
    const moveEventName = isTouchScreen ? "touchmove" : "mousemove";
    const endEventName = isTouchScreen ? "touchend" : "mouseup";

    function resize(e) {
      const parent = document.getElementById("mosaic").getBoundingClientRect();
      const Y = e.clientY || e.touches[0].clientY;
      const X = e.clientX || e.touches[0].clientX;

      let percent = 0;
      if (direction === "column") {
        percent = ((Y - parent.top) / parent.height) * 100.0;
      } else {
        percent = ((X - parent.left) / parent.width) * 100.0;
      }
      if (percent > 20 && percent < 80) MosaicRender.onResize(path, percent);
    }

    splitRef.addEventListener(
      startEventName,
      function (e) {
        document.addEventListener(moveEventName, resize, false);
      },
      false
    );
    document.addEventListener(
      endEventName,
      function () {
        document.removeEventListener(moveEventName, resize, false);
        splitRef.removeEventListener(moveEventName, resize, false);
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

  .split:hover,
  .split:active {
    background: rgba(125, 188, 255, 0.6);
  }
</style>
