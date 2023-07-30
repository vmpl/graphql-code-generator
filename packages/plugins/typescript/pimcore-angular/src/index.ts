import gql from 'graphql-tag';
import { LoadedFragment } from '@graphql-codegen/visitor-plugin-common';
import { oldVisit, PluginFunction, Types } from '@graphql-codegen/plugin-helpers';
import { PimcoreAngularPluginRawConfig } from './config';
import { concatAST, FragmentDefinitionNode, GraphQLSchema, Kind } from 'graphql';
import { PimcoreAngularVisitor } from './visitor';

export const plugin: PluginFunction<PimcoreAngularPluginRawConfig> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config
) => {
  const allAst = concatAST(documents.map(v => v.document));
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

  const visitor = new PimcoreAngularVisitor(schema, allFragments, config, documents);
  const visitorResult = oldVisit(allAst, { leave: visitor });

  const content = [visitor.fragments, ...visitorResult.definitions.filter(t => typeof t === 'string')]
    .filter(a => a)
    .join('\n');

  return {
    content,
  };
};
// noinspection JSUnusedGlobalSymbols
export const addToSchema = gql`
  directive @repository(name: String!) on QUERY | MUTATION
  directive @repositoryListing(default: Boolean = true) on OBJECT | FIELD
  directive @repositoryCreate(default: Boolean = true) on OBJECT | FIELD
  directive @repositoryRead(default: Boolean = true) on OBJECT | FIELD
  directive @repositoryUpdate(default: Boolean = true) on OBJECT | FIELD
  directive @repositoryDelete(default: Boolean = true) on OBJECT | FIELD
`;
