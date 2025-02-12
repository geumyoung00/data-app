import { createContext } from 'react';

export type mngType = {
  id: string;
  name: string;
  seq?: string;
  isEdit?: boolean;
};

interface mngContextType {
  agencies: mngType[];
  collectItems: mngType[];
  fetchItems: (path: string) => Promise<void>;
  addItem: (path: string, item: mngType) => void;
  removeItem: (path: string, items: string[]) => void;
  updateItem: (path: string, item: mngType) => void;
}

const mngContext = createContext<mngContextType>({
  agencies: [],
  collectItems: [],
  fetchItems: async (path) => {},
  addItem: (path, item) => {},
  removeItem: (path, items) => {},
  updateItem: (path, item) => {},
});

export { mngContext };
