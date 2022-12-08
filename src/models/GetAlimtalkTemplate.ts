import { ListAlimtalkTemplatesInput, ListAlimtalkTemplatesOutput } from './ListAlimtalkTemplates';

export interface GetAlimtalkTemplateInput extends ListAlimtalkTemplatesInput {
  templateCode: string
};

export interface GetAlimtalkTemplateOutput extends ListAlimtalkTemplatesOutput {

};