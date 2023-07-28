import {
  ClientSideBaseVisitor,
  ClientSideBasePluginConfig,
  LoadedFragment,
} from '@graphql-codegen/visitor-plugin-common';
import {PimcoreApolloAngularPluginRawConfig} from "./config";
import { OperationDefinitionNode, GraphQLSchema } from 'graphql';
import { Types } from '@graphql-codegen/plugin-helpers';
import autoBind from 'auto-bind';

export interface PimcoreApolloAngularPluginConfig extends ClientSideBasePluginConfig {

}

export class PimcoreApolloAngularVisitor extends ClientSideBaseVisitor<
  PimcoreApolloAngularPluginRawConfig,
  PimcoreApolloAngularPluginConfig
> {

  constructor(
    schema: GraphQLSchema,
    fragments: LoadedFragment[],
    // @ts-ignore
    private _allOperations: OperationDefinitionNode[],
    rawConfig: PimcoreApolloAngularPluginRawConfig,
    documents?: Types.DocumentFile[]
  ) {
    super(
      schema,
      fragments,
      rawConfig,
      {},
      documents
    );

    autoBind(this);
  }

  protected buildOperation(
    node: OperationDefinitionNode,
    documentVariableName: string,
    operationType: string,
    operationResultType: string,
    operationVariablesTypes: string
  ): string {
    return '';
  }
}
