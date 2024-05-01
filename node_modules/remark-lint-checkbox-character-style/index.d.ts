export default remarkLintCheckboxCharacterStyle;
export type Root = import('mdast').Root;
/**
 * Configuration.
 */
export type Options = Styles | 'consistent';
/**
 * Styles.
 */
export type Styles = {
    /**
     * Preferred style to use for checked checkboxes (default: `'consistent'`).
     */
    checked?: 'X' | 'x' | 'consistent' | null | undefined;
    /**
     * Preferred style to use for unchecked checkboxes (default: `'consistent'`).
     */
    unchecked?: '\t' | ' ' | 'consistent' | null | undefined;
};
declare const remarkLintCheckboxCharacterStyle: {
    (config?: import("../../node_modules/unified-lint-rule/lib/index.js").Label | import("../../node_modules/unified-lint-rule/lib/index.js").Severity | Options | [level: import("../../node_modules/unified-lint-rule/lib/index.js").Label | import("../../node_modules/unified-lint-rule/lib/index.js").Severity, option?: Options | null | undefined] | null | undefined): ((tree: import("mdast").Root, file: import("vfile").VFile, next: import("unified").TransformCallback<import("mdast").Root>) => undefined) | undefined;
    readonly name: string;
};
//# sourceMappingURL=index.d.ts.map