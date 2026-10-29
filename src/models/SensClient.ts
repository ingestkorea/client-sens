import { NodeHttpHandlerOptions } from "@ingestkorea/util-http-handler";

export type Credentials = {
  accessKey: string;
  secretKey: string;
};

export type ServiceId = {
  kakao: string;
  sms: string;
};

export type HttpHandlerOptions = Pick<NodeHttpHandlerOptions, "connectionTimeout" | "socketTimeout" | "keepAlive"> & {
  /**
   * Connection timeout in milliseconds.
   * @default 3000
   */
  connectionTimeout?: number;
  /**
   * Socket timeout in milliseconds.
   * @default 5000
   */
  socketTimeout?: number;
  /**
   * @default true
   */
  keepAlive?: boolean;

  /**
   * @deprecated
   */
  family?: 4;
};

export interface SensClientConfig {
  credentials?: Partial<Credentials>;
  serviceId?: Partial<ServiceId>;
  httpHandler?: HttpHandlerOptions;
}

export interface SensClientResolvedConfig {
  credentials: Credentials;
  serviceId: ServiceId;
  httpHandler: Required<Omit<HttpHandlerOptions, "family">>;
}
