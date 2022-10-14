<script lang="ts">
  import noop from "lodash/noop";
  import { Mosaic, MosaicPanels } from "./stores/MosaicPanels";
  import { MosaicActions } from "./Mosaic";

  //export let name;
  import type {
    MosaicBranch,
    MosaicDirection,
    MosaicNode,
    CreateNode,
  } from "./type/commonType";
  import { getAndAssertNodeAtPathExists } from "./util/mosaicUtilities";

  export let renderToolbar: boolean;
  export let path: MosaicBranch[];

  // split = (...args: any[]) => {
  //   this.checkCreateNode();
  //   const { createNode, path } = this.props;
  //   const { mosaicActions } = this.context;
  //   const root = mosaicActions.getRoot();
  //   //console.log('>>>>>>  ' + (root as MosaicNode<T>) + ', ' + path);

  //   const direction: MosaicDirection =
  //     this.rootElement!.offsetWidth > this.rootElement!.offsetHeight ? 'row' : 'column';

  //   return Promise.resolve(createNode!(...args)).then((second) =>
  //     mosaicActions.replaceWith(path, {
  //       direction,
  //       second,
  //       first: getAndAssertNodeAtPathExists(root, path),
  //     }),
  //   );
  // };

  let split = (...args: any[]) => {
    // split = (...args: any[]) => {
    // this.checkCreateNode();
    // const { createNode, path } = this.props;
    // const { mosaicActions } = this.context;
    // const root = mosaicActions.getRoot();
    //console.log('>>>>>>  ' + (root as MosaicNode<T>) + ', ' + path);
    const root = Mosaic.getCurrentNode();
    const direction: MosaicDirection = "row";
    let createNode: CreateNode<number>;
    createNode = Mosaic.createNode;
    //this.rootElement!.offsetWidth > this.rootElement!.offsetHeight ? 'row' : 'column';

    //alert(path);
    //mosaic.createNode()!(...args)
    return Promise.resolve(createNode!(...args)).then((second) =>
      MosaicActions.actions.replaceWith(path, {
        direction,
        second,
        first: getAndAssertNodeAtPathExists(root, path),
      })
    );
    //alert(path);
    //MosaicPanels.setCurrentNode(root);
  };

  function splitWindowClick() {
    alert("split Window 2");

    split()
      .then(() => {
        if (this.props.onClick) {
          this.props.onClick();
        }
      })
      .catch(noop);

    console.log(Mosaic.getCurrentNode());
  }

  function closeWindowClick() {
    alert("close Window");
  }
</script>

<div class="panel-topbar">
  {#if renderToolbar}
    <div>Topbar</div>
    <div class="button-wrap">
      <button on:click={splitWindowClick}>+</button>
      <button on:click={closeWindowClick}>-</button>
    </div>
  {:else}
    <div class="custombar">Custom Toolbar</div>
  {/if}
</div>

<!-- <div class="contents">Window {name || 1}</div> -->
<div class="contents"><slot /></div>

<style>
  .panel-topbar {
    display: flex;
    justify-content: space-between;
    background: rgb(194, 194, 194);
    padding: 4px 8px;
  }
  .panel-topbar .button-wrap {
    display: flex;
    gap: 4px;
  }
  .panel-topbar .button-wrap button {
    font-size: 20px;
    background: rgb(194, 194, 194);
  }
  .panel-topbar .button-wrap button:hover {
    background: rgb(110, 110, 110);
  }
  .panel-topbar .custombar {
    margin: auto;
  }
</style>
