import get from "lodash/get";
import set from "lodash/set";
import clone from "lodash/clone";
import isEqual from "lodash/isEqual";
import take from "lodash/take";
import dropRight from "lodash/dropRight";
import last from "lodash/last";
import drop from "lodash/drop";
//import update from "svelte-Splitpanes";
import update from "immutability-helper";

import type {
  MosaicBranch,
  MosaicKey,
  MosaicNode,
  MosaicParent,
  MosaicPath,
  MosaicDirection,
  MosaicUpdate,
  MosaicUpdateSpec,
} from "../type/commonType";

import { MosaicDropTargetPosition } from "../type/dropTypes";

import {
  getAndAssertNodeAtPathExists,
  getOtherBranch,
} from "./mosaicUtilities";

export enum Corner {
  TOP_LEFT = 1,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
}

/**
 * Creates a `MosaicUpdate<T>` to split the _leaf_ at `destinationPath` into a node of it and the node from `sourcePath`
 * placing the node from `sourcePath` in `position`.
 * @param root
 * @param sourcePath
 * @param destinationPath
 * @param position
 * @returns {(MosaicUpdate<T>|{path: MosaicPath, spec: {$set: {first: MosaicNode<T>, second: MosaicNode<T>, direction: MosaicDirection}}})[]}
 */
export function createDragToUpdates<T extends MosaicKey>(
  root: MosaicNode<T>,
  sourcePath: MosaicPath,
  destinationPath: MosaicPath,
  position: MosaicDropTargetPosition
): MosaicUpdate<T>[] {
  let destinationNode = getAndAssertNodeAtPathExists(root, destinationPath);

  // console.log(
  //   ">>>>>>>>>>>>>> getAndAssertNodeAtPathExists",
  //   root,
  //   destinationPath,
  //   destinationNode
  // );

  const updates: MosaicUpdate<T>[] = [];

  const destinationIsParentOfSource = isPathPrefixEqual(
    sourcePath,
    destinationPath,
    destinationPath.length
  );
  if (destinationIsParentOfSource) {
    // console.log(">>>>>>>>>>>>>> destinationIsParentOfSource", destinationNode);
    // Must explicitly remove source from the destination node
    destinationNode = updateTree(destinationNode, [
      createRemoveUpdate(
        destinationNode,
        drop(sourcePath, destinationPath.length)
      ),
    ]);
  } else {
    // Can remove source normally
    // console.log(">>>>>>>>>>>>>> createRemoveUpdate", root, sourcePath);
    updates.push(createRemoveUpdate(root, sourcePath));

    // Have to drop in the correct destination after the source has been removed
    const removedNodeParentIsInPath = isPathPrefixEqual(
      sourcePath,
      destinationPath,
      sourcePath.length - 1
    );
    if (removedNodeParentIsInPath) {
      // console.log(
      //   ">>>>>>>>>>>>>> removedNodeParentIsInPath",
      //   removedNodeParentIsInPath
      // );
      destinationPath.splice(sourcePath.length - 1, 1);
    }
  }

  const sourceNode = getAndAssertNodeAtPathExists(root, sourcePath);
  let first: MosaicNode<T>;
  let second: MosaicNode<T>;
  if (
    position === MosaicDropTargetPosition.LEFT ||
    position === MosaicDropTargetPosition.TOP
  ) {
    first = sourceNode;
    second = destinationNode;
  } else {
    first = destinationNode;
    second = sourceNode;
  }

  let direction: MosaicDirection = "column";
  if (
    position === MosaicDropTargetPosition.LEFT ||
    position === MosaicDropTargetPosition.RIGHT
  ) {
    direction = "row";
  }

  updates.push({
    path: destinationPath,
    spec: {
      $set: { first, second, direction },
    },
  });

  return updates;
}

function isPathPrefixEqual(a: MosaicPath, b: MosaicPath, length: number) {
  return isEqual(take(a, length), take(b, length));
}

/**
 * Used to prepare `update` for `immutability-helper`
 * @param mosaicUpdate
 * @returns {any}
 */
export function buildSpecFromUpdate<T extends MosaicKey>(
  mosaicUpdate: MosaicUpdate<T>
): MosaicUpdateSpec<T> {
  if (mosaicUpdate.path.length > 0) {
    return set({}, mosaicUpdate.path, mosaicUpdate.spec);
  } else {
    return mosaicUpdate.spec;
  }
}

// * Applies `updates` to `root`
// * @param root
// * @param updates
// * @returns {MosaicNode<T>}
// */
export function updateTree<T extends MosaicKey>(
  root: MosaicNode<T>,
  updates: MosaicUpdate<T>[]
) {
  let currentNode = root;
  updates.forEach((mUpdate: MosaicUpdate<T>) => {
    //console.log(mUpdate);
    currentNode = update(
      currentNode as MosaicParent<T>,
      buildSpecFromUpdate(mUpdate)
    );
  });

  // console.log("updateTree >> ", currentNode);
  return currentNode;
}

/**
 * Creates a `MosaicUpdate<T>` to remove the node at `path` from `root`
 * @param root
 * @param path
 * @returns {{path: T[], spec: {$set: MosaicNode<T>}}}
 */
export function createRemoveUpdate<T extends MosaicKey>(
  root: MosaicNode<T> | null,
  path: MosaicPath
): MosaicUpdate<T> {
  const parentPath = dropRight(path);
  // console.log("parentPath", parentPath);
  const nodeToRemove = last(path);
  // console.log("nodeToRemove", nodeToRemove);
  const siblingPath = parentPath.concat(getOtherBranch(nodeToRemove!));
  // console.log("siblingPath", siblingPath);
  const sibling = getAndAssertNodeAtPathExists(root, siblingPath);
  // console.log("parentPath, sibling", parentPath, sibling);
  return {
    path: parentPath,
    spec: {
      $set: sibling,
    },
  };
}

export function getOtherDirection(direction: MosaicDirection): MosaicDirection {
  if (direction === "row") {
    return "column";
  } else {
    return "row";
  }
}

export function isParent<T extends MosaicKey>(
  node: MosaicNode<T>
): node is MosaicParent<T> {
  return (node as MosaicParent<T>).direction != null;
}

export function getPathToCorner(
  tree: MosaicNode<any>,
  corner: Corner
): MosaicPath {
  let currentNode: MosaicNode<any> = tree;
  const currentPath: MosaicPath = [];
  while (isParent(currentNode)) {
    if (
      currentNode.direction === "row" &&
      (corner === Corner.TOP_LEFT || corner === Corner.BOTTOM_LEFT)
    ) {
      currentPath.push("first");
      currentNode = currentNode.first;
    } else if (
      currentNode.direction === "column" &&
      (corner === Corner.TOP_LEFT || corner === Corner.TOP_RIGHT)
    ) {
      currentPath.push("first");
      currentNode = currentNode.first;
    } else {
      currentPath.push("second");
      currentNode = currentNode.second;
    }
  }

  return currentPath;
}

export function getNodeAtPath<T extends MosaicKey>(
  tree: MosaicNode<T> | null,
  path: MosaicPath
): MosaicNode<T> | null {
  if (path.length > 0) {
    return get(tree, path, null);
  } else {
    return tree;
  }
}

export function getLeaves<T extends MosaicKey>(
  tree: MosaicNode<T> | null
): T[] {
  if (tree == null) {
    return [];
  } else if (isParent(tree)) {
    return getLeaves(tree.first).concat(getLeaves(tree.second));
  } else {
    return [tree];
  }
}

export function createBalancedTreeFromLeaves<T extends MosaicKey>(
  leaves: MosaicNode<T>[],
  startDirection: MosaicDirection = "row"
): MosaicNode<T> | null {
  if (leaves.length === 0) {
    return null;
  }

  let current: MosaicNode<T>[] = clone(leaves);
  let next: MosaicNode<T>[] = [];

  while (current.length > 1) {
    while (current.length > 0) {
      if (current.length > 1) {
        next.push({
          direction: "row",
          first: current.shift()!,
          second: current.shift()!,
        });
      } else {
        next.unshift(current.shift()!);
      }
    }
    current = next;
    next = [];
  }
  return alternateDirection(current[0], startDirection);
}

function alternateDirection<T extends MosaicKey>(
  node: MosaicNode<T>,
  direction: MosaicDirection = "row"
): MosaicNode<T> {
  if (isParent(node)) {
    const nextDirection = getOtherDirection(direction);
    return {
      direction,
      first: alternateDirection(node.first, nextDirection),
      second: alternateDirection(node.second, nextDirection),
    };
  } else {
    return node;
  }
}

/**
 * Sets the splitPercentage to hide the node at `path`
 * @param path
 * @returns {{path: T[], spec: {splitPercentage: {$set: number}}}}
 */
export function createHideUpdate<T extends MosaicKey>(
  path: MosaicPath
): MosaicUpdate<T> {
  const targetPath = dropRight(path);
  const thisBranch = last(path);

  let splitPercentage: number;
  if (thisBranch === "first") {
    splitPercentage = 0;
  } else {
    splitPercentage = 100;
  }

  return {
    path: targetPath,
    spec: {
      splitPercentage: {
        $set: splitPercentage,
      },
    },
  };
}

/**
 * Sets the splitPercentage of node at `path` and all of its parents to `percentage` in order to expand it
 * @param path
 * @param percentage
 * @returns {{spec: MosaicUpdateSpec<T>, path: Array}}
 */
export function createExpandUpdate<T extends MosaicKey>(
  path: MosaicPath,
  percentage: number
): MosaicUpdate<T> {
  let spec: MosaicUpdateSpec<T> = {};
  for (let i = path.length - 1; i >= 0; i--) {
    const branch: MosaicBranch = path[i];
    const splitPercentage = branch === "first" ? percentage : 100 - percentage;
    spec = {
      splitPercentage: {
        $set: splitPercentage,
      },
      [branch]: spec,
    };
  }

  return {
    spec,
    path: [],
  };
}
