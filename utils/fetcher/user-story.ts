import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import axiosClient from './axios';

interface FilterDto {
  projectId?: number;
  statusSlug?: string;
}

interface CreateUserStoryDto {
  projectId: number;
  subject: string;
  description: string | undefined;
  statusSlug: string;
}

interface ICreateUserStory {
  payload: CreateUserStoryDto;
  token: JWT | Session;
}

interface IUpdateUserStory {
  payload: Partial<Omit<CreateUserStoryDto, 'projectId'>>;
  usId: number;
  token: JWT | Session;
}

export default async function getUserStories(query: FilterDto) {
  const { projectId, statusSlug } = query;
  const userStories = await axiosClient.get(
    `/userstories?projectId=${projectId || ''}&statusSlug=${statusSlug}`
  );
  return userStories.data;
}

export async function createUserStory(props: ICreateUserStory) {
  const { payload, token } = props;
  const userStory = await axiosClient.post(
    '/userstories',
    JSON.stringify({ ...payload }),
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    }
  );

  return userStory;
}

export async function updateUserStory(props: IUpdateUserStory) {
  const { payload, usId, token } = props;
  const userStory = await axiosClient.patch<UserStory>(
    `/userstories/${usId}`,
    JSON.stringify({ ...payload }),
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    }
  );
  return userStory;
}

export async function deleteUserStory(
  props: Omit<IUpdateUserStory, 'payload'>
) {
  const { token, usId } = props;
  return await axiosClient.delete(`/userstories/${usId}`, {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  });
}
