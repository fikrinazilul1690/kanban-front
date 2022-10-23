import axiosClient from './axios';

export default async function register(data: Props) {
  const response = await axiosClient.post(
    '/auth/register',
    JSON.stringify({
      ...data,
    })
  );

  return response.data;
}

export async function revoke(rt: string | undefined) {
  const response = await axiosClient.patch(
    '/auth/revoke',
    JSON.stringify({
      rt,
    })
  );

  return response;
}

export interface Props {
  firstName: FormDataEntryValue | null;
  lastName: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
  confirmPassword: FormDataEntryValue | null;
}
