export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export const MONGO_ERROR_CODES = {
  duplicated_key: 11000
}