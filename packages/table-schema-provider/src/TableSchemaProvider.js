// @flow
import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { withAuth, type AuthContextProps } from '@8base/auth-provider';

import { TableSchemaContext } from './TableSchemaContext';

const TABLES_SCHEMA_QUERY = gql`
  query TablesSchema {
    system {
      tablesList(filter: { onlyUserTables: true }) {
        ...TableFragment
      }
    }
  }

  fragment TableFragment on Table {
    id
    name
    displayName
    isSystem
    fields {
      ...TableFieldFragment
    }
  }

  fragment TableFieldFragment on TableField {
    id
    name
    displayName
    description
    fieldType
    fieldTypeAttributes {
      id
      ...TextFieldTypeAttributes
      ...NumberFieldTypeAttributes
      ...FileFieldTypeAttributes
      ...DateFieldTypeAttributes
      ...SwitchFieldTypeAttributes
    }
    isList
    isRequired
    isUnique
    defaultValue
    isSystem
    isMeta
    relation {
      id
      refFieldName
      refFieldDisplayName
      relationTableName
      relationFieldName
      refTable {
        id
        name
      }
      refFieldIsList
      refFieldIsRequired
    }
  }

  fragment DateFieldTypeAttributes on DateFieldTypeAttributes {
    format
  }

  fragment TextFieldTypeAttributes on TextFieldTypeAttributes {
    format
    fieldSize
  }

  fragment NumberFieldTypeAttributes on NumberFieldTypeAttributes {
    format
    precision
    currency
    minValue
    maxValue
  }

  fragment FileFieldTypeAttributes on FileFieldTypeAttributes {
    format
    showTitle
    showUrl
    maxSize
    typeRestrictions
  }

  fragment SwitchFieldTypeAttributes on SwitchFieldTypeAttributes {
    format
    listOptions
  }
`;

type TableSchemaProviderProps = {
  children: ({ loading?: boolean }) => React$Node,
  auth: AuthContextProps,
};

/**
 * Provider for 8base table schemas
 * @property {Function} children Children of the provider. Could be either react node or function with loading state.
 */
class TableSchemaProvider extends React.Component<TableSchemaProviderProps> {
  renderContent = ({ data, loading }) => {
    const { children } = this.props;

    if (loading) return children({ loading });

    return <TableSchemaContext.Provider value={ data.system.tablesList }>{ children({ loading }) }</TableSchemaContext.Provider>;
  };

  render() {
    const { auth: { isAuthorized }, children } = this.props;

    let rendered = children({});

    if (isAuthorized) {
      rendered = <Query query={ TABLES_SCHEMA_QUERY }>{ this.renderContent }</Query>;
    }

    return rendered;
  }
}

TableSchemaProvider = withAuth(TableSchemaProvider);

export { TableSchemaProvider };
