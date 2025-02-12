export type agencyType = {
  id: string;
  name: string;
  seq?: string;
};

export async function fetchAgencies() {
  const response = await fetch(
    'http://elecocean.iptime.org:8061/api/agencies',
    {
      cache: 'no-store',
    }
  );
  return response.json();
}
