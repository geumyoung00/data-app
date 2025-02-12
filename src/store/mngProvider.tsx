'use client';

import { useCallback, useReducer, ReactNode } from 'react';
import { mngContext, mngType } from './mag-context';

interface mngState {
  agencies: mngType[];
  collectItems: mngType[];
}

interface mngAction {
  type: 'FETCH' | 'ADD' | 'REMOVE' | 'UPDATE';
  data: 'AGENCIES' | 'COLLECTITEMS';
  payload?: any;
}

const mngReducer = (state: mngState, action: mngAction) => {
  let existingAgencies = [...state.agencies];
  let existingCollectItems = [...state.collectItems];

  switch (action.type) {
    case 'FETCH':
      if (action.data === 'AGENCIES') {
        return { ...state, agencies: action.payload };
      } else if (action.data === 'COLLECTITEMS') {
        return { ...state, collectItems: action.payload };
      }

    case 'ADD':
      const newData = action.payload;
      if (action.data === 'AGENCIES') {
        return { ...state, agencies: [...existingAgencies, newData] };
      } else if (action.data === 'COLLECTITEMS') {
        return { ...state, collectItems: [...existingCollectItems, newData] };
      }

    case 'REMOVE':
      const itemsToRemove = action.payload;
      if (action.data === 'AGENCIES') {
        const removedAgencies = existingAgencies.filter(
          (item) => !itemsToRemove.includes(item.seq)
        );
        return { ...state, agencies: removedAgencies };
      } else if (action.data === 'COLLECTITEMS') {
        const removedCollectItems = existingCollectItems.filter(
          (item) => !itemsToRemove.includes(item.seq)
        );

        return { ...state, collectItems: removedCollectItems };
      }

    case 'UPDATE':
      if (action.data === 'AGENCIES') {
        return { ...state, agencies: existingAgencies };
      } else if (action.data === 'COLLECTITEMS') {
        return { ...state, collectItems: existingCollectItems };
      }
      return { ...state };

    default:
      return state;
  }
};

const MngProvider = ({ children }: { children: ReactNode }) => {
  const [mngState, dispatchMng] = useReducer(mngReducer, {
    agencies: [],
    collectItems: [],
  });

  const fetchItemHandler = useCallback(async (path: string) => {
    try {
      const response = await fetch(
        `http://elecocean.iptime.org:8061/api/${path}`
      );
      const results = await response.json();

      if (path === 'agencies') {
        dispatchMng({ type: 'FETCH', data: 'AGENCIES', payload: results });
        return;
      } else if (path === 'getDataType') {
        dispatchMng({
          type: 'FETCH',
          data: 'COLLECTITEMS',
          payload: results,
        });
        return;
      }
    } catch (error) {
      console.error('faild to FETCH data', error);
    }
  }, []);

  const addItemHandler = useCallback(async (path: string, item: mngType) => {
    const { name, id } = item;
    const addDataOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, id }),
    };

    try {
      const result = await fetch(
        `http://elecocean.iptime.org:8061/api/${path}`,
        addDataOptions
      ).then((res) => res.json());

      const { seq } = result;

      const actionMap = {
        agencies: 'AGENCIES',
        getDataType: 'COLLECTITEMS',
      } as const;

      const actionData = actionMap[path as keyof typeof actionMap];
      if (actionData) {
        dispatchMng({
          type: 'ADD',
          data: actionData,
          payload: { ...item, seq },
        });
      }
    } catch (error) {
      console.error('Failed to POST data', error);
    }
  }, []);

  const removeItemHandler = useCallback(
    async (path: string, items: string[]) => {
      const deleteDataOptions = { method: 'DELETE' };
      const endPoint = items.join(',');

      try {
        const result = await fetch(
          `http://elecocean.iptime.org:8061/api/${path}/${endPoint}`,
          deleteDataOptions
        ).then((res) => res.json());

        if (result.status === 'error') {
          alert(`이미 사용 중인 데이터가 포함되어 있습니다.`);
          return;
        }

        const actionMap = {
          agencies: 'AGENCIES',
          getDataType: 'COLLECTITEMS',
        } as const;

        const actionData = actionMap[path as keyof typeof actionMap];

        if (actionData) {
          dispatchMng({
            type: 'REMOVE',
            data: actionData,
            payload: items,
          });
        }
      } catch (error) {
        console.error('Failed to REMOVE data', error);
      }
    },
    []
  );

  const updateItemHandler = useCallback(async (path: string, item: mngType) => {
    const SaveDataOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, name: item.name, seq: item.seq }),
    };

    await fetch(
      `http://elecocean.iptime.org:8061/api/${path}/${item.seq}`,
      SaveDataOptions
    ).then((res) => res.json());

    const actionMap = {
      agencies: 'AGENCIES',
      getDataType: 'COLLECTITEMS',
    } as const;

    const actionData = actionMap[path as keyof typeof actionMap];

    if (actionData) {
      dispatchMng({
        type: 'UPDATE',
        data: actionData,
        payload: item,
      });
    }
  }, []);

  const value = {
    agencies: mngState.agencies,
    collectItems: mngState.collectItems,
    fetchItems: fetchItemHandler,
    addItem: addItemHandler,
    removeItem: removeItemHandler,
    updateItem: updateItemHandler,
  };

  return <mngContext.Provider value={value}>{children}</mngContext.Provider>;
};

export { MngProvider };
