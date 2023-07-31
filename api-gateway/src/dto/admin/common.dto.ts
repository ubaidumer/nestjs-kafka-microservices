// fields to be present in a response body
export class ResponseDTO {
  code: number;
  isSuccess: Boolean;
  body: Object;
  message: String;
  timestamp: Date;
}
