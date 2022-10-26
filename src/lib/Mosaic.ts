import { MosaicRoot, MosaicRender } from "./MosaicRoot";
import countBy from "lodash/countBy";
import keys from "lodash/keys";
import pickBy from "lodash/pickBy";
import type {
  MosaicKey,
  MosaicParent,
  MosaicNode,
  MosaicUpdate,
  MosaicBranch,
  MosaicDirection,
  MarkUps,
  MosaicPath,
  ResizeOptions,
  TileRenderer,
} from "./type/commonType";

import type { MosaicContext, MosaicRootActions } from "./type/contextTypes";
import { v4 as uuid } from "uuid";
import {
  createExpandUpdate,
  createHideUpdate,
  createRemoveUpdate,
  updateTree,
} from "./util/mosaicUpdates";

import { getLeaves } from "./util/mosaicUtilities";

// export let mosaicId;

const DEFAULT_EXPAND_PERCENTAGE = 70;

// export interface MosaicBaseProps<T extends MosaicKey> {
//   renderTile: TileRenderer<T>;
//   /**
//    * Called when a user initiates any change to the tree (removing, adding, moving, resizing, etc.)
//    */
//   onChange?: (newNode: MosaicNode<T> | null) => void;
//   /**
//    * Called when a user completes a change (fires like above except for the interpolation during resizing)
//    */
//   onRelease?: (newNode: MosaicNode<T> | null) => void;
//   /**
//    * Additional classes to affix to the root element
//    * Default: 'mosaic-blueprint-theme'
//    */
//   className?: string;
//   /**
//    * Options that control resizing
//    * @see: [[ResizeOptions]]
//    */
//   resize?: ResizeOptions;
//   /**
//    * View to display when the current value is `null`
//    * default: Simple NonIdealState view
//    */
//   zeroStateView?: Element; //JSX.Element;
//   /**
//    * Override the mosaicId passed to `react-dnd` to control how drag and drop works with other components
//    * Note: does not support updating after instantiation
//    * default: Random UUID
//    */
//   mosaicId?: string;
//   /**
//    * Make it possible to use different versions of Blueprint with `mosaic-blueprint-theme`
//    * Note: does not support updating after instantiation
//    * default: 'bp3'
//    */
//   //blueprintNamespace?: string;
//   /**
//    * Override the react-dnd provider to allow applications to inject an existing drag and drop context
//    */
//   //dragAndDropManager?: DragDropManager | undefined;
// }

// export interface MosaicControlledProps<T extends MosaicKey>
//   extends MosaicBaseProps<T> {
//   /**
//    * The tree to render
//    */
//   value: MosaicNode<T> | null;
//   onChange: (newNode: MosaicNode<T> | null) => void;
// }

// export interface MosaicUncontrolledProps<T extends MosaicKey>
//   extends MosaicBaseProps<T> {
//   /**
//    * The initial tree to render, can be modified by the user
//    */
//   initialValue: MosaicNode<T> | null;
// }

// type MosaicProps<T extends MosaicKey> =
//   | MosaicControlledProps<T>
//   | MosaicUncontrolledProps<T>;

// function isUncontrolled<T extends MosaicKey>(
//   props: MosaicProps<T>
// ): props is MosaicUncontrolledProps<T> {
//   return (props as MosaicUncontrolledProps<T>).initialValue != null;
// }

export interface MosaicState<T extends MosaicKey> {
  currentNode: MosaicNode<T> | null;
  lastInitialValue: MosaicNode<T> | null;
  mosaicId: string;
}

// function applyMixins(targetClass: any, baseClasses: any[]): void {
//   baseClasses.forEach((baseClass) => {
//     Object.getOwnPropertyNames(baseClass.prototype).forEach((name) => {
//       const descriptor = Object.getOwnPropertyDescriptor(
//         baseClass.prototype,
//         name
//       );

//       descriptor &&
//         Object.defineProperty(targetClass.prototype, name, descriptor);
//     });
//   });
// }
//applyMixins(MosaicWithoutDragDropContext, [MosaicProps<T>,MosaicState<T>]);

class MosaicWithoutDragDropContext<T extends MosaicKey = string>
  implements MosaicState<T>
{
  //implements MosaicBaseProps<T>
  currentNode: MosaicNode<T> | null;
  lastInitialValue: MosaicNode<T> | null;
  mosaicId: string;

  // private props: MosaicProps<T> = {
  //   initialValue: null,
  //   value: null,
  //   renderTile: null,
  // };

  // defaultProps = {
  //   onChange: () => void 0,
  //   value: null,
  //   //className: 'mosaic-blueprint-theme',
  //   //blueprintNamespace: 'bp3',
  // };

  constructor() {
    //props: MosaicProps<T>
    //super(node);

    this.currentNode = null;
    this.lastInitialValue = null;
    // this.mosaicId = this.props.mosaicId ?? uuid();
  }

  private getRoot(): MosaicNode<T> | null {
    // if (isUncontrolled(this.props)) {
    //   return this.currentNode;
    // } else {
    return MosaicRoot.getCurrentNode() as MosaicNode<T>; //this.props.value;
    // }
  }

  private updateRoot = (
    updates: MosaicUpdate<T>[],
    suppressOnRelease: boolean = false
  ) => {
    const currentNode = this.getRoot() || ({} as MosaicNode<T>);

    this.replaceRoot(updateTree(currentNode, updates), suppressOnRelease);
  };

  public replaceRoot = (
    currentNode: MosaicNode<T> | null,
    suppressOnRelease: boolean = false
  ) => {
    // this.currentNode = currentNode;
    MosaicRender.setCurrentNode(currentNode);
    console.log(">>>>>>>>>> Set.. Cur..", currentNode);

    //여기 아래부분은 나중에 확인..
    // this.props.onChange!(currentNode);
    // if (!suppressOnRelease && this.props.onRelease) {
    //   this.props.onRelease(currentNode);
    // }

    // if (isUncontrolled(this.props)) {
    //todo: this.setState({ currentNode });
    //this.currentNode = currentNode;
    //MosaicPanels.setCurrentNode(this.currentNode);
    // }
  };

  public actions: MosaicRootActions<T> = {
    updateTree: this.updateRoot,
    remove: (path: MosaicPath) => {
      if (path.length === 0) {
        this.replaceRoot(null);
      } else {
        this.updateRoot([createRemoveUpdate(this.getRoot(), path)]);
      }
    },
    expand: (
      path: MosaicPath,
      percentage: number = DEFAULT_EXPAND_PERCENTAGE
    ) => this.updateRoot([createExpandUpdate<T>(path, percentage)]),
    getRoot: () => this.getRoot()!,
    hide: (path: MosaicPath) => this.updateRoot([createHideUpdate<T>(path)]),
    replaceWith: (path: MosaicPath, newNode: MosaicNode<T>) =>
      this.updateRoot([
        {
          path,
          spec: {
            $set: newNode,
          },
        },
      ]),
  };

  //   private readonly childContext: MosaicContext<T> = {
  //     mosaicActions: this.actions,
  //     mosaicId: this.mosaicId
  //     blueprintNamespace: this.props.blueprintNamespace!,
  //   };

  // private renderTree() {
  //   const root = this.getRoot();
  //   this.validateTree(root);
  //   if (root === null || root === undefined) {
  //     return this.props.zeroStateView!;
  //   } else {
  //     const { renderTile, resize } = this.props;
  //     //return <MosaicRoot root={root} renderTile={renderTile} resize={resize} />;
  //     return root; //<MosaicRoot root={root} renderTile={renderTile} resize={resize} />;
  //   }
  // }

  // private validateTree(node: MosaicNode<T> | null) {
  //   if (process.env.NODE_ENV !== "production") {
  //     const duplicates = keys(pickBy(countBy(getLeaves(node)), (n) => n > 1));

  //     if (duplicates.length > 0) {
  //       throw new Error(
  //         `Duplicate IDs [${duplicates.join(
  //           ", "
  //         )}] detected. Mosaic does not support leaves with the same ID`
  //       );
  //     }
  //   }
  // }
}

// const props = {
//   onChange: () => void 0,
//   value: null,
//   //className: 'mosaic-blueprint-theme',
//   //blueprintNamespace: 'bp3',
// };

const mosaicWithout = new MosaicWithoutDragDropContext<number>();

export const MosaicActions = mosaicWithout;
