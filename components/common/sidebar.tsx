import { FC, useEffect, useRef, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import LogoutOutlined from '@mui/icons-material/LoginOutlined';
import { revoke } from '../../utils/fetcher/auth';
import ListItem from '@mui/material/ListItem';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ListItemButton from '@mui/material/ListItemButton';
import getProjects, { createProject } from '../../utils/fetcher/projects';
import Link from 'next/link';
import TextField from '@mui/material/TextField';
import Modal from './modal';
import { useRouter } from 'next/router';
import { AddBoxOutlined } from '@mui/icons-material';

interface Props {}

const logout = async (rt: string | undefined) => {
  await signOut();
  await revoke(rt);
};

const Sidebar: FC<Props> = ({}) => {
  const { data: session } = useSession();
  const user = session?.user;
  const sidebarWidth = 250;
  const queryClient = useQueryClient();
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [titleErr, setTitleErr] = useState('');
  const titleRef = useRef<HTMLInputElement>();
  const descRef = useRef<HTMLInputElement>();
  const router = useRouter();
  const mutation = useMutation(createProject, {
    onSuccess: (data) => {
      setShowCreateProject(false);
      console.log(data);
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

  const { data: projects } = useQuery<Project[], Error>(
    ['projects'],
    async () => await getProjects(user?.id)
  );

  return (
    <>
      <Drawer
        variant='permanent'
        open={true}
        sx={{
          width: sidebarWidth,
          height: '100%',
          '& > div': { borderRight: 'none' },
        }}
      >
        <List
          disablePadding
          sx={{
            width: sidebarWidth,
            height: '100vh',
            backgroundColor: '#292929',
          }}
        >
          <ListItem>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant='body2' fontWeight={700}>
                {user?.fullName}
              </Typography>
              <IconButton onClick={() => logout(session?.refreshToken)}>
                <LogoutOutlined fontSize='small' />
              </IconButton>
            </Box>
          </ListItem>
          <Box sx={{ paddingTop: '10px' }}>
            <ListItem>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant='body2' fontWeight={700}>
                  Projects
                </Typography>
                <IconButton onClick={showDialogCreateProject}>
                  <AddBoxOutlined fontSize='small' />
                </IconButton>
              </Box>
            </ListItem>
            {projects?.map((project) => (
              <ListItemButton
                key={project.id}
                sx={{
                  pl: '20px',
                }}
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <Typography
                  variant='body2'
                  fontWeight='700'
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {project.title}
                </Typography>
              </ListItemButton>
            ))}
          </Box>
        </List>
      </Drawer>
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

export default Sidebar;
