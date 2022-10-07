import { writable } from "svelte/store";
import flatten from "lodash/flatten";
import dropRight from "lodash/dropRight";
import type {
  MosaicParent,
  MosaicNode,
  MosaicBranch,
  MosaicDirection,
  MarkUps,
  MosaicPath,
} from "../type/commonType";
import {
  Corner,
  getPathToCorner,
  getNodeAtPath,
  getOtherDirection,
  updateTree,
} from "../util/MosicUtils";
import { BoundingBox } from "../util/BoundingBox";
import { isParent } from "../util/MosicUtils";
import Split from "../Split.svelte";

let initNode: MosaicNode<number> = {};

function nonNullElement(
  x: MarkUps | Array<MarkUps> | null
): x is MarkUps | Array<MarkUps> {
  return x !== null;
}

class MosaicPanel {
  private currentNode: MosaicNode<number>;
  private windowCount: number = 2;
  private boundingBox: BoundingBox = BoundingBox.empty();
  private path: MosaicBranch[] = [];
  private panelMarkups: Array<MarkUps> = [];

  constructor(node) {
    this.currentNode = node;
  }

  setCurrentNode(node) {
    this.currentNode = node;
    return this.onRenderRecursively();
  }

  getPanelMmarkUps(): Array<MarkUps> {
    return this.panelMarkups;
  }

  AddToTopRight() {
    if (this.currentNode) {
      const path = getPathToCorner(this.currentNode, Corner.TOP_RIGHT);
      const parent = getNodeAtPath(
        this.currentNode,
        dropRight(path)
      ) as MosaicParent<number>;
      const destination = getNodeAtPath(
        this.currentNode,
        path
      ) as MosaicNode<number>;
      const direction: MosaicDirection = parent
        ? getOtherDirection(parent.direction)
        : "row";

      let first: MosaicNode<number>;
      let second: MosaicNode<number>;
      if (direction === "row") {
        first = destination;
        second = ++this.windowCount;
      } else {
        first = ++this.windowCount;
        second = destination;
      }

      this.currentNode = updateTree(this.currentNode, [
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
      this.currentNode = ++this.windowCount;
    }
  }

  onResize(path: MosaicPath, percentage: number) {
    if (this.currentNode) {
      const current = getNodeAtPath(
        this.currentNode,
        path
      ) as MosaicParent<number>;

      this.currentNode = updateTree(this.currentNode, [
        {
          path,
          spec: {
            $set: {
              ...current,
              splitPercentage: percentage,
            },
          },
        },
      ]);

      return this.onRenderRecursively();
    }
  }

  onAddToTopRight(): Array<MarkUps> {
    this.AddToTopRight();
    return this.onRenderRecursively();
  }

  onRenderRecursively(): Array<MarkUps> {
    this.panelMarkups = [];
    console.log(this.currentNode);
    this.renderRecursively(this.currentNode, this.boundingBox, this.path);
    return this.panelMarkups;
  }

  private renderRecursively(
    node: MosaicNode<number>,
    boundingBox: BoundingBox,
    path: MosaicBranch[]
  ): Array<MarkUps> {
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
          this.renderRecursively(node.first, first, path.concat("first")),
          new Split({
            target: document.getElementById("mosaic"),
            props: {
              boundbox: second,
              direction: node.direction,
              path,
            },
          }),
          this.renderRecursively(node.second, second, path.concat("second")),
        ].filter(nonNullElement)
      );
    } else {
      let markups: MarkUps = { style: "", name: "" };

      markups.style = `${boundingBox.top}% ${boundingBox.right}% ${boundingBox.bottom}% ${boundingBox.left}%`;
      markups.name = `${node}`;
      this.panelMarkups.push(markups);
    }
  }

  createNodes() {
    const { subscribe, set, update } = writable(this.panelMarkups);

    return {
      subscribe,
      renderRecursively: () => update(() => this.onRenderRecursively()),
      addToTopRight: () => update(() => this.onAddToTopRight()),
      setCurrentNode: (node) => update(() => this.setCurrentNode(node)),
      onResize: (path, percentage) =>
        update(() => this.onResize(path, percentage)),
      getCurrentNode: () => this.currentNode,
    };
  }
}

const mosaicPanel = new MosaicPanel(initNode);

export const MosaicNodes = mosaicPanel.createNodes();
