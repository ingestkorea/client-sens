import { ListTemplatesInput, ListTemplatesOutput } from './ListTemplates';

export interface GetTemplateInput extends ListTemplatesInput {
  templateCode: string
};

export interface GetTemplateOutput extends ListTemplatesOutput {

};