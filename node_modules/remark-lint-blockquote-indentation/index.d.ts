export default remarkLintBlockquoteIndentation;
export type Root = import('mdast').Root;
/**
 * Configuration.
 */
export type Options = number | 'consistent';
declare const remarkLintBlockquoteIndentation: {
    (config?: number | "error" | "on" | "off" | "warn" | "consistent" | [level: import("../../node_modules/unified-lint-rule/lib/index.js").Label | import("../../node_modules/unified-lint-rule/lib/index.js").Severity, option?: Options | null | undefined] | null | undefined): ((tree: import("mdast").Root, file: import("vfile").VFile, next: import("unified").TransformCallback<import("mdast").Root>) => undefined) | undefined;
    readonly name: string;
};
//# sourceMappingURL=index.d.ts.map