import get from "lodash/get";
import set from "lodash/set";
//import update from "svelte-Splitpanes";
import update from "immutability-helper";

import type {
  MosaicKey,
  MosaicNode,
  MosaicParent,
  MosaicPath,
  MosaicDirection,
  MosaicUpdate,
  MosaicUpdateSpec,
} from "../type/commonType";

export enum Corner {
  TOP_LEFT = 1,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
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
    console.log(mUpdate);
    currentNode = update(
      currentNode as MosaicParent<T>,
      buildSpecFromUpdate(mUpdate)
    );
  });

  return currentNode;
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