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
} from "./type/commonType";
import {
  Corner,
  getPathToCorner,
  getNodeAtPath,
  getOtherDirection,
  updateTree,
} from "./util/mosaicUpdates";
import { BoundingBox } from "./util/BoundingBox";
import {
  isParent,
  getLeaves,
  createBalancedTreeFromLeaves,
} from "./util/mosaicUpdates";
import Split from "../Split.svelte";

//let initNode: any; //MosaicNode<number> = {};

interface AppState {
  currentNode: MosaicNode<number> | null;
}
//implements AppState

class Mosaic implements AppState {
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
  private newWindowCount: number = 0;
  public createNode = () => ++this.windowCount;
  //public createNode: CreateNode<number> = () => ++this.windowCount;

  // private onChange = (currentNode: MosaicNode<number> | null) => {
  //   this.setState({ currentNode });
  // };

  public getCurrentNode() {
    return this.currentNode;
  }

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
    console.log(">>>>>>>>>> SetCurrentNode", node);
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
        second = this.createNode();
      } else {
        first = this.createNode();
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
      this.currentNode = this.createNode();
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
    this.newWindowCount = 0;

    const elements = document.getElementsByClassName("split");
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }

    //console.log(this.currentNode);
    this.renderRecursively(this.currentNode, this.boundingBox, this.path);
    this.windowCount = this.newWindowCount;
    return this.panelMarkups;
  }

  nonNullElement(
    x: MarkUps | MarkUps[] | Split | null
  ): x is MarkUps | MarkUps[] | Split {
    return x !== null;
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
          //TODO: Test
          this.renderSplit(node.direction, second, path),
          this.renderRecursively(node.second, second, path.concat("second")),
        ].filter(this.nonNullElement)
      );
    } else {
      let markups: MarkUps = {
        style: "",
        name: "",
        path: null,
        //offsetRect: { offsetWidth: 0, offsetHeight: 0 },
        //direction: "row",
      };

      markups.style = `${boundingBox.top}% ${boundingBox.right}% ${boundingBox.bottom}% ${boundingBox.left}%`;
      markups.name = `${node}`;
      markups.path = path;
      this.panelMarkups.push(markups);
      if (this.newWindowCount < node) {
        this.newWindowCount = node;
      }
      //reat ?????????  {this.props.renderTile(node, path)} ????????? ?????? html ??????. ,,
    }
  }

  private renderSplit(
    direction: MosaicDirection,
    boundbox: BoundingBox,
    path: MosaicBranch[]
  ) {
    return new Split({
      target: document.getElementById("mosaic"),
      props: {
        boundbox,
        direction,
        path,
      },
    });

    // return <Split boundbox={boundbox}/>
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

  createStores() {
    const { subscribe, update } = writable(this.panelMarkups);

    return {
      subscribe,
      renderRecursively: () => update(() => this.onRenderRecursively()),
      addToTopRight: () => update(() => this.onAddToTopRight()),
      autoArrange: () => update(() => this.autoArrange()),
      setCurrentNode: (node) => update(() => this.setCurrentNode(node)),
      onResize: (path, percentage) =>
        update(() => this.onResize(path, percentage)),
      //getCurrentNode: () => this.currentNode,
    };
  }
}

const mosaic = new Mosaic();

export const MosaicRoot = mosaic;
export const MosaicRender = mosaic.createStores();
