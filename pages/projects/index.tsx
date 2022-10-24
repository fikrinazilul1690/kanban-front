import Box from '@mui/material/Box';
import type { GetServerSideProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Layout from '../../components/layout/layout';
import LoadingButton from '@mui/lab/LoadingButton';
import Modal from '../../components/common/modal';
import TextField from '@mui/material/TextField';
import { useEffect, useRef, useState } from 'react';
import {
  dehydrate,
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import getProjects, { createProject } from '../../utils/fetcher/projects';
import { getToken } from 'next-auth/jwt';
import { useRouter } from 'next/router';

const Project: NextPage = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [titleErr, setTitleErr] = useState('');
  const titleRef = useRef<HTMLInputElement>();
  const descRef = useRef<HTMLInputElement>();
  const router = useRouter();
  const mutation = useMutation(createProject, {
    onSuccess: (data) => {
      setShowCreateProject(false);
      router.push(`/projects/${data.id}`);
      queryClient.invalidateQueries(['projects']);
    },
    onError: (err: any) => {
      const { title } = err.data.message;
      title && setTitleErr(title[0]);
    },
  });
  const showDialogCreateProject = () => {
    setShowCreateProject(true);
  };
  const create = async () => {
    mutation.mutate({
      payload: {
        title: titleRef.current?.value!,
        description: descRef.current?.value || undefined,
      },
      token: session,
    });
  };

  return (
    <>
      <Layout>
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LoadingButton
            variant='outlined'
            color='success'
            onClick={showDialogCreateProject}
          >
            Click here to create your Projet
          </LoadingButton>
        </Box>
      </Layout>
      <Modal
        show={showCreateProject}
        onClose={() => setShowCreateProject(false)}
        onClick={create}
        title={'Create Project'}
        description={'Please fill out the form below'}
        action={'Create'}
        colorAction={'success'}
      >
        <TextField
          margin='normal'
          required
          fullWidth
          id='title'
          label='Title'
          name='title'
          inputRef={titleRef}
          error={!!titleErr}
          helperText={titleErr}
          onFocus={() => setTitleErr('')}
        />
        <TextField
          margin='normal'
          fullWidth
          id='description'
          label='Description'
          name='description'
          inputRef={descRef}
        />
      </Modal>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();
  const token = await getToken(ctx);
  await queryClient.prefetchQuery(['projects'], () =>
    getProjects(token?.user.id)
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Project;
