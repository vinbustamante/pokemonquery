import { injectable, inject } from "inversify";
import { IHttpService, IHttpServiceRequest } from "../IHttpService";
import { HttpMethodEnum } from "../../enum/HttpMethodEnum";
import { AccessSecurityServiceException } from "../exception/AccessSecurityServiceException";
import { ServerOveraCapacityException } from "../exception/ServerOveraCapacityException";
import { RemoteServiceException } from "../exception/RemoteServiceException";
import { types as serviceCommonTypes } from "../types";

@injectable()
export class HttpService implements IHttpService {
  @inject(serviceCommonTypes.RequestLib)
  private readonly _requestLib: any;

  get(httpRequest: IHttpServiceRequest): Promise<any> {
    httpRequest.method = HttpMethodEnum.get;
    return this.invoke(httpRequest);
  }

  post(httpRequest: IHttpServiceRequest): Promise<any> {
    httpRequest.method = HttpMethodEnum.post;
    return this.invoke(httpRequest);
  }

  invoke(httpRequest: IHttpServiceRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      let requestPayload = {
        url: httpRequest.url,
        headers: undefined,
        method: httpRequest.method || HttpMethodEnum.post,
        json: true,
        body: undefined,
        qs: undefined
      };
      if (requestPayload.method === HttpMethodEnum.post) {
        requestPayload.body = httpRequest.data || {};
      } else {
        requestPayload.qs = httpRequest.data || {};
      }
      requestPayload.headers = httpRequest.header;
      this._requestLib(requestPayload, function(error, response, body) {
        if (error) {
          const message = error.messsage;
          reject(new RemoteServiceException(message));
        } else {
          let status = parseInt(response.statusCode);
          if (status >= 200 && status < 300) {
            resolve({
              status: status,
              headers: response.headers,
              response: body
            });
          } else if (status === 401) {
            reject(new AccessSecurityServiceException(body));
          } else if (status === 503) {
            reject(new ServerOveraCapacityException("Server over capacity."));
          } else {
            reject(
              new RemoteServiceException(
                body || "HttpService error contacting the remote server"
              )
            );
          }
        }
      });
    });
  }
}
