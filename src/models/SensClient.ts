export type Credentials = {
  accessKey: string;
  secretKey: string;
};

export type ServiceId = {
  kakao: string;
  sms: string;
};

export interface SensClientConfig {
  credentials?: Partial<Credentials>;
  serviceId?: Partial<ServiceId>;
}

export interface SensClientResolvedConfig {
  credentials: Credentials;
  serviceId: ServiceId;
}
