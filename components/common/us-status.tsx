import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { NextPage } from 'next';
import IconButton from '@mui/material/IconButton';
import AddOutlined from '@mui/icons-material/AddOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import getUsStatuses, {
  createUsStatus,
  deleteUsStatus,
  updateUsStatus,
} from '../../utils/fetcher/us-status';
import RectangleIcon from '@mui/icons-material/Rectangle';
import Modal from './modal';
import Stack from '@mui/material/Stack';
import { useEffect, useRef, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useSession } from 'next-auth/react';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import {
  createUserStory,
  deleteUserStory,
  updateUserStory,
} from '../../utils/fetcher/user-story';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

interface Props {
  projectId: number;
}

const UsStatusBoard: NextPage<Props> = ({ projectId }) => {
  const nameRef = useRef<HTMLInputElement>();
  const subRef = useRef<HTMLInputElement>();
  const subEditRef = useRef<HTMLInputElement>();
  const descRef = useRef<HTMLInputElement>();
  const descEditRef = useRef<HTMLInputElement>();
  const { data: session } = useSession();
  const [colorHex, setColorHex] = useState('#A9AABC');
  const [colorErr, setColorErr] = useState('');
  const [nameErr, setNameErr] = useState('');
  const [descErr, setDescErr] = useState('');
  const [descDefault, setDescDefault] = useState('');
  const [descEditErr, setDescEditErr] = useState('');
  const [subErr, setSubErr] = useState('');
  const [subDefault, setSubDefault] = useState('');
  const [subEditErr, setSubEditErr] = useState('');
  const [isClosed, setIsClosed] = useState(false);
  const [showCreateUsStatus, setShowCreateUsStatus] = useState(false);
  const [showCreateUs, setShowCreateUs] = useState(false);
  const [showEditUs, setShowEditUs] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDeleteTask, setConfirmDeleteTask] = useState(false);
  const [usStatusId, setUsStatusId] = useState<number>();
  const [usId, setUsId] = useState<number>();
  const [statusSlug, setStatusSlug] = useState<string>('');
  const [statusSlugEdit, setStatusSlugEdit] = useState<string>();
  const queryClient = useQueryClient();
  const { data: usStatus } = useQuery<UsStatus[]>(
    ['us-status', projectId],
    () => getUsStatuses(projectId as number)
  );
  const createMutation = useMutation(createUsStatus, {
    onSuccess: () => {
      setShowCreateUsStatus(false);
      queryClient.invalidateQueries(['us-status']);
    },
    onError: (err: any) => {
      const { name, colorHex } = err.data.message;
      name && setNameErr(name[0]);
      colorHex && setColorErr(colorHex[0]);
    },
  });
  const updateMutation = useMutation(updateUsStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries(['us-status']);
    },
  });
  const updateUserStoryMutation = useMutation(updateUserStory, {
    onSuccess: () => {
      setShowEditUs(false);
      queryClient.invalidateQueries(['us-status']);
    },
    onError: (err: any) => {
      const { subject, description } = err.data.message;
      !!subject && setSubEditErr(subject[0]);
      !!description && setDescEditErr(description[0]);
    },
  });
  const deleteMutation = useMutation(deleteUsStatus, {
    onSuccess: () => {
      setConfirmDelete(false);
      queryClient.invalidateQueries(['us-status']);
    },
  });

  const deleteUserStoryMutation = useMutation(deleteUserStory, {
    onSuccess: () => {
      setConfirmDeleteTask(false);
      queryClient.invalidateQueries(['us-status']);
    },
  });

  const createUserStoryMutation = useMutation(createUserStory, {
    onSuccess: () => {
      setShowCreateUs(false);
      queryClient.invalidateQueries(['us-status']);
    },
    onError: (err: any) => {
      const { subject, description } = err.data.message;
      !!subject && setSubErr(subject[0]);
      !!description && setDescErr(description[0]);
    },
  });

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Button
          onClick={() => {
            setShowCreateUsStatus(true);
          }}
        >
          Add section
        </Button>
        <Typography variant='body2' fontWeight='700'>
          {usStatus?.length} Sections
        </Typography>
      </Box>
      <Divider sx={{ margin: '10px 0' }} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          width: 'calc(100vw - 400px)',
          height: 'calc(100vh - 300px)',
          overflowX: 'auto',
        }}
      >
        {usStatus?.map((status) => (
          <div key={status.id} style={{ width: '300px' }}>
            <Box
              sx={{
                width: '300px',
                padding: '10px',
                marginRight: '10px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <TextField
                  onBlur={(e) => {
                    updateMutation.mutate({
                      payload: {
                        name: !!e.currentTarget.value
                          ? e.currentTarget.value
                          : undefined,
                      },
                      token: session!,
                      usStatusId: status.id,
                    });
                  }}
                  placeholder={status.name}
                  variant='outlined'
                  sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-input': { padding: 0 },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'unset ',
                    },
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: `${status.colorHex}`,
                    },
                  }}
                />
                <IconButton
                  size='small'
                  sx={{
                    color: 'gray',
                    '&:hover': { color: 'green' },
                  }}
                  onClick={() => {
                    setShowCreateUs(true);
                    setStatusSlug(status.slug);
                  }}
                >
                  <AddOutlined />
                </IconButton>
                <IconButton
                  size='small'
                  sx={{
                    color: 'gray',
                    '&:hover': { color: 'red' },
                  }}
                  onClick={() => {
                    setConfirmDelete(true);
                    setUsStatusId(status.id);
                  }}
                >
                  <DeleteOutlined />
                </IconButton>
              </Box>
              {status.UserStory.map((task, index) => (
                <Card
                  sx={{
                    padding: '10px',
                    marginBottom: '10px',
                  }}
                  key={index}
                >
                  <Stack
                    direction='row'
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <Box>
                      <Typography
                        sx={{
                          textDecoration: status.isClosed
                            ? 'line-through'
                            : 'none',
                        }}
                      >
                        {task.subject}
                      </Typography>
                      <Typography
                        sx={{
                          textDecoration: status.isClosed
                            ? 'line-through'
                            : 'none',
                        }}
                        variant='body2'
                        color='text.secondary'
                      >
                        {task.description}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        sx={{
                          color: 'gray',
                          '&:hover': { color: 'orange' },
                        }}
                        onClick={() => {
                          setShowEditUs(true);
                          setSubDefault(task.subject);
                          setDescDefault(task.description ?? 'No Description');
                          setUsId(task.id);
                        }}
                      >
                        <ModeEditIcon fontSize='small' />
                      </IconButton>
                      <IconButton
                        sx={{
                          color: 'gray',
                          '&:hover': { color: 'red' },
                        }}
                        onClick={() => {
                          setConfirmDeleteTask(true);
                          setUsId(task.id);
                        }}
                      >
                        <DeleteOutlined fontSize='small' />
                      </IconButton>
                    </Box>
                  </Stack>
                </Card>
              ))}
            </Box>
          </div>
        ))}
      </Box>
      <Modal
        action='Create'
        colorAction='success'
        description='Please fill out the form below'
        onClick={() => {
          createMutation.mutate({
            payload: {
              projectId,
              isClosed,
              name: nameRef.current?.value!,
              colorHex,
            },
            token: session!,
          });
        }}
        onClose={() => {
          setShowCreateUsStatus(false);
          setColorErr('');
          setNameErr('');
        }}
        show={showCreateUsStatus}
        title='Create user story status'
      >
        <TextField
          margin='normal'
          required
          fullWidth
          id='name'
          label='Name'
          name='name'
          inputRef={nameRef}
          error={!!nameErr}
          helperText={nameErr}
          onFocus={() => setNameErr('')}
        />
        <Stack direction='row' spacing={2} alignItems={'center'}>
          <RectangleIcon
            sx={{
              color: `${colorHex}`,
              fontSize: '60px',
            }}
          />
          <TextField
            margin='normal'
            id='color'
            label='Color Hex'
            name='color'
            onChange={(e) => setColorHex(e.target.value)}
            onFocus={() => setColorErr('')}
            error={!!colorErr}
            helperText={colorErr}
          />
        </Stack>
        <FormControlLabel
          control={
            <Checkbox
              checked={isClosed}
              onChange={() => setIsClosed((value) => !value)}
              name='isClosed'
            />
          }
          label='isClosed'
        />
      </Modal>
      <Modal
        show={confirmDelete}
        title='Delete Status Board'
        action='Delete'
        colorAction='error'
        description='All tasks in this status board will be deleted'
        onClick={() => {
          deleteMutation.mutate({
            token: session!,
            usStatusId: usStatusId!,
          });
        }}
        onClose={() => setConfirmDelete(false)}
      >
        <Typography>Are you sure want to delete this Board ?</Typography>
      </Modal>
      <Modal
        show={showCreateUs}
        title='Create Task'
        action='Create'
        colorAction='success'
        description='Please fill out the form below'
        onClick={() => {
          createUserStoryMutation.mutate({
            token: session!,
            payload: {
              projectId,
              subject: subRef.current?.value!,
              description: descRef.current?.value! || undefined,
              statusSlug,
            },
          });
        }}
        onClose={() => {
          setShowCreateUs(false);
          setSubErr('');
          setDescErr('');
        }}
      >
        <TextField
          margin='normal'
          required
          fullWidth
          id='subject'
          label='Subject'
          name='subject'
          inputRef={subRef}
          error={!!subErr}
          helperText={subErr}
          onFocus={() => {
            setSubErr('');
            setDescErr('');
          }}
        />
        <TextField
          margin='normal'
          fullWidth
          id='description'
          label='Description'
          name='description'
          inputRef={descRef}
          error={!!descErr}
          helperText={descErr}
          onFocus={() => {
            setSubErr('');
            setDescErr('');
          }}
        />
      </Modal>
      <Modal
        show={confirmDeleteTask}
        title='Delete Task'
        action='Delete'
        colorAction='error'
        description='Task will be deleted'
        onClick={() => {
          deleteUserStoryMutation.mutate({
            token: session!,
            usId: usId!,
          });
        }}
        onClose={() => setConfirmDeleteTask(false)}
      >
        <Typography>Are you sure want to delete this Task ?</Typography>
      </Modal>
      <Modal
        show={showEditUs}
        title='Edit Task'
        action='Edit'
        colorAction='success'
        description=''
        onClick={() => {
          updateUserStoryMutation.mutate({
            token: session!,
            usId: usId!,
            payload: {
              statusSlug: !!statusSlugEdit ? statusSlugEdit : undefined,
              description: !!descEditRef.current?.value
                ? descEditRef.current?.value
                : undefined,
              subject: !!subEditRef.current?.value
                ? subEditRef.current?.value
                : undefined,
            },
          });
        }}
        onClose={() => {
          setShowEditUs(false);
          setSubEditErr('');
          setDescEditErr('');
          setStatusSlugEdit('');
        }}
      >
        <TextField
          margin='normal'
          fullWidth
          id='subject'
          label='Subject'
          placeholder={subDefault}
          name='subject'
          inputRef={subEditRef}
          error={!!subEditErr}
          helperText={subEditErr}
          onFocus={() => {
            setSubEditErr('');
            setDescEditErr('');
          }}
        />
        <TextField
          margin='normal'
          fullWidth
          id='description'
          placeholder={descDefault}
          label='Description'
          name='description'
          inputRef={descEditRef}
          error={!!descEditErr}
          helperText={descEditErr}
          onFocus={() => {
            setSubEditErr('');
            setDescEditErr('');
          }}
        />
        <FormControl sx={{ minWidth: 120 }} size='small'>
          <InputLabel id='select-status-label'>Status</InputLabel>
          <Select
            labelId='select-status-label'
            id='select-status'
            value={statusSlugEdit}
            label='Status'
            onChange={(e) => {
              setStatusSlugEdit(e.target.value);
            }}
          >
            {usStatus?.map((status) => (
              <MenuItem key={status.id} value={status.slug}>
                {status.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Modal>
    </>
  );
};

export default UsStatusBoard;
