<script lang="ts">
  import clamp from "lodash/clamp";
  import throttle from "lodash/throttle";

  import { onMount } from "svelte";
  import { MosaicRender } from "./lib/MosaicRoot";
  import type { MosaicDirection, MarkUps } from "./lib/type/commonType";
  import { BoundingBox } from "./lib/util/BoundingBox";
  import { boundingBoxToInset } from "./lib/util/dataUtils";

  export let markUps: MarkUps;
  // export let direction: MosaicDirection;
  // export let boundbox: BoundingBox;
  // export let splitPercentage: Number;
  // export let path: string[];

  const TOUCH_EVENT_OPTIONS = {
    capture: true,
    passive: false,
  };

  const RESIZE_THROTTLE_MS = 1000 / 30; // 30 fps
  let minimumPaneSizePercentage = 20;
  let listenersBound = false;
  let splitRef;

  onMount(() => {
    // console.log("rootElement", this.rootElement, this.rootElement.current);
    // splitRef.current!.addEventListener(
    const parent = document.getElementById("mosaic");

    const rootElement = document;
    rootElement!.addEventListener(
      "touchstart",
      onMouseDown,
      TOUCH_EVENT_OPTIONS
    );
    return () => {
      unbindListeners();
      // if (rootElement.current) {
      //   rootElement.current.ownerDocument!.removeEventListener(
      if (rootElement) {
        rootElement.removeEventListener(
          "touchstart",
          onMouseDown,
          TOUCH_EVENT_OPTIONS
        );
      }
    };
  });

  const onMouseDown = (event: MouseEvent | TouchEvent) => {
    if (!isTouchEvent(event)) {
      if (event.button !== 0) {
        return;
      }
    }

    event.preventDefault();
    bindListeners();
  };

  function bindListeners() {
    if (!listenersBound) {
      const rootElement = document;
      // rootElement.current!.ownerDocument!.addEventListener(
      rootElement!.addEventListener("mousemove", onMouseMove, true);
      // rootElement.current!.ownerDocument!.addEventListener(
      rootElement!.addEventListener(
        "touchmove",
        onMouseMove,
        TOUCH_EVENT_OPTIONS
      );
      // rootElement.current!.ownerDocument!.addEventListener(
      rootElement!.addEventListener("mouseup", onMouseUp, true);
      // rootElement.current!.ownerDocument!.addEventListener(
      rootElement!.addEventListener("touchend", onMouseUp, true);
      listenersBound = true;
    }
  }

  function unbindListeners() {
    // if (rootElement.current) {
    const rootElement = document;
    if (rootElement) {
      // rootElement.current.ownerDocument!.removeEventListener(
      rootElement.removeEventListener("mousemove", onMouseMove, true);
      // rootElement.current.ownerDocument!.removeEventListener(
      rootElement!.removeEventListener(
        "touchmove",
        onMouseMove,
        TOUCH_EVENT_OPTIONS
      );
      // rootElement.current.ownerDocument!.removeEventListener(
      rootElement!.removeEventListener("mouseup", onMouseUp, true);
      // rootElement.current.ownerDocument!.removeEventListener(
      rootElement!.removeEventListener("touchend", onMouseUp, true);
      listenersBound = false;
    }
  }

  function computeStyle() {
    // const { boundingBox, direction, splitPercentage } = this.props;
    const positionStyle = markUps.direction === "column" ? "top" : "left";
    const absolutePercentage = BoundingBox.getAbsoluteSplitPercentage(
      markUps.boundingBox,
      markUps.splitPercentage,
      markUps.direction
    );

    return boundingBoxToInset(markUps.boundingBox);
    // return {
    //   ...BoundingBox.asStyles(markUps.boundingBox),
    //   [positionStyle]: `${absolutePercentage}%`,
    // };
  }

  const onMouseUp = (event: MouseEvent | TouchEvent) => {
    unbindListeners();

    const percentage = calculateRelativePercentage(event);
    // this.props.onRelease!(percentage);
    // MosaicRender.onResize(markUps.path, percentage);
    console.log("onMouseUp", markUps, percentage);
  };

  const onMouseMove = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();

    throttledUpdatePercentage(event);
  };

  const throttledUpdatePercentage = throttle(
    (event: MouseEvent | TouchEvent) => {
      const percentage = calculateRelativePercentage(event);

      if (percentage !== markUps.splitPercentage) {
        MosaicRender.onResize(markUps.path, percentage);
        // this.props.onChange!(percentage);
        console.log("onMouseMove", markUps, percentage);
      }
    },
    RESIZE_THROTTLE_MS
  );

  function calculateRelativePercentage(event: MouseEvent | TouchEvent): number {
    // const { minimumPaneSizePercentage, direction, boundingBox } = this.props;
    // const parentBBox = rootElement.current!.parentElement!.getBoundingClientRect();
    const parentBBox = document
      .getElementById("mosaic")
      .getBoundingClientRect();
    const location = isTouchEvent(event) ? event.changedTouches[0] : event;

    let absolutePercentage: number;
    if (markUps.direction === "column") {
      absolutePercentage =
        ((location.clientY - parentBBox.top) / parentBBox.height) * 100.0;
    } else {
      absolutePercentage =
        ((location.clientX - parentBBox.left) / parentBBox.width) * 100.0;
    }

    const relativePercentage = BoundingBox.getRelativeSplitPercentage(
      markUps.boundingBox,
      absolutePercentage,
      markUps.direction
    );

    return clamp(
      relativePercentage,
      minimumPaneSizePercentage!,
      100 - minimumPaneSizePercentage!
    );
  }

  function isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
    return (event as TouchEvent).changedTouches != null;
  }

  // onMount(() => {
  //   // 모바일 기기에서의 Touch 이벤트
  //   const isTouchScreen =
  //     typeof window !== "undefined" &&
  //     window.matchMedia("(hover: none) and (pointer: coarse)").matches;

  //   const startEventName = isTouchScreen ? "touchstart" : "mousedown";
  //   const moveEventName = isTouchScreen ? "touchmove" : "mousemove";
  //   const endEventName = isTouchScreen ? "touchend" : "mouseup";

  //   function resize(e) {
  //     const parent = document.getElementById("mosaic").getBoundingClientRect();
  //     const Y = e.clientY || e.touches[0].clientY;
  //     const X = e.clientX || e.touches[0].clientX;

  //     let percent = 0;
  //     if (markUps.direction === "column") {
  //       percent = ((Y - parent.top) / parent.height) * 100.0;
  //     } else {
  //       percent = ((X - parent.left) / parent.width) * 100.0;
  //     }
  //     if (percent > 20 && percent < 80)
  //       MosaicRender.onResize(markUps.path, percent);
  //   }

  //   splitRef.addEventListener(
  //     startEventName,
  //     function (e) {
  //       document.addEventListener(moveEventName, resize, false);
  //     },
  //     false
  //   );
  //   document.addEventListener(
  //     endEventName,
  //     function () {
  //       document.removeEventListener(moveEventName, resize, false);
  //       splitRef.removeEventListener(moveEventName, resize, false);
  //     },
  //     false
  //   );
  // });
</script>

<div
  bind:this={splitRef}
  class="split {markUps.direction}"
  style="inset: {boundingBoxToInset(markUps.boundingBox)}"
  on:mousedown={onMouseDown}
>
  <div class="mosaic-split-line" />
</div>

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
