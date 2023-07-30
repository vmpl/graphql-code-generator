import {
  ClientSideBasePluginConfig,
  ClientSideBaseVisitor,
  LoadedFragment,
} from '@graphql-codegen/visitor-plugin-common';
import { PimcoreAngularPluginRawConfig } from './config';
import { Types } from '@graphql-codegen/plugin-helpers';
import { GraphQLSchema, OperationDefinitionNode } from 'graphql';
import autoBind from 'auto-bind';

export interface PimcoreAngularPluginConfig extends ClientSideBasePluginConfig {}

export class PimcoreAngularVisitor extends ClientSideBaseVisitor<
  PimcoreAngularPluginRawConfig,
  PimcoreAngularPluginConfig
> {
  constructor(
    schema: GraphQLSchema,
    fragments: LoadedFragment[],
    rawConfig: PimcoreAngularPluginRawConfig,
    documents?: Types.DocumentFile[]
  ) {
    super(schema, fragments, rawConfig, {}, documents);

    autoBind(this);
  }

  protected buildOperation(
    _node: OperationDefinitionNode,
    _documentVariableName: string,
    _operationType: string,
    _operationResultType: string,
    _operationVariablesTypes: string,
    _hasRequiredVariables: boolean
  ): string {
    return '';
  }
}
