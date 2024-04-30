import { DefaultNamingStrategy } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils.js';
export class SnakeNamingStrategy extends DefaultNamingStrategy {
    tableName(className, userSpecifiedName) {
        return userSpecifiedName ?? snakeCase(className);
    }
    columnName(propertyName, customName, embeddedPrefixes) {
        return (snakeCase([...embeddedPrefixes, ''].join('_')) +
            (customName ?? snakeCase(propertyName)));
    }
    relationName(propertyName) {
        return snakeCase(propertyName);
    }
    joinColumnName(relationName, referencedColumnName) {
        return snakeCase(`${relationName}_${referencedColumnName}`);
    }
    joinTableName(firstTableName, secondTableName, firstPropertyName, _) {
        return snakeCase(`${firstTableName}_${firstPropertyName.replaceAll('.', '_')}_${secondTableName}`);
    }
    joinTableColumnName(tableName, propertyName, columnName) {
        return snakeCase(`${tableName}_${columnName ?? propertyName}`);
    }
    classTableInheritanceParentColumnName(parentTableName, parentTableIdPropertyName) {
        return snakeCase(`${parentTableName}_${parentTableIdPropertyName}`);
    }
    eagerJoinRelationAlias(alias, propertyPath) {
        return `${alias}__${propertyPath.replace('.', '_')}`;
    }
}
export class OracleNamingStrategy extends SnakeNamingStrategy {
    tableName(targetName, userSpecifiedName) {
        return super.tableName(targetName, userSpecifiedName).toUpperCase();
    }
    columnName(propertyName, customName, embeddedPrefixes) {
        return super
            .columnName(propertyName, customName, embeddedPrefixes)
            .toUpperCase();
    }
    relationName(propertyName) {
        return super.relationName(propertyName).toUpperCase();
    }
    joinColumnName(relationName, referencedColumnName) {
        return super
            .joinColumnName(relationName, referencedColumnName)
            .toUpperCase();
    }
    joinTableName(firstTableName, secondTableName, firstPropertyName, secondPropertyName) {
        return super
            .joinTableName(firstTableName, secondTableName, firstPropertyName, secondPropertyName)
            .toUpperCase();
    }
    joinTableColumnName(tableName, propertyName, columnName) {
        return super
            .joinTableColumnName(tableName, propertyName, columnName)
            .toUpperCase();
    }
    classTableInheritanceParentColumnName(parentTableName, parentTableIdPropertyName) {
        return super
            .classTableInheritanceParentColumnName(parentTableName, parentTableIdPropertyName)
            .toUpperCase();
    }
    eagerJoinRelationAlias(alias, propertyPath) {
        return super.eagerJoinRelationAlias(alias, propertyPath).toUpperCase();
    }
}
//# sourceMappingURL=typeormNamingStrategy.js.map