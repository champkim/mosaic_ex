import { writable } from "svelte/store";
import flatten from "lodash/flatten";
import dropRight from "lodash/dropRight";
import type {
  MosaicParent,
  MosaicNode,
  MosaicBranch,
  MosaicDirection,
  MarkUps,
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

let initNode: MosaicNode<number> = {
  direction: "row",
  first: 1,
  //second: 'b'
  second: {
    direction: "column",
    first: 2,
    second: 3,
  },
};

function nonNullElement(
  x: MarkUps | Array<MarkUps> | null
): x is MarkUps | Array<MarkUps> {
  return x !== null;
}

class MosaicPanel {
  private currentNode: MosaicNode<number>;
  private windowCount: number = 3;
  private boundingBox: BoundingBox = BoundingBox.empty();
  private path: MosaicBranch[] = [];
  private panelMarkups: Array<MarkUps> = [];

  constructor(node) {
    this.currentNode = node;
  }

  setCurrentNode(node) {
    this.currentNode = node;
    return this.onRenderRecursively()
  }

  getPanelMmarkUps(): Array<MarkUps> {
    return this.panelMarkups;
  }

  // AddToTopRight(node: MosaicNode<number>): MosaicNode<number> {
  //   //let { node } = this.state;
  //   console.log(node);
  //   if (node) {
  //     const path = getPathToCorner(node, Corner.TOP_RIGHT);
  //     console.log(path);

  //     const parent = getNodeAtPath(
  //       node,
  //       dropRight(path)
  //     ) as MosaicParent<number>;
  //     //console.log("[parent] " + parent);
  //     const destination = getNodeAtPath(node, path) as MosaicNode<number>;
  //     //console.log("[destination] " + destination);
  //     const direction: MosaicDirection = parent
  //       ? getOtherDirection(parent.direction)
  //       : "row";
  //     console.log("[direction] " + direction);

  //     let first: MosaicNode<number>;
  //     let second: MosaicNode<number>;
  //     if (direction === "row") {
  //       first = destination;
  //       second = ++this.windowCount;
  //     } else {
  //       first = ++this.windowCount;
  //       second = destination;
  //     }

  //     node = updateTree(node, [
  //       {
  //         path,
  //         spec: {
  //           $set: {
  //             direction,
  //             first,
  //             second,
  //           },
  //         },
  //       },
  //     ]);
  //   } else {
  //     node = ++this.windowCount;
  //   }

  //   return node;
  //   //this.setState({ currentNode });
  //   //this.currentNode = this.currentNode;
  // }

  AddToTopRight() {
    //let { currentNode: MosaicNode<Number> } = tss;
    //console.log(this.currentNode);
    if (this.currentNode) {
      const path = getPathToCorner(this.currentNode, Corner.TOP_RIGHT);
      //console.log(path);

      const parent = getNodeAtPath(
        this.currentNode,
        dropRight(path)
      ) as MosaicParent<number>;
      //console.log("[parent] " + parent);
      const destination = getNodeAtPath(
        this.currentNode,
        path
      ) as MosaicNode<number>;
      //console.log("[destination] " + destination);
      const direction: MosaicDirection = parent
        ? getOtherDirection(parent.direction)
        : "row";
      //console.log("[direction] " + direction);

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
    //this.setState({ currentNode });
    //this.currentNode = this.currentNode;
  }

  onAddToTopRight(): Array<MarkUps> {
    this.AddToTopRight();
    return this.onRenderRecursively();
  }

  onRenderRecursively(): Array<MarkUps> {
    this.panelMarkups = [];
    console.log(this.currentNode)
    this.renderRecursively(this.currentNode, this.boundingBox, this.path);
    return this.panelMarkups;
  }

  private renderRecursively(
    node: MosaicNode<number>,
    boundingBox: BoundingBox,
    path: MosaicBranch[]
  ): Array<MarkUps> {
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
          this.renderRecursively(node.first, first, path.concat("first")),
          //renderSplit(node.direction, boundingBox, splitPercentage, path),
          this.renderRecursively(node.second, second, path.concat("second")),
        ].filter(nonNullElement)
      );
    } else {
      // let panelsMarkUp2 = `< class="panel" style="inset:${boundingBox.top}% ${boundingBox.right}% ${boundingBox.bottom}% ${boundingBox.left}%">`;
      // panelsMarkUp += `<PanelTopBar/> <div class="contents">Window ${node}</div>`;
      // console.log(panelsMarkUp);

      let markups: MarkUps = { style: "", name: "" };

      markups.style = `${boundingBox.top}% ${boundingBox.right}% ${boundingBox.bottom}% ${boundingBox.left}%`;
      markups.name = `${node}`;
      this.panelMarkups.push(markups);

      //return this.panelMarkups;
      //return markups;
      // return (
      //   <div key={node} className="mosaic-tile" style={{ ...BoundingBox.asStyles(boundingBox) }}>
      //     {this.props.renderTile(node, path)}
      //   </div>
      // );
    }
  }

  createNodes() {
    const { subscribe, set, update } = writable(this.panelMarkups);

    return {
      subscribe,
      renderRecursively: () => update(() => this.onRenderRecursively()),
      addToTopRight: () => update(() => this.onAddToTopRight()),
      setCurrentNode: (node) => update(() => this.setCurrentNode(node))
      //let { currentNode } = this.state;
    };
  }
}

const mosaicPanel = new MosaicPanel(initNode);

// let panelMarkups: Array<MarkUps>;
// panelMarkups = mosaicPanel.getPanelMmarkUps();

// function createNodes() {
//   const { subscribe, set, update } = writable(panelMarkups);

//   return {
//     subscribe,
//     renderRecursively: () =>
//       update((panelMarkups) => mosaicPanel.onRenderRecursively()),
//     addToTopRight: () =>
//       update((panelMarkups) => mosaicPanel.onAddToTopRight()),

//     //let { currentNode } = this.state;
//   };
// }
// export const MosaicNodes = createNodes();

export const MosaicNodes = mosaicPanel.createNodes();
