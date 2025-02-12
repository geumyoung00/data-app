import { createContext } from 'react';

export interface AuthContextType {
  userSeq: string;
  name: string;
  role: string;
}

const authContext = createContext<AuthContextType>({
  userSeq: '',
  name: '',
  role: '',
});

export { authContext };
