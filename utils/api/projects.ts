import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import axiosClient from './axios';

export default async function getProjects() {
  const projects = await axiosClient.get('/projects');
  return projects;
}

export async function getProject(projectId: string) {
  const project = await axiosClient.get(`/projects/${projectId}`);
  return project;
}

interface CreateProjectDto {
  title: string;
  desc: string;
}

export async function createProject(
  payload: CreateProjectDto,
  token: JWT | Session
) {
  const project = await axiosClient.post(
    '/projects',
    JSON.stringify({ ...payload }),
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    }
  );
  return project;
}

export async function updateProject(
  projectId: string,
  payload: Partial<CreateProjectDto>,
  token: JWT | Session
) {
  const project = await axiosClient.patch(
    `/projects/${projectId}`,
    JSON.stringify({ ...payload }),
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    }
  );

  return project;
}

export async function deleteProject(projectId: string, token: JWT | Session) {
  const project = await axiosClient.delete(`/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  });
  return project;
}

export async function leaveProject(projectId: string, token: JWT | Session) {
  const project = await axiosClient.delete(`/projects/${projectId}/leave`, {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  });
  return project;
}
