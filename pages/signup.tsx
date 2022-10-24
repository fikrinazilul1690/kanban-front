import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { GetServerSideProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FormEvent, useEffect, useReducer } from 'react';
import Layout from '../components/layout/layout';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';
import register from '../utils/fetcher/auth';
import { useMutation } from '@tanstack/react-query';
import BaseLayout from '../components/layout/base-layout';
import { getToken } from 'next-auth/jwt';

interface Props {}

const initialState = {
  firstNameErr: '',
  lastNameErr: '',
  emailErr: '',
  pwdErr: '',
  confirmPwdErr: '',
  conflictErr: '',
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'BAD_REQUEST':
      return {
        ...state,
        firstNameErr: action.payload?.firstName,
        lastNameErr: action.payload?.lastName,
        emailErr: action.payload?.email,
        pwdErr: action.payload?.password,
        confirmPwdErr: action.payload?.confirmPassword,
      };
    case 'CONFLICT':
      return {
        ...state,
        conflictErr: action.payload,
      };
    case 'RESET':
      return {
        ...state,
        firstNameErr: '',
        lastNameErr: '',
        emailErr: '',
        pwdErr: '',
        confirmPwdErr: '',
        conflictErr: '',
      };
    default:
      throw new Error();
  }
};

const Signup: NextPage<Props> = ({}) => {
  const { status, data: session } = useSession();
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  const mutation = useMutation(register);

  const {
    firstNameErr,
    lastNameErr,
    emailErr,
    pwdErr,
    confirmPwdErr,
    conflictErr,
  } = state;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: 'RESET' });

    const data = new FormData(e.currentTarget);
    const firstName = data.get('firstname');
    const lastName = data.get('lastname');
    const email = data.get('email');
    const password = data.get('password');
    const confirmPassword = data.get('confirmPassword');

    mutation.mutate(
      {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      },
      {
        onError: (error: any) => {
          if (error.status === 400) {
            const { firstName, lastName, email, password, confirmPassword } =
              error.data.message;
            dispatch({
              type: 'BAD_REQUEST',
              payload: {
                firstName: !!firstName ? firstName[0] : '',
                lastName: !!lastName ? lastName[0] : '',
                email: !!email ? email[0] : '',
                password: !!password ? password[0] : '',
                confirmPassword: !!confirmPassword ? confirmPassword[0] : '',
              },
            });
          }
          if (error.status === 409) {
            dispatch({
              type: 'CONFLICT',
              payload: 'Email already used!',
            });
          }
        },
        onSuccess: () => {
          router.push('/login');
        },
      }
    );
  };

  return (
    <BaseLayout>
      <Box component={'h2'}>Kanban</Box>
      {!!conflictErr && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert severity='error' variant='outlined'>
            <AlertTitle>Error</AlertTitle>
            <strong>{conflictErr}</strong>
          </Alert>
        </Stack>
      )}
      <Box component={'form'} sx={{ mt: 1 }} onSubmit={handleSubmit} noValidate>
        <TextField
          margin='normal'
          required
          fullWidth
          id='firstname'
          label='First Name'
          name='firstname'
          disabled={status === 'loading'}
          error={!!firstNameErr}
          helperText={firstNameErr}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='lastname'
          label='Last Name'
          name='lastname'
          disabled={status === 'loading'}
          error={!!lastNameErr}
          helperText={lastNameErr}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='email'
          label='Email'
          name='email'
          disabled={status === 'loading'}
          error={!!emailErr}
          helperText={emailErr}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='password'
          label='Password'
          name='password'
          type={'password'}
          disabled={status === 'loading'}
          error={!!pwdErr}
          helperText={pwdErr}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='confirmPassword'
          label='Confirm Password'
          name='confirmPassword'
          type={'password'}
          disabled={status === 'loading'}
          error={!!confirmPwdErr}
          helperText={confirmPwdErr}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant='outlined'
          color='success'
          type='submit'
          fullWidth
          loading={mutation.isLoading}
        >
          Sign Up
        </LoadingButton>
      </Box>
      <Link href={'/login'} passHref>
        <Button
          LinkComponent={'a'}
          sx={{
            textTransform: 'none',
          }}
        >
          Already have an account? Login
        </Button>
      </Link>
    </BaseLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = await getToken(ctx);
  if (token) {
    return {
      redirect: {
        destination: '/projects',
        permanent: true,
      },
    };
  }
  return {
    props: {},
  };
};

export default Signup;
