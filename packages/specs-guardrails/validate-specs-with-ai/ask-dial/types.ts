export interface DialResponse {
  error?: {
    message?: string;
  };
  choices?: {
    message?: {
      content?: string;
    };
  }[];
}
