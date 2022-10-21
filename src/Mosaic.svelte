<script lang="ts">
  import MosaicPanel from "./MosaicPanel.svelte";
  import { MosaicRender, MosaicRoot } from "./lib/MosaicRoot";
  import { MosaicActions } from "./lib/Mosaic";
  import type { CreateNode } from "./lib/type/commonType";
  import { getAndAssertNodeAtPathExists } from "./lib/util/mosaicUtilities";
  let offsetWidth: number[] = [];
  let offsetHeight: number[] = [];

  let dragItemPath = [];

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
    // MosaicActions.actions.remove(markup.path);
    e.dataTransfer.setData("markup", JSON.stringify(markup));
  };

  const onDrop = async(e) => {
    e.preventDefault();
    console.log(e.target.id);

    let direction = "";
    let isFirst = false;
    if (e.target.className.indexOf("left") >= 0) {
      direction = "row";
    } else if (e.target.className.indexOf("right") >= 0) {
      isFirst = true;
      direction = "row";
    } else if (e.target.className.indexOf("top") >= 0) {
      direction = "column";
    } else if (e.target.className.indexOf("bottom") >= 0) {
      isFirst = true;
      direction = "column";
    }
    initClassName(e);
    const markup = JSON.parse(e.dataTransfer.getData("markup"));
    console.log(markup);
    const path = JSON.parse(e.target.id);
    await move(path, direction, isFirst, markup);
    MosaicActions.actions.remove(markup.path);
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
        first: isFirst ? getAndAssertNodeAtPathExists(root, path) : +markup.name,
      })
    );
  };
</script>

<div
  id="mosaic"
  class="mosaic"
  style="flex-direction:row"
  on:dragover={onDragOver}
  on:drop={onDrop}
>
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
    >
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

        <span slot="title">Window {markup.name}</span>
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
