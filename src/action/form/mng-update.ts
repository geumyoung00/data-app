'use server';

type mngDataType = {
  id: string;
  name: string;
  isEdit: boolean;
};

type mngUpdateDataType = {
  type: string;
  data: string;
  item: { id: string; name: string };
};

export type mngRemoveDataType = {
  type: string;
  data: string;
  item: string[];
};

async function agenciesUpdateHandler(
  el: mngUpdateDataType | mngRemoveDataType
) {
  if (el.type === 'add') {
    const { item } = el as mngUpdateDataType;

    const addDataOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: item.name, id: item.id }),
    };

    await fetch(
      `http://elecocean.iptime.org:8061/api/${el.data}`,
      addDataOptions
    ).then((res) => res.json());
  }

  if (el.type === 'delete') {
    const deleteDataOptions = { method: 'DELETE' };
    let deleteItem: string[] = [...(el.item as string[])];
    if (deleteItem.length === 1) {
      await fetch(
        `http://elecocean.iptime.org:8061/api/${el.data}/${deleteItem[0]}`,
        deleteDataOptions
      )
        .then((res) => res.json())
        .then(() => {});
      return;
    } else {
      deleteItem.forEach((n: any) => {
        fetch(
          `http://elecocean.iptime.org:8061/api/${el.data}/${n}`,
          deleteDataOptions
        )
          .then((res) => res.json())
          .then(() => {});
      });
    }
  }

  if (el.type === 'save') {
    const { item } = el as mngUpdateDataType;

    const SaveDataOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, name: item.name }),
    };

    await fetch(
      `http://elecocean.iptime.org:8061/api/${el.data}/${item.id}`,
      SaveDataOptions
    )
      .then((res) => res.json())
      .then(() => {});
  }
}

export { agenciesUpdateHandler };
export type { mngDataType, mngUpdateDataType };
