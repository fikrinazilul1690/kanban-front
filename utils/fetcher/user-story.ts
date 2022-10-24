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
}
