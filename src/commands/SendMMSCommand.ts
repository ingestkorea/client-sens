import { parse, format } from "node:path";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import {
  SensClientResolvedConfig,
  SensCommand,
  SendMMSRequest,
  SendMMSResult,
  MetadataBearer,
  RequestSerializer,
  ResponseDeserializer,
  MMS_MAX_SUPPORT_FILE_SIZE,
  MMS_SUPPORT_FILE_EXTENSION,
  SendFile,
  SensError,
} from "../models/index.js";
import { se_SendMMSCommand, de_SendMMSCommand } from "../protocols/SendMMS.js";
import { trimText, prettyPhoneNum } from "./constants";
import { resolveInputMessages } from "./SendSMSCommand.js";

export interface SendMMSCommandInput extends SendMMSRequest {}
export interface SendMMSCommandOutput extends MetadataBearer, SendMMSResult {}

export class SendMMSCommand extends SensCommand<SendMMSCommandInput, SendMMSCommandOutput, SensClientResolvedConfig> {
  input: SendMMSCommandInput;
  serializer: RequestSerializer<SendMMSCommandInput, SensClientResolvedConfig>;
  deserializer: ResponseDeserializer<SendMMSCommandOutput, SensClientResolvedConfig>;

  constructor(input: SendMMSCommandInput) {
    super(input);

    const content = input.content ? trimText(input.content) : "내용없음";
    const subject = input.subject ? trimText(input.subject) : "제목없음";

    const messages = resolveInputMessages(input.messages, { defaultContent: content, defaultSubject: subject });

    this.input = {
      from: prettyPhoneNum(input.from),
      content,
      messages,
      type: "MMS",
      contentType: input.contentType ? input.contentType : "COMM",
      countryCode: input.countryCode ? input.countryCode : "82",
      subject,
      files: (input.files || []).map((file) => {
        return resolveSendFile(file, { maxKiB: MMS_MAX_SUPPORT_FILE_SIZE, supportExt: MMS_SUPPORT_FILE_EXTENSION });
      }),
    };
    this.serializer = se_SendMMSCommand;
    this.deserializer = de_SendMMSCommand;
  }
}

const resolveSendFile = (file: SendFile, options: { maxKiB: number; supportExt: string[] }): SendFile => {
  const parsed = parse(file.name); // { dir, name, ext, base }
  const ext = parsed.ext.toLocaleLowerCase();

  if (!options.supportExt.includes(ext)) {
    throw new SensError({
      code: -1,
      type: "SDK.GENERAL_ERROR",
      message: `MMS는 ${options.supportExt.join(", ")} 형식의 첨부파일만 보낼 수 있습니다.`,
    });
  }

  if (file.body) {
    const buffer = Buffer.from(file.body, "base64");
    checkSizeLimit(buffer, options.maxKiB);

    const hash = createHash("md5").update(buffer).digest("hex");
    return {
      name: format({ name: hash, ext }),
      body: file.body,
    };
  }

  if (!existsSync(file.name)) {
    throw new SensError({
      code: -1,
      type: "SDK.GENERAL_ERROR",
      message: `${file.name} 첨부파일이 존재하지 않습니다.`,
    });
  }

  const buffer = readFileSync(file.name);
  checkSizeLimit(buffer, options.maxKiB);

  const hash = createHash("md5").update(buffer).digest("hex");

  return {
    name: format({ name: hash, ext }),
    body: buffer.toString("base64"),
  };
};

const checkSizeLimit = (buffer: Buffer, maxKiB: number): void => {
  const byteSize = buffer.length;
  const kibSize = Math.ceil(byteSize / 1024);

  if (kibSize > maxKiB) {
    throw new SensError({
      code: -1,
      type: "SDK.GENERAL_ERROR",
      message: `첨부파일은 ${maxKiB}KiB까지 전송 가능합니다. 현재 ${kibSize}KiB`,
    });
  }

  return;
};
