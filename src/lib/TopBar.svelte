<script lang="ts">
  import dropRight from "lodash/dropRight";
  import type {
    MosaicNode,
    MosaicParent,
    MosaicDirection,
  } from "./type/commonType";
  import {
    Corner,
    getPathToCorner,
    getNodeAtPath,
    getOtherDirection,
    updateTree,
  } from "./util/MosicUtils";
  export let currentNode: MosaicNode<number>;

  let windowCount = 3;

  const onClickGithub = () => {
    window.open("https://github.com/champkim/mosaic_ex", "_blank");
  };

  const onClickAddToTopRight = () => {
    //let { currentNode } = this.state;
    console.log(currentNode);
    if (currentNode) {
      const path = getPathToCorner(currentNode, Corner.TOP_RIGHT);
      console.log(path);

      const parent = getNodeAtPath(
        currentNode,
        dropRight(path)
      ) as MosaicParent<number>;
      //console.log("[parent] " + parent);
      const destination = getNodeAtPath(
        currentNode,
        path
      ) as MosaicNode<number>;
      //console.log("[destination] " + destination);
      const direction: MosaicDirection = parent
        ? getOtherDirection(parent.direction)
        : "row";
      console.log("[direction] " + direction);

      let first: MosaicNode<number>;
      let second: MosaicNode<number>;
      if (direction === "row") {
        first = destination;
        second = ++windowCount;
      } else {
        first = ++windowCount;
        second = destination;
      }

      currentNode = updateTree(currentNode, [
        {
          path,
          spec: {
            $set: {
              direction,
              first,
              second,
            },
          },
        },
      ]);
    } else {
      currentNode = ++windowCount;
    }
    //this.setState({ currentNode });
    currentNode = currentNode;
  };
</script>

<div class="top-bar">
  <div class="title">mosaic-ex</div>
  <div class="button-wrap">
    <button on:click>Auto Arrage</button>
    <button on:click={onClickAddToTopRight}>Add Window to Top Right</button>
    <div on:click={onClickGithub} class="git-hub-logo" />
  </div>
</div>

<style>
  .top-bar {
    color: #fefefe;
    background: #373e44;
    font-weight: bold;
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    padding: 4px 8px;
    display: flex;
    justify-content: space-between;
  }
  .top-bar .button-wrap {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .top-bar .button-wrap button {
    height: 30px;
  }
  .git-hub-logo {
    display: inline-block;
    width: 32px;
    height: 32px;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url(https://nomcopter.github.io/react-mosaic/d56df49a807a9fd06eb1667a84d3810e.png);
    cursor: pointer;
  }
</style>
