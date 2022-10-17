<script lang="ts">
  import noop from "lodash/noop";
  import { MosaicRoot } from "./lib/MosaicRoot";
  import { MosaicActions } from "./lib/Mosaic";

  import type {
    MosaicBranch,
    MosaicDirection,
    CreateNode,
  } from "./lib/type/commonType";

  import { getAndAssertNodeAtPathExists } from "./lib/util/mosaicUtilities";

  export let renderToolbar: boolean;
  export let path: MosaicBranch[];
  export let direction: MosaicDirection;

  let split = (...args: any[]) => {
    const root = MosaicRoot.getCurrentNode();

    let createNode: CreateNode<number>;
    createNode = MosaicRoot.createNode;

    return Promise.resolve(createNode!(...args)).then((second) =>
      MosaicActions.actions.replaceWith(path, {
        direction,
        second,
        first: getAndAssertNodeAtPathExists(root, path),
      })
    );
  };

  function splitWindowClick() {
    split()
      .then(() => {
        if (this.props.onClick) {
          this.props.onClick();
        }
      })
      .catch(noop);
  }

  let swap = (...args: any[]) => {
    let createNode: CreateNode<number>;
    createNode = MosaicRoot.createNode;
    //this.checkCreateNode();
    return Promise.resolve(createNode!(...args)).then((node) =>
      MosaicActions.actions.replaceWith(path, node)
    );
  };

  function replaceWindowClick() {
    swap()
      .then(() => {
        if (this.props.onClick) {
          this.props.onClick();
        }
      })
      .catch(noop); // Swallow rejections (i.e. on user cancel)
  }

  function expandWindowClick() {
    MosaicActions.actions.expand(path);
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  function closeWindowClick() {
    MosaicActions.actions.remove(path);

    if (this.props.onClick) {
      this.props.onClick();
    }
  }
</script>

<div class="panel-topbar">
  {#if renderToolbar}
    <div><slot name="title" /></div>
    <div class="button-wrap">
      <button
        class="button-replace"
        title="Replace Window"
        on:click={replaceWindowClick}
      />
      <button
        class="button-split"
        title="Split Window"
        on:click={splitWindowClick}
      />
      <button
        class="button-expand"
        title="Expand"
        on:click={expandWindowClick}
      />
      <button
        class="button-close"
        title="Close Window"
        on:click={closeWindowClick}
      />
    </div>
  {:else}
    <div class="custombar">Custom Toolbar</div>
  {/if}
</div>

<!-- <div class="contents">Window {name || 1}</div> -->
<div class="contents"><slot name="contents" /></div>

<style>
  .panel-topbar {
    display: flex;
    justify-content: space-between;
    background: rgb(194, 194, 194);
    padding: 4px 8px;
    max-height: 20px;
    align-items: center;
  }
  .panel-topbar .button-wrap {
    flex-direction: row;
    gap: 4px;
  }
  .panel-topbar .button-wrap button {
    cursor: pointer;
    background-color: rgb(194, 194, 194);
    opacity: 0.5;
    margin-right: 2px;
    margin-left: 2px;
    min-height: 20px;
    min-width: 20px;
  }
  .panel-topbar .button-wrap button:hover {
    background-color: rgb(110, 110, 110);
    opacity: 0.5;
  }
  .panel-topbar .custombar {
    margin: auto;
  }

  .button-replace {
    background-image: url("icons/exchange-20.svg");
    background-size: 100%;
  }

  .button-split {
    background-image: url("icons/add-column-right-20.svg");
  }

  .button-expand {
    background-image: url("icons/maximize-20.svg");
  }

  .button-close {
    background-image: url("icons/cross.svg");
  }
</style>
