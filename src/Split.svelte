<script lang="ts">
  import clamp from "lodash/clamp";
  import throttle from "lodash/throttle";

  import { onMount } from "svelte";
  import App from "./App.svelte";
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
    // const parent = document.getElementById("mosaic");
    splitRef!.addEventListener("touchstart", onMouseDown, TOUCH_EVENT_OPTIONS);

    console.log("onMount", splitRef);
    console.log("onMount", splitRef!.ownerDocument);

    // let elements = document.querySelectorAll("div");
    // for (let elem of elements) {
    //   elem!.addEventListener("touchstart", onMouseDown, TOUCH_EVENT_OPTIONS);
    // }

    return () => {
      unbindListeners();

      console.log("return onMount", splitRef);

      // let elements = document.querySelectorAll("div");
      // for (let elem of elements) {
      //   elem!.removeEventListener(
      //     "touchstart",
      //     onMouseDown,
      //     TOUCH_EVENT_OPTIONS
      //   );
      // }
      if (splitRef) {
        splitRef.ownerDocument!.removeEventListener(
          "touchstart",
          onMouseDown,
          TOUCH_EVENT_OPTIONS
        );
      }
    };
  });

  function bindListeners() {
    if (!listenersBound) {
      // const rootElement = document;
      // rootElement.current!.ownerDocument!.addEventListener(
      splitRef!.ownerDocument!.addEventListener("mousemove", onMouseMove, true);
      // console.log("1", splitRef);
      // rootElement.current!.ownerDocument!.addEventListener(
      splitRef!.ownerDocument!.addEventListener(
        "touchmove",
        onMouseMove,
        TOUCH_EVENT_OPTIONS
      );
      // console.log("2", splitRef);
      // rootElement.current!.ownerDocument!.addEventListener(
      splitRef!.ownerDocument!.addEventListener("mouseup", onMouseUp, true);
      // console.log("3", splitRef);
      // rootElement.current!.ownerDocument!.addEventListener(
      splitRef!.ownerDocument!.addEventListener("touchend", onMouseUp, true);
      // console.log("4", splitRef);
      listenersBound = true;
    }
  }

  function unbindListeners() {
    // if (rootElement.current) {
    // const rootElement = document;
    if (splitRef) {
      // rootElement.current.ownerDocument!.removeEventListener(
      splitRef.ownerDocument!.removeEventListener(
        "mousemove",
        onMouseMove,
        true
      );
      // rootElement.current.ownerDocument!.removeEventListener(
      splitRef.ownerDocument!.removeEventListener(
        "touchmove",
        onMouseMove,
        TOUCH_EVENT_OPTIONS
      );
      // rootElement.current.ownerDocument!.removeEventListener(
      splitRef.ownerDocument!.removeEventListener("mouseup", onMouseUp, true);
      // rootElement.current.ownerDocument!.removeEventListener(
      splitRef.ownerDocument!.removeEventListener("touchend", onMouseUp, true);
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

    // return boundingBoxToInset(markUps.boundingBox);
    // console.log(">>>> absolutePercentage", absolutePercentage, positionStyle);

    // console.log(
    //   "getAbsoluteSplitPercentage >>>>>>> ",
    //   absolutePercentage,
    //   "  BoundingBox: ",
    //   markUps.boundingBox,
    //   " splitPercentage: ",
    //   markUps.splitPercentage,
    //   " direction: ",
    //   markUps.direction
    // );

    const computeBoundingBox = {
      ...BoundingBox.asStyles(markUps.boundingBox),
      [positionStyle]: `${absolutePercentage}%`,
    };

    // console.log(
    //   ">>>> computeBoundingBox",
    //   computeBoundingBox,
    //   "markUps: ",
    //   markUps.boundingBox
    // );

    // return `inset: ${computeBoundingBox.top} ${computeBoundingBox.right} ${computeBoundingBox.bottom} ${computeBoundingBox.left};`;

    return `inset: ${markUps.boundingBox.top}% ${markUps.boundingBox.right}% ${markUps.boundingBox.bottom}% ${markUps.boundingBox.left}%`;

    // return {
    //   ...BoundingBox.asStyles(markUps.boundingBox),
    //   [positionStyle]: `${absolutePercentage}%`,
    // };
  }

  const onMouseDown = (event: MouseEvent | TouchEvent) => {
    if (!isTouchEvent(event)) {
      if (event.button !== 0) {
        return;
      }
    }

    event.preventDefault();
    bindListeners();
    // console.log(">>> onMouseDown-bind", event);
  };

  const onMouseUp = (event: MouseEvent | TouchEvent) => {
    unbindListeners();
    // console.log(">>> onMouseUp-unbind", event);

    const percentage = calculateRelativePercentage(event);

    // console.log("onMouseUp pc: ", percentage, " markUp: ", markUps);
    // this.props.onRelease!(percentage);
    // MosaicRender.onResize(markUps.path, percentage);
    // console.log("onMouseUp", markUps, percentage);
  };

  const onMouseMove = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // console.log("onMouseMove: event: ", event);
    // throttledUpdatePercentage(event);
    onResize(event);
  };

  function getRelativeSplitPercentage(
    boundingBox: BoundingBox,
    absoluteSplitPercentage: number,
    direction: MosaicDirection
  ): number {
    return absoluteSplitPercentage;
    const { top, right, bottom, left } = boundingBox;

    // console.log("bound: ", boundingBox);

    // if (direction === "column") {
    //   const height = 100 - right - left;
    //   console.log("column bound: ", boundingBox, " height: ", height);
    //   // return ((absoluteSplitPercentage - top) / height) * 100;
    //   return ((absoluteSplitPercentage - left) / height) * 100;
    // } else if (direction === "row") {
    //   const width = 100 - top - bottom;
    //   // return ((absoluteSplitPercentage - left) / width) * 100;
    //   console.log("rown bound: ", boundingBox, " width: ", width);
    //   return ((absoluteSplitPercentage - top) / width) * 100;
    // } else {
    //   return absoluteSplitPercentage;
    //   // return assertNever(direction);
    // }

    if (direction === "column") {
      const height = 100 - top - bottom;

      console.log(
        "column bound: ",
        boundingBox,
        " top ",
        top,
        " bottom ",
        bottom,
        " height: ",
        height
      );
      // return ((absoluteSplitPercentage - top) / height) * 100;
      return ((absoluteSplitPercentage - top) / height) * 100;
    } else if (direction === "row") {
      const width = 100 - right - left;
      // return ((absoluteSplitPercentage - left) / width) * 100;

      console.log(
        "rown bound: ",
        boundingBox,
        " right ",
        right,
        " left ",
        left,
        " width: ",
        width
      );

      return ((absoluteSplitPercentage - left) / width) * 100;
    } else {
      return absoluteSplitPercentage;
      // return assertNever(direction);
    }
  }

  const onResize = throttle((event: MouseEvent | TouchEvent) => {
    // const parent = document.getElementById("mosaic").getBoundingClientRect();
    const parentBBox = splitRef!.parentElement!.getBoundingClientRect();

    console.log(">>>>>>> CRect: ", parentBBox);

    const location = isTouchEvent(event) ? event.changedTouches[0] : event;

    console.log(
      ">>>>>>> locateion CX: ",
      location.clientX,
      "CY:",
      location.clientY
    );

    let absolutePercentage: number;
    if (markUps.direction === "column") {
      absolutePercentage =
        ((location.clientY - parentBBox.top) / parentBBox.height) * 100;
    } else {
      absolutePercentage =
        ((location.clientX - parentBBox.left) / parentBBox.width) * 100;
    }

    // const percentage = absolutePercentage;

    const relativePercentage = getRelativeSplitPercentage(
      markUps.boundingBox,
      absolutePercentage,
      markUps.direction
    );

    const percentage = clamp(
      relativePercentage,
      minimumPaneSizePercentage!,
      100 - minimumPaneSizePercentage!
    );

    // const percentage = clamp(
    //   absolutePercentage,
    //   minimumPaneSizePercentage!,
    //   100 - minimumPaneSizePercentage!
    // );

    // console.log(
    //   ">>>>>>>>>>>>> absolutePercentage: " + absolutePercentage,
    //   ">> relativePercentage: ",
    //   relativePercentage,
    //   ">> percentage: ",
    //   percentage
    // );

    if (percentage !== markUps.splitPercentage) {
      MosaicRender.onResize(markUps.path, percentage);
      // console.log(
      //   ">>>>>>>>>>>>> onMouseMove precentage" +
      //     percentage +
      //     "MarkUPs: " +
      //     markUps.splitPercentage
      // );
      // this.props.onChange!(percentage);
    }
  }, RESIZE_THROTTLE_MS);

  const throttledUpdatePercentage = throttle(
    (event: MouseEvent | TouchEvent) => {
      const percentage = calculateRelativePercentage(event);

      if (percentage !== markUps.splitPercentage) {
        MosaicRender.onResize(markUps.path, percentage);
        // console.log(
        //   ">>>>>>>>>>>>> onMouseMove precentage" +
        //     percentage +
        //     "MarkUPs: " +
        //     markUps.splitPercentage
        // );
        // this.props.onChange!(percentage);
      }
    },
    RESIZE_THROTTLE_MS
  );

  function calculateRelativePercentage(event: MouseEvent | TouchEvent): number {
    // const { minimumPaneSizePercentage, direction, boundingBox } = this.props;
    const parentBBox = splitRef!.parentElement!.getBoundingClientRect();
    // const parentBBox = document
    //   .getElementById("mosaic")
    //   .getBoundingClientRect();
    const location = isTouchEvent(event) ? event.changedTouches[0] : event;

    let absolutePercentage: number;
    if (markUps.direction === "column") {
      absolutePercentage =
        ((location.clientY - parentBBox.top) / parentBBox.height) * 100;
    } else {
      absolutePercentage =
        ((location.clientX - parentBBox.left) / parentBBox.width) * 100;
    }

    // console.log(">>>>>>>>>>>>> onMouseMove " + absolutePercentage);

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
  draggable="false"
  class="split {markUps.direction}"
  style={"inset: " + boundingBoxToInset(markUps.boundingBox)}
  on:mousedown={onMouseDown}
/>
<!-- <div class="mosaic-split-line"/> -->
<!-- style={computeStyle()} -->

<!-- style="inset: {boundingBoxToInset(markUps.boundingBox)}" -->
<style>
  .split {
    position: absolute;
    z-index: 1;
    touch-action: none;
  }

  .mosaic-split-line {
    position: absolute;
  }

  .split.row {
    cursor: ew-resize;
    width: 6px;
    margin-left: -3px;
  }

  .split.column {
    cursor: ns-resize;
    height: 6px !important;
    margin-top: -3px;
  }

  .split:active,
  .split:hover {
    background: rgba(125, 188, 255, 0.6);
  }

  /* .mosaic-split-line:hover {
    position: absolute;
    background: rgba(125, 188, 255, 0.6);
  } */

  /* .split.row.mosaic-split-line {
    top: 0;
    bottom: 0;
    left: 3px;
    right: 3px;
  } */

  /* .split:hover.mosaic-split-line {
    box-shadow: 0 0 0 1px #4c90f0;
  } */
</style>
