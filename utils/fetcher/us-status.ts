import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import axiosClient from './axios';

export default async function getUsStatuses(projectId?: number | undefined) {
  const usStatuses = await axiosClient.get<UsStatus[]>(
    `/userstory-statuses?projectId=${projectId || ''}`
  );
  return usStatuses.data;
}

interface CreateUsStatusDto {
  projectId: number;
  name: string;
  isClosed: boolean;
  colorHex: string;
}

interface ICreateUsStatus {
  payload: CreateUsStatusDto;
  token: JWT | Session;
}

export async function createUsStatus(props: ICreateUsStatus) {
  const { payload, token } = props;
  const usStatus = await axiosClient.post<UsStatus>(
    `/userstory-statuses`,
    JSON.stringify({ ...payload }),
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    }
  );

  return usStatus;
}
