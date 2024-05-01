export default remarkLintTableCellPadding;
export type Align = import('mdast').AlignType;
export type Nodes = import('mdast').Nodes;
export type Root = import('mdast').Root;
export type Point = import('unist').Point;
/**
 * Configuration.
 */
export type Options = Style | 'consistent';
/**
 * Styles.
 */
export type Style = 'compact' | 'padded';
declare const remarkLintTableCellPadding: {
    (config?: import("../../node_modules/unified-lint-rule/lib/index.js").Label | import("../../node_modules/unified-lint-rule/lib/index.js").Severity | Options | [level: import("../../node_modules/unified-lint-rule/lib/index.js").Label | import("../../node_modules/unified-lint-rule/lib/index.js").Severity, option?: Options | null | undefined] | null | undefined): ((tree: import("mdast").Root, file: import("vfile").VFile, next: import("unified").TransformCallback<import("mdast").Root>) => undefined) | undefined;
    readonly name: string;
};
//# sourceMappingURL=index.d.ts.map