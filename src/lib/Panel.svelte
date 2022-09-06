<script lang="ts">
  import flatten from "lodash/flatten";
  import PanelTopBar from "./PanelTopBar.svelte";
  import Split from "./Split.svelte";
  import { BoundingBox } from "./util/BoundingBox";
  import { isParent } from "./util/MosicUtils";
  import type {
    MosaicKey,
    MosaicNode,
    ResizeOptions,
    MosaicParent,
    MosaicBranch,
  } from "./type/commonType";

  //export let root: MosaicNode<number>;

  export let node: MosaicNode<number>;
  export let boundingBox: BoundingBox = BoundingBox.empty();
  export let path: MosaicBranch[];

  interface MarkUps {
    style: string;
    name: string;
  }

  let panelMarkups: Array<MarkUps> = [];
  //panelMarkups = new Array<MarkUps>();

  function nonNullElement(
    x: MarkUps | Array<MarkUps> | null
  ): x is MarkUps | Array<MarkUps> {
    return x !== null;
  }

  // render() {
  //   const { root } = this.props;
  //   //console.log(<div className="mosaic-root">{this.renderRecursively(root, BoundingBox.empty(), [])}</div>);
  //   return <div className="mosaic-root">{this.renderRecursively(root, BoundingBox.empty(), [])}</div>;
  // }

  function renderRecursively(
    node: MosaicNode<number>,
    boundingBox: BoundingBox,
    path: MosaicBranch[]
  ) {
    //): MarkUps | Array<MarkUps> {
    if (isParent(node)) {
      const splitPercentage =
        node.splitPercentage == null ? 50 : node.splitPercentage;
      const { first, second } = BoundingBox.split(
        boundingBox,
        splitPercentage,
        node.direction
      );
      return flatten(
        [
          //path.concat("first")
          //path = [path, "first"];

          renderRecursively(node.first, first, path.concat("first")),
          //renderSplit(node.direction, boundingBox, splitPercentage, path),
          renderRecursively(node.second, second, path.concat("second")),
        ].filter(nonNullElement)
      );
    } else {
      //let insetStr: string = `${node},  ${path}, ${boundingBox.top}% ${boundingBox.right}% ${boundingBox.bottom}% ${boundingBox.left}% `;
      //console.log(insetStr);
      //console.log((...BoundingBox.asStyles(boundingBox)));

      //insetStr = `${insetrec.top}% ${insetrec.right}% ${insetrec.bottom}% ${insetrec.left}% `;

      // let panelsMarkUp2 = `< class="panel" style="inset:${boundingBox.top}% ${boundingBox.right}% ${boundingBox.bottom}% ${boundingBox.left}%">`;
      // panelsMarkUp += `<PanelTopBar/> <div class="contents">Window ${node}</div>`;
      // console.log(panelsMarkUp);

      let markups: MarkUps = { style: "", name: "" };

      markups.style = `${boundingBox.top}% ${boundingBox.right}% ${boundingBox.bottom}% ${boundingBox.left}%`;
      markups.name = `${node}`;

      panelMarkups.push(markups);

      // let panelsMarkUp = `{style: ${boundingBox.top}% ${boundingBox.right}% ${boundingBox.bottom}% ${boundingBox.left}%,`;
      // panelsMarkUp += `node:${node}}`;
      // console.log(panelsMarkUp);

      //return markups;
      // return (
      //   <div key={node} className="mosaic-tile" style={{ ...BoundingBox.asStyles(boundingBox) }}>
      //     {this.props.renderTile(node, path)}
      //   </div>
      // );
    }
  }

  renderRecursively(node, boundingBox, path);

  console.log("ggggggggggggggggggggggg");
  console.log(panelMarkups);

  // let bParent: boolean = isParent(node);
  // node = node as MosaicParent<number>;

  // if (bParent) {
  //   //path.concat("first");
  //   //path.concat("second");
  // }

  // // let first: Split;
  // // let second: Split;

  // const splitPercentage =
  //   node.splitPercentage == null ? 50 : node.splitPercentage;

  // const { first, second } = BoundingBox.split(
  //   boundingBox,
  //   splitPercentage,
  //   node.direction
  // );

  // // return flatten(
  // //   [

  ///////////////////////////////////////////////////////////
  // this.renderRecursively(node.first, first, path.concat("first"));
  // this.renderSplit(node.direction, boundingBox, splitPercentage, path);
  // this.renderRecursively(node.second, second, path.concat("second"));
  ///////////////////////////////////////////////////////////

  //   ].filter(nonNullElement)
  // );

  //}

  // else {
  //setBoundBox = BoundingBox.asStyles(boundingBox);
  // return (
  //   <div
  //     key={node}
  //     className="mosaic-tile"
  //     style={{ ...BoundingBox.asStyles(boundingBox) }}
  //   >
  //     {this.props.renderTile(node, path)}
  //   </div>
  // );
  // }

  //export let insetrec: insetrect = { top: 0, left: 0, bottom: 0, right: 0 };
  //export let direction: direction

  // const BASIC_PERCENT = 50;

  // let insetStr: string = "0% 0% 0% 0%";
  // insetStr = `${insetrec.top}% ${insetrec.right}% ${insetrec.bottom}% ${insetrec.left}% `;

  // console.log(
  //   node +
  //     " [first] " +
  //     typeof node.first +
  //     " [second] " +
  //     typeof node.second +
  //     " [direction] " +
  //     node.direction +
  //     " [inset arg] " +
  //     insetStr
  // );

  // let insetrec1: insetrect = { top: 0, left: 0, bottom: 0, right: 0 };
  // let insetrec2: insetrect = { top: 0, left: 0, bottom: 0, right: 0 };

  // if (typeof node === "object") {
  //   insetrec1 = { ...insetrec };
  //   insetrec2 = { ...insetrec };
  //   if (node.direction === "row") {
  //     //if (typeof node.first === 'string') {
  //     console.log("row");
  //     insetrec1.right = Math.floor((100 - insetrec.right) / 2);
  //     insetrec2.left = 100 - insetrec1.right;
  //     //}
  //   } else {
  //     console.log("col");
  //     insetrec1.bottom = Math.floor((100 - insetrec1.bottom) / 2);
  //     insetrec2.top = 100 - insetrec1.bottom;
  //   }
  // }
</script>

<!-- {@html slements}

{#each slements as {mark} (id)}

<div>{name}</div>
{/each} -->

<!-- {#each slements as item}
  {@html item}
{/each} -->

{#each panelMarkups as markup}
  <div class="panel" style="inset:{markup.style}">
    <PanelTopBar />
    <div class="contents">Window {markup.name}</div>
  </div>
{/each}

<!-- <div
    class="panel"
    style="inset:{`${boundingBox.top}% ${boundingBox.right}% ${boundingBox.bottom}% ${boundingBox.left}% `}"
  >
  <PanelTopBar />
  <div class="contents">Window {node}</div>
</div> -->

<!-- style="inset:{`${insetrec.top}% ${insetrec.right}% ${insetrec.bottom}% ${insetrec.left}% `}" -->

<!-- {#if isParent(node)}
  <svelte:self node={node.first} boundingBox={first} {path} />
  <!-- {#if node.second}
    <Split direction={node.direction} insetrec={insetrec2} />
  {/if} 
  <svelte:self node={node.second} boundingBox={second} {path} />
{:else if typeof node === "number"}
  <div
    class="panel"
    style="inset:{`${boundingBox.top}% ${boundingBox.right}% ${boundingBox.bottom}% ${boundingBox.left}% `}"
  >
    <PanelTopBar />
    <div class="contents">Window {node}</div>
  </div>
{/if} -->

<!-- {#if typeof node === "number"}
  <div
    class="panel"
    style="inset:{`${boundingBox.top}% ${boundingBox.right}% ${boundingBox.bottom}% ${boundingBox.left}% `}"
  >
    <PanelTopBar />
    <div class="contents">Window {node}</div>
  </div>
{:else if typeof node === "object"}
  <svelte:self
    node={node.first}
    boundingBox={first}
    path={path.concat("first")}
  />
  {#if node.second}
    <Split direction={node.direction} insetrec={insetrec2} />
  {/if}
  <svelte:self
    node={node.second}
    boundingBox={second}
    path={path.concat("second")}
  />
{/if} -->
<style>
  .panel {
    background: #fefefe;
    border: 1px solid #636363;
    margin: 3px;
    border-radius: 4px;
    position: absolute;
  }
</style>
