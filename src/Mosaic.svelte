<script lang="ts">
  import defer from "lodash/defer";
  import isEqual from "lodash/isEqual";
  import dropRight from "lodash/dropRight";
  import MosaicPanel from "./MosaicPanel.svelte";
  import { MosaicRender, MosaicRoot } from "./lib/MosaicRoot";
  import { MosaicActions } from "./lib/Mosaic";
  import type { CreateNode } from "./lib/type/commonType";
  import type { MosaicDropTargetPosition } from "./lib/type/dropTypes";

  import { createDragToUpdates } from "./lib/util/mosaicUpdates";
  import { getAndAssertNodeAtPathExists } from "./lib/util/mosaicUtilities";
  import { detach_after_dev } from "svelte/internal";
  let offsetWidth: number[] = [];
  let offsetHeight: number[] = [];

  //let a: Function;

  let dragItemPath = [];
  //export d:(e:mouse\) => void

  const initClassName = (e) => {
    e.target.className = e.target.className.replace(
      /\sleft|\sright|\stop|\sbottom/g,
      ""
    );
  };

  const onDragOver = (e) => {
    e.preventDefault();
    if (e.target.className.indexOf("mosaicpanel") >= 0) {
      // 지금 drag중인 id 넣어야함
      // const path = e.dataTransfer.getData("moveId");
      // MosaicActions.actions.remove(path);

      const xPercent = (e.offsetX / e.target.offsetWidth) * 100;
      const yPercent = (e.offsetY / e.target.offsetHeight) * 100;

      initClassName(e);

      if (xPercent < 30) {
        e.target.className += " left";
      } else if (xPercent > 60) {
        e.target.className += " right";
      } else if (yPercent < 50) {
        e.target.className += " top";
      } else {
        e.target.className += " bottom";
      }
    }
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    initClassName(e);
  };

  const onDragStart = (e, markup) => {
    console.log(e);
    const hideTimer = defer(() => MosaicActions.actions.hide(markup.path));
    console.log("createhideTimer: ", hideTimer);
    // MosaicActions.actions.remove(markup.path);
    e.dataTransfer.setData("markup", JSON.stringify(markup));
    e.dataTransfer.setData("hideTimer", hideTimer);
    //MosaicActions.actions.remove(e.markup.path);
  };

  // const onDrop = async (e) => {
  const onDrop = (e, markup) => {
    e.preventDefault();
    console.log(e.target.id);

    const hideTimer = e.dataTransfer.getData("hideTimer");
    console.log("hideTimer", hideTimer);
    window.clearTimeout(hideTimer);

    let direction = "";
    let isFirst = false;
    let position: MosaicDropTargetPosition;

    console.log(">>>>> " + e.target.className);

    if (e.target.className.indexOf("left") >= 0) {
      direction = "row";

      position = "right";
    } else if (e.target.className.indexOf("right") >= 0) {
      isFirst = true;
      direction = "row";
      position = "left";
    } else if (e.target.className.indexOf("bottom") >= 0) {
      direction = "column";

      position = "top";
    } else if (e.target.className.indexOf("top") >= 0) {
      isFirst = true;
      direction = "column";

      position = "bottom";
    }
    initClassName(e);

    const destMarkup = JSON.parse(e.dataTransfer.getData("markup"));
    const destinationPath = destMarkup.path;
    const ownPath = markup.path;

    console.log(
      "position: " +
        position +
        " destinationPath: " +
        destinationPath +
        ", ownPath:  " +
        ownPath
    );

    if (
      position != null &&
      destinationPath != null &&
      !isEqual(destinationPath, ownPath)
    ) {
      MosaicActions.actions.updateTree(
        createDragToUpdates(
          //MosaicActions.actions.getRoot(),
          MosaicRoot.getCurrentNode(),
          ownPath,
          destinationPath,
          position
        )
      );
      // if (props.onDragEnd) {
      //   props.onDragEnd('drop');
      // }
    } else {
      MosaicActions.actions.updateTree([
        {
          path: dropRight(ownPath),
          spec: {
            splitPercentage: {
              $set: null,
            },
          },
        },
      ]);
      // if (props.onDragEnd) {
      //   props.onDragEnd('reset');
      // }
    }

    // console.log(markup);
    // const path = JSON.parse(e.target.id);
    // await move(path, direction, isFirst, markup);
    //MosaicActions.actions.remove(markup.path);
  };

  const move = (path, direction, isFirst, markup) => {
    const root = MosaicRoot.getCurrentNode();

    let createNode: CreateNode<number>;
    createNode = MosaicRoot.createNode;

    return Promise.resolve(createNode!()).then((node) =>
      MosaicActions.actions.replaceWith(path, {
        direction,
        second: isFirst
          ? +markup.name
          : getAndAssertNodeAtPathExists(root, path),
        first: isFirst
          ? getAndAssertNodeAtPathExists(root, path)
          : +markup.name,
      })
    );
  };
</script>

<div
  id="mosaic"
  class="mosaic"
  style="flex-direction:row"
  on:dragover={onDragOver}
>
  <!-- on:drop={(e) => onDrop(e, markup)} -->
  <!-- on:drop={onDrop} -->
  {#each $MosaicRender as markup, index}
    <div
      id={JSON.stringify(markup.path)}
      class="mosaicpanel"
      style="inset:{markup.style}"
      bind:offsetWidth={offsetWidth[index]}
      bind:offsetHeight={offsetHeight[index]}
      draggable="true"
      on:dragstart={(e) => onDragStart(e, markup)}
      on:dragleave={onDragLeave}
      on:drop={(e) => onDrop(e, markup)}
    >
      <!-- draggable="true" -->
      <!-- 
        draggable="true"
        on:dragstart={(e) => onDragStart(e, markup)}
      on:dragleave={onDragLeave}
      on:drop={(e) => onDrop(e, markup)} -->

      <!-- <MosaicPanel name={markup.name} /> -->
      <!-- ref={(element) => (this.rootElement = element)} -->
      <MosaicPanel
        renderToolbar={markup.name != "2"}
        path={markup.path}
        direction={offsetWidth[index] > offsetHeight[index] ? "row" : "column"}
      >
        <!-- panelDirection={offsetWidth > offsetHeight ? "row" : "column"} -->
        <!-- direction={this.element.offsetWidth > this.element.offsetHeight? "row": "column"} -->
        <!-- rootElement={this.rootElement} -->

        <span slot="title">
          Window {markup.name}
        </span>
        <!-- {(markup.direction = offsetWidth[index] > offsetHeight[index] ? "row" : "column")} -->
        <h1 slot="contents">Window {markup.name}</h1>
        <!-- {offsetWidth[index]} x {offsetHeight[index]} -->
        <!-- {markup.direction} -->

        <!-- direction={this.element.offsetWidth > this.element.offsetHeight? "row": "column"} -->
      </MosaicPanel>

      <!-- <div class="contents">Window {name || 1}</div> -->
      <!-- <div class="contents">Window {markup.name || 1}</div> -->
    </div>
  {/each}
</div>

<!-- <div class="mosaic" style="flex-direction:{mosaicData}">
  <Panel node={mosaicData} />  
</div> 
-->
<style global>
  h1 {
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }

  .mosaicpanel {
    background: #fefefe;
    border: 1px solid #636363;
    margin: 3px;
    border-radius: 4px;
    position: absolute;
    text-align: center;
  }

  .mosaic {
    position: relative;
    display: block;
    width: calc(100% - 8px);
    height: calc(100% - 56px - 40px);
    padding: 4px;
    background: #636363;
    display: flex;
    overflow: hidden;
  }

  .left {
    background: linear-gradient(
      to left,
      #fefefe 50%,
      rgba(163, 195, 233, 0.5) 50%
    );
  }
  .right {
    background: linear-gradient(
      to right,
      #fefefe 50%,
      rgba(163, 195, 233, 0.5) 50%
    );
  }
  .top {
    background: linear-gradient(
      to top,
      #fefefe 50%,
      rgba(163, 195, 233, 0.5) 50%
    );
  }
  .bottom {
    background: linear-gradient(
      to bottom,
      #fefefe 50%,
      rgba(163, 195, 233, 0.5) 50%
    );
  }
</style>
