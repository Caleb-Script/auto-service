export default remarkLintEmphasisMarker;
export type Root = import('mdast').Root;
/**
 * Styles.
 */
export type Marker = '*' | '_';
/**
 * Configuration.
 */
export type Options = Marker | 'consistent';
declare const remarkLintEmphasisMarker: {
    (config?: import("../../node_modules/unified-lint-rule/lib/index.js").Label | import("../../node_modules/unified-lint-rule/lib/index.js").Severity | Options | [level: import("../../node_modules/unified-lint-rule/lib/index.js").Label | import("../../node_modules/unified-lint-rule/lib/index.js").Severity, option?: Options | null | undefined] | null | undefined): ((tree: import("mdast").Root, file: import("vfile").VFile, next: import("unified").TransformCallback<import("mdast").Root>) => undefined) | undefined;
    readonly name: string;
};
//# sourceMappingURL=index.d.ts.map