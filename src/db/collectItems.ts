export type collectItemsType = {
  id: string;
  name: string;
};

export async function fetchCollectItems() {
  const response = await fetch(
    'http://elecocean.iptime.org:8061/api/getDataType',
    {
      cache: 'no-store',
    }
  );
  return response.json();
}
