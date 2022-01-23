import { Component, OnInit } from '@angular/core';

import { MAIN_CONFIG } from 'src/app/config/main.config';
import { TreeNode } from 'src/app/models/tree-node.model';
import { Tree } from 'src/app/models/tree.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // Private variables
  private _file: File = null;
  private _content: string = null;
  private _fileReader: FileReader;
  private _contentMap = {};
  private _stack: TreeNode[] = [];
  private _tree: Tree = new Tree();
  private _treeString: string = null;

  // Public Methods
  public ngOnInit(): void {
    this._setUpFileReader();
  }

  /**
   * Return the file
   */
  public get file(): File {
    return this._file;
  }

  /**
   * Set the new file
   * @param _file: The file to be set as input
   */
  public set file(_file: File) {
    this._file = _file;
  }

  /**
   * Return the content
   */
  public get content(): string {
    return this._content;
  }

  /**
   * Set the new content
   * @param _content: new content
   */
  public set content(_content: string) {
    this._content = _content.trim();

    // To be implemented asynchronously to avoid freezing the frontend
    setTimeout((): void => {
      this._resetVars();

      // If the content isn't empty, then proceed
      if (this._content) {
        this._buildMap();
      }
    });
  }

  /**
   * Return the tree string
   */
  public get treeString(): string {
    return this._treeString;
  }

  /**
   * Set the tree string
   * @param _treeString: the tree string
   */
  public set treeString(_treeString: string) {
    this._treeString = _treeString;
  }

  /**
   * Return whether a file has been uploaded yet or not
   */
  public get fileUploaded(): boolean {
    return this.file !== null;
  }

  /**
   * Return the file name or the constant defined in the config
   */
  public get fileName(): string {
    return this.fileUploaded ? this.file.name : MAIN_CONFIG.noFileName;
  }

  /**
   * The action called on picking a file to upload it
   * @param event: The upload event
   */
  public uploadFileAction(event: Event): void {
    //@ts-ignore
    if (event.target.files.length > 0) {
      //@ts-ignore
      this.file = event.target.files[0];
      this._fileReader.readAsText(this.file);
    }
  }

  /**
   * The action should be called when the content in textarea was updated
   * @param newValue: the event including the updated content
   */
  public contentUpdateAction(newValue: Event): void {
    //@ts-ignore
    this.content = newValue.target.value;
  }

  /**
   * A private method to set up the file reader
   * @private
   */
  private _setUpFileReader(): void {
    this._fileReader = new FileReader();
    this._fileReader.onload = this._updateContent.bind(this);
  }

  /**
   * A method to update the content from the file
   * @param _
   * @private
   */
  private _updateContent(_: Event): void {
    const content = this._fileReader.result;
    this.content =
      typeof content === 'string'
        ? content
        : new TextDecoder('utf-8').decode(new Uint8Array(content));
  }

  /**
   * A method to set the word occurrence
   * @param word: the word
   * @private
   */
  private _matchWordInMap(word: string): void {
    this._contentMap[word] =
      word in this._contentMap ? ++this._contentMap[word] : 1;
  }

  /**
   * The method to sort content map ascending per the number of occurrences
   * @private
   */
  private _buildStack(): TreeNode[] {
    return Object.keys(this._contentMap).reduce(
      (accumulator: TreeNode[], key: string) =>
        accumulator.concat([TreeNode.fromEntry(key, this._contentMap[key])]),
      []
    );
  }

  /**
   * A method to sort the node stack in descending order by occurrence
   * @private
   */
  private _sortStack(): void {
    this._stack = this._stack
      .sort(
        (firstElement: TreeNode, secondElement: TreeNode) =>
          firstElement.occurrence - secondElement.occurrence
      )
      .reverse();
  }

  /**
   * A method to build the tree. If only one left, then set it as the root. Otherwise, every two nodes should be
   * linked with a parent node
   * @private
   */
  private _buildTree(): void {
    while (this._stack.length > 0) {
      this._sortStack();

      switch (this._stack.length) {
        case 1: {
          this._tree.root = this._stack.pop();
          break;
        }

        default: {
          this._stack.push(
            TreeNode.getParentNode(this._stack.pop(), this._stack.pop())
          );
          break;
        }
      }
    }
  }

  /**
   * A method to get the full view of a node including the left and right elements
   * @param node: The node to build the view of it
   * @param level: The level where the node would be located. Starting with 0 for the root and increasing going down
   * @private
   */
  private _getNodeView(node: TreeNode, level: number): string {
    if (!node) {
      return '';
    }

    node.level = level;

    return `${'| '.repeat(level)}${
      level > 0 ? `\n${'| '.repeat(level - 1)}+- ` : ''
    }${node.toString()}\n${this._getNodeView(
      node.left,
      level + 1
    )}${this._getNodeView(node.right, level + 1)}`;
  }

  /**
   * A method to build the string for the full tree view
   * @private
   */
  private _buildStringView(): void {
    this._treeString = this._tree ? this._getNodeView(this._tree.root, 0) : '';
  }

  /**
   * A method to reset all the variables before setting the new values
   * @private
   */
  private _resetVars(): void {
    this._contentMap = {};
    this._stack = [];
    this._tree = new Tree();
    this.treeString = null;
  }

  /**
   * the action to build the view
   * @private
   */
  private _buildMap(): void {
    Promise.resolve()
      .then(() =>
        this.content
          .toLowerCase()
          .split(' ')
          .forEach(word => this._matchWordInMap(word))
      )
      .then(() => this._buildStack())
      .then(nodeList => (this._stack = nodeList))
      .then(() => this._buildTree())
      .then(() => this._buildStringView());
  }
}
