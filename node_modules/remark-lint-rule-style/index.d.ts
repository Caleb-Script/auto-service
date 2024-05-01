export default remarkLintRuleStyle;
export type Root = import('mdast').Root;
/**
 * Configuration.
 */
export type Options = string;
declare const remarkLintRuleStyle: {
    (config?: string | 0 | 1 | 2 | [level: import("../../node_modules/unified-lint-rule/lib/index.js").Label | import("../../node_modules/unified-lint-rule/lib/index.js").Severity, option?: string | null | undefined] | null | undefined): ((tree: import("mdast").Root, file: import("vfile").VFile, next: import("unified").TransformCallback<import("mdast").Root>) => undefined) | undefined;
    readonly name: string;
};
//# sourceMappingURL=index.d.ts.map