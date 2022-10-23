import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import axiosClient from './axios';

export default async function getProjects(userId?: string | undefined) {
  const projects = await axiosClient.get<Project[]>(
    `/projects?userId=${userId || ''}`
  );
  return projects.data;
}

export async function getProject(projectId: number) {
  const project = await axiosClient.get(`/projects/${projectId}`);
  return project.data;
}

interface CreateProjectDto {
  title: string;
  description?: string;
}

interface ICreateProject {
  payload: CreateProjectDto;
  token: JWT | Session | null;
}

export async function createProject(props: ICreateProject) {
  const { payload, token } = props;
  const project = await axiosClient.post(
    '/projects',
    JSON.stringify({ ...payload }),
    {
      headers: {
        Authorization: `Bearer ${token?.accessToken}`,
      },
    }
  );
  return project.data;
}

interface IUpdateProject {
  projectId: number;
  payload: Partial<CreateProjectDto>;
  token: JWT | Session;
}

export async function updateProject(props: IUpdateProject) {
  const { projectId, payload, token } = props;
  const project = await axiosClient.patch(
    `/projects/${projectId}`,
    JSON.stringify({ ...payload }),
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    }
  );

  return project.data;
}

interface IDelete {
  projectId: number;
  token: JWT | Session;
}

export async function deleteProject(props: IDelete) {
  const { projectId, token } = props;
  const project = await axiosClient.delete(`/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  });
  return project.data;
}

export async function leaveProject(props: IDelete) {
  const { projectId, token } = props;
  const project = await axiosClient.delete(`/projects/${projectId}/leave`, {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  });
  return project.data;
}
