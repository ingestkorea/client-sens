export type Credentials = {
  accessKey: string;
  secretKey: string;
};

export type ServiceId = {
  kakao: string;
  sms: string;
};

export type HttpHandlerOptions = {
  connectionTimeout: number;
  socketTimeout: number;
  keepAlive: boolean;
  family: 4;
};

export interface SensClientConfig {
  credentials?: Partial<Credentials>;
  serviceId?: Partial<ServiceId>;
  httpHandler?: Partial<HttpHandlerOptions>;
}

export interface SensClientResolvedConfig {
  credentials: Credentials;
  serviceId: ServiceId;
  httpHandler: HttpHandlerOptions;
}
