import { writable } from "svelte/store";
import flatten from "lodash/flatten";
import dropRight from "lodash/dropRight";
import { v4 as uuid } from "uuid";
import type {
  MosaicKey,
  MosaicParent,
  MosaicNode,
  MosaicBranch,
  MosaicDirection,
  MarkUps,
  MosaicPath,
  ResizeOptions,
} from "../type/commonType";
import {
  Corner,
  getPathToCorner,
  getNodeAtPath,
  getOtherDirection,
  updateTree,
} from "../util/mosaicUpdates";
import { BoundingBox } from "../util/BoundingBox";
import {
  isParent,
  getLeaves,
  createBalancedTreeFromLeaves,
} from "../util/mosaicUpdates";
import Split from "../Split.svelte";

//let initNode: any; //MosaicNode<number> = {};

interface AppState {
  currentNode: MosaicNode<number> | null;
}
//implements AppState

class MosaicPanel implements AppState {
  currentNode: MosaicNode<number> | null;
  // currentNode: MosaicNode<number> | null = {
  //   direction: "row",
  //   first: 1,
  //   second: {
  //     direction: "column",
  //     first: 2,
  //     second: 3,
  //   },
  //   splitPercentage: 40,
  // };

  private boundingBox: BoundingBox = BoundingBox.empty();
  private path: MosaicBranch[] = [];
  private panelMarkups: Array<MarkUps> = [];

  private windowCount: number = 3;
  private createNode = () => ++this.windowCount;

  // private onChange = (currentNode: MosaicNode<number> | null) => {
  //   this.setState({ currentNode });
  // };

  private onRelease = (currentNode: MosaicNode<number> | null) => {
    console.log("Mosaic.onRelease():", currentNode);
  };

  public autoArrange = () => {
    const leaves = getLeaves(this.currentNode);
    return this.setCurrentNode(createBalancedTreeFromLeaves(leaves));
  };

  // constructor(node) {
  //   //super(node);
  //   this.currentNode = node;
  // }

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
        ] //.filter(nonNullElement)
      );
    } else {
      let markups: MarkUps = { style: "", name: "" };

      markups.style = `${boundingBox.top}% ${boundingBox.right}% ${boundingBox.bottom}% ${boundingBox.left}%`;
      markups.name = `${node}`;
      this.panelMarkups.push(markups);
      //reat 에서는  {this.props.renderTile(node, path)} 여기서 한번 html 생성. ,,
    }
  }

  private checkCreateNode() {
    if (this.createNode == null) {
      throw new Error("Operation invalid unless `createNode` is defined");
    }
  }

  // private split = (...args: any[]) => {
  //   this.checkCreateNode();
  //   const { createNode, path } = this.props;
  //   const { mosaicActions } = this.context;
  //   const root = mosaicActions.getRoot();

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

  // private swap = (...args: any[]) => {
  //   this.checkCreateNode();
  //   const { mosaicActions } = this.context;
  //   const { createNode, path } = this.props;
  //   return Promise.resolve(createNode!(...args)).then((node) => mosaicActions.replaceWith(path, node));
  // };

  createPanels() {
    const { subscribe, set, update } = writable(this.panelMarkups);

    return {
      subscribe,
      renderRecursively: () => update(() => this.onRenderRecursively()),
      addToTopRight: () => update(() => this.onAddToTopRight()),
      autoArrange: () => update(() => this.autoArrange()),
      setCurrentNode: (node) => update(() => this.setCurrentNode(node)),
      onResize: (path, percentage) =>
        update(() => this.onResize(path, percentage)),
      getCurrentNode: () => this.currentNode,
    };
  }
}

const mosaicPanel = new MosaicPanel();

export const MosaicPanels = mosaicPanel.createPanels();
