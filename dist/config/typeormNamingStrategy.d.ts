import { DefaultNamingStrategy, type NamingStrategyInterface } from 'typeorm';
export declare class SnakeNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
    tableName(className: string, userSpecifiedName: string | undefined): string;
    columnName(propertyName: string, customName: string | undefined, embeddedPrefixes: string[]): string;
    relationName(propertyName: string): string;
    joinColumnName(relationName: string, referencedColumnName: string): string;
    joinTableName(firstTableName: string, secondTableName: string, firstPropertyName: string, _: string): string;
    joinTableColumnName(tableName: string, propertyName: string, columnName?: string): string;
    classTableInheritanceParentColumnName(parentTableName: any, parentTableIdPropertyName: any): string;
    eagerJoinRelationAlias(alias: string, propertyPath: string): string;
}
export declare class OracleNamingStrategy extends SnakeNamingStrategy {
    tableName(targetName: string, userSpecifiedName: string): string;
    columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string;
    relationName(propertyName: string): string;
    joinColumnName(relationName: string, referencedColumnName: string): string;
    joinTableName(firstTableName: string, secondTableName: string, firstPropertyName: string, secondPropertyName: string): string;
    joinTableColumnName(tableName: string, propertyName: string, columnName?: string | undefined): string;
    classTableInheritanceParentColumnName(parentTableName: any, parentTableIdPropertyName: any): string;
    eagerJoinRelationAlias(alias: string, propertyPath: string): string;
}
