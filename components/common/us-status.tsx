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
import getUsStatuses, { createUsStatus } from '../../utils/fetcher/us-status';
import RectangleIcon from '@mui/icons-material/Rectangle';
import Modal from './modal';
import Stack from '@mui/material/Stack';
import { useRef, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useSession } from 'next-auth/react';

interface Props {
  projectId: number;
}

const UsStatusBoard: NextPage<Props> = ({ projectId }) => {
  const nameRef = useRef<HTMLInputElement>();
  const { data: session } = useSession();
  const [colorHex, setColorHex] = useState('#A9AABC');
  const [isClosed, setIsClosed] = useState(false);
  const [showCreateUsStatus, setShowCreateUsStatus] = useState(false);
  const [statusName, setStatusName] = useState('');
  const queryClient = useQueryClient();
  const { data: usStatus } = useQuery<UsStatus[]>(['us-status'], () =>
    getUsStatuses(projectId as number)
  );
  const postUsStatus = useMutation(createUsStatus, {
    onSuccess: () => {
      setShowCreateUsStatus(false);
      queryClient.invalidateQueries(['us-status']);
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
                    console.log(e.currentTarget.value);
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
                  onClick={() => {}}
                >
                  <AddOutlined />
                </IconButton>
                <IconButton
                  size='small'
                  sx={{
                    color: 'gray',
                    '&:hover': { color: 'red' },
                  }}
                  onClick={() => {}}
                >
                  <DeleteOutlined />
                </IconButton>
              </Box>
              {/* {section.tasks.map((task, index) => (
                <Card
                  sx={{
                    padding: '10px',
                    marginBottom: '10px',
                  }}
                  key={index}
                  onClick={() => {}}
                >
                  <Typography>
                    {task.title === '' ? 'Untitled' : task.title}
                  </Typography>
                </Card>
              ))} */}
            </Box>
          </div>
        ))}
      </Box>
      {/* <TaskModal
        task={selectedTask}
        boardId={boardId}
        onClose={() => setSelectedTask(undefined)}
        onUpdate={onUpdateTask}
        onDelete={onDeleteTask}
      /> */}
      <Modal
        action='Create'
        colorAction='success'
        description='Please fill out the form below'
        onClick={() => {
          postUsStatus.mutate({
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
            required
            id='color'
            label='Color Hex'
            name='color'
            onChange={(e) => setColorHex(e.target.value)}
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
    </>
  );
};

export default UsStatusBoard;
