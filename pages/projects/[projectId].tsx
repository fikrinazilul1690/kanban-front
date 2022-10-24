import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
  dehydrate,
  QueryClient,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { GetServerSideProps, NextPage } from 'next';
import { getToken } from 'next-auth/jwt';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useEffect, useState } from 'react';
import Modal from '../../components/common/modal';
import UsStatusBoard from '../../components/common/us-status';
import Layout from '../../components/layout/layout';
import getProjects, {
  deleteProject,
  getProject,
  updateProject,
} from '../../utils/fetcher/projects';
import getUsStatuses from '../../utils/fetcher/us-status';

interface Props {}
const ProjectBoard: NextPage<Props> = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { projectId } = router.query;
  const queryClient = useQueryClient();
  const { data: project } = useQuery<Project>(['project'], () =>
    getProject(+projectId!)
  );

  const [titleErr, setTitleErr] = useState('');
  const [descErr, setDescErr] = useState('');
  const [title, setTitle] = useState(project?.title);
  const [description, setDescription] = useState(project?.description);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTitle(project?.title);
    setDescription(project?.description);

    return () => {
      setTitle('');
      setDescription('');
    };
  }, [project]);

  const update = useMutation(updateProject, {
    onSuccess: () => {
      queryClient.invalidateQueries(['project']);
      queryClient.invalidateQueries(['projects']);
    },
    onError: (err: any) => {
      const { title, description } = err.data.message;
      title && setTitleErr(title[0]);
      description && setDescErr(description[0]);
    },
  });

  const removeProject = useMutation(deleteProject, {
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
    },
    onError: () => {
      setOpen(true);
    },
  });

  const removeAction = () => {
    removeProject.mutate({ projectId: project?.id!, token: session! });
    setConfirmDelete(false);
    router.replace('/projects');
  };

  return (
    <>
      <Layout>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end',
            width: '100%',
          }}
        >
          {
            <Collapse in={open} sx={{ width: '100%' }}>
              <Stack spacing={2}>
                <Alert
                  onClose={() => {
                    setOpen(false);
                  }}
                  severity={'error'}
                >
                  Delete Failed!
                </Alert>
              </Stack>
            </Collapse>
          }
          <IconButton color='error' onClick={() => setConfirmDelete(true)}>
            <DeleteOutlined />
          </IconButton>
        </Box>
        <Box sx={{ padding: '10px 50px' }}>
          <Box>
            <TextField
              value={title ?? undefined}
              placeholder='Untitled'
              variant='outlined'
              fullWidth
              error={!!titleErr}
              helperText={titleErr}
              sx={{
                '& .MuiOutlinedInput-input': { padding: 0 },
                '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                '& .MuiOutlinedInput-root': {
                  fontSize: '2rem',
                  fontWeight: '700',
                },
              }}
              onBlur={(e) =>
                update.mutate({
                  payload: { title: e.target.value },
                  projectId: project?.id!,
                  token: session!,
                })
              }
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              onFocus={() => setTitleErr('')}
            />
            <TextField
              value={description ?? undefined}
              placeholder='Add a description'
              variant='outlined'
              fullWidth
              error={!!descErr}
              helperText={descErr}
              onBlur={(e) =>
                update.mutate({
                  payload: { description: e.target.value },
                  projectId: project?.id!,
                  token: session!,
                })
              }
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              onFocus={() => setDescErr('')}
              sx={{
                '& .MuiOutlinedInput-input': { padding: 0 },
                '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                '& .MuiOutlinedInput-root': { fontSize: '0.8rem' },
              }}
            />
          </Box>
          <Box>
            <UsStatusBoard projectId={project?.id!} />
          </Box>
        </Box>
      </Layout>
      <Modal
        show={confirmDelete}
        title='Delete Project'
        action='Delete'
        colorAction='error'
        description='All tasks in this project will be deleted'
        onClick={removeAction}
        onClose={() => setConfirmDelete(false)}
      >
        <Typography>
          Are you sure want to delete Project: {project?.title} ?
        </Typography>
      </Modal>
    </>
  );
};

export default ProjectBoard;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();
  const { projectId } = ctx.params as IParams;
  const token = await getToken(ctx);
  await queryClient.prefetchQuery(['projects'], () =>
    getProjects(token?.user.id)
  );
  await queryClient.prefetchQuery(['project'], () => getProject(+projectId));
  await queryClient.prefetchQuery(['us-status'], () =>
    getUsStatuses(+projectId)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

interface IParams extends ParsedUrlQuery {
  projectId: string;
}
