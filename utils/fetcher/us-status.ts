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

interface IUpdateUsStatus {
  payload: Partial<Omit<CreateUsStatusDto, 'projectId'>>;
  usStatusId: number;
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

export async function updateUsStatus(props: IUpdateUsStatus) {
  const { payload, usStatusId, token } = props;
  const usStatus = await axiosClient.patch<UsStatus>(
    `/userstory-statuses/${usStatusId}`,
    JSON.stringify({ ...payload }),
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    }
  );
}

export async function deleteUsStatus(props: Omit<IUpdateUsStatus, 'payload'>) {
  const { token, usStatusId } = props;
  return await axiosClient.delete(`/userstory-statuses/${usStatusId}`, {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  });
}
