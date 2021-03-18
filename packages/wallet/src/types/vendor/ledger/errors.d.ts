declare interface U2FError {
  metaData: {
    type: string;
    code: number;
  };
}

declare interface ErrorWithId {
  id: string;
  message: string;
  name: string;
  stack: string;
}
