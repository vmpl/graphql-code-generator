import gql from 'graphql-tag';
import {LoadedFragment} from '@graphql-codegen/visitor-plugin-common';
import {PluginFunction, Types} from '@graphql-codegen/plugin-helpers';
import {PimcoreApolloAngularVisitor} from "./visitor";
import {PimcoreApolloAngularPluginRawConfig} from "./config";
import {visit, GraphQLSchema, concatAST, Kind, FragmentDefinitionNode, OperationDefinitionNode} from 'graphql';

export const plugin: PluginFunction<PimcoreApolloAngularPluginRawConfig> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config) => {
  const allAst = concatAST(documents.map(v => v.document));
  const operations = allAst.definitions.filter(d => d.kind === Kind.OPERATION_DEFINITION) as OperationDefinitionNode[];
  const allFragments: LoadedFragment[] = [
    ...(allAst.definitions.filter(d => d.kind === Kind.FRAGMENT_DEFINITION) as FragmentDefinitionNode[]).map(
      fragmentDef => ({
        node: fragmentDef,
        name: fragmentDef.name.value,
        onType: fragmentDef.typeCondition.name.value,
        isExternal: false,
      })
    ),
    ...(config.externalFragments || []),
  ];

  const visitor = new PimcoreApolloAngularVisitor(schema, allFragments, operations, config, documents);
  const visitorResult = visit(allAst, {leave: visitor});

  const content = [
    visitor.fragments,
    ...visitorResult.definitions.filter(t => typeof t === 'string'),
  ]
    .filter(a => a)
    .join('\n');

  return {
    content
  }
}
// noinspection JSUnusedGlobalSymbols
export const addToSchema = gql`
  directive @repository(name: String!) on QUERY | MUTATION
  directive @repositoryListing(default: Boolean = true) on OBJECT | FIELD
  directive @repositoryCreate(default: Boolean = true) on OBJECT | FIELD
  directive @repositoryRead(default: Boolean = true) on OBJECT | FIELD
  directive @repositoryUpdate(default: Boolean = true) on OBJECT | FIELD
  directive @repositoryDelete(default: Boolean = true) on OBJECT | FIELD
`;
