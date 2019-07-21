import { HttpMethodEnum } from "../enum/HttpMethodEnum";

export interface IHttpServiceRequest {
  url: string;
  method?: HttpMethodEnum;
  header?: any;
  data?: any;
}

export interface IHttpService {
  get(request: IHttpServiceRequest): Promise<any>;
  post(request: IHttpServiceRequest): Promise<any>;
  invoke(request: IHttpServiceRequest): Promise<any>;
}
