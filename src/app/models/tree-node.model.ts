export class TreeNode {
  public content: string;
  public occurrence: number;
  public level?: number;
  public left?: TreeNode;
  public right?: TreeNode;

  /**
   * Constructor
   */
  public constructor() {
    this.content = null;
    this.occurrence = 0;
  }

  /**
   * To string method, including occurrence and content if not null
   */
  public toString(): string {
    if (!this) {
      return '';
    }

    return `${this.occurrence}${this.content ? ` ( ${this.content} )` : ''}`;
  }

  /**
   * Build a node from occurrence and content
   * @param content: The node content representing the word
   * @param occurrence: The node occurrence representing word occurrence
   */
  public static fromEntry(
    content: string = null,
    occurrence: number = 0
  ): TreeNode {
    const node = new TreeNode();
    node.content = content;
    node.occurrence = occurrence;
    return node;
  }

  /**
   * Build a parent node for two nodes
   * @param rightNode: Node 1 to be on the right of the parent node
   * @param leftNode: Node 2 to be on the left of the parent node
   */
  public static getParentNode(
    rightNode: TreeNode,
    leftNode: TreeNode
  ): TreeNode {
    const parentNode = new TreeNode();

    parentNode.occurrence =
      (rightNode.occurrence || 0) + (leftNode.occurrence || 0);
    parentNode.right = rightNode;
    parentNode.left = leftNode;

    return parentNode;
  }
}
