import { LoadingButton } from '@mui/lab';
import { Box, TextField, Button } from '@mui/material';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import Layout from '../components/layout/layout';
import axiosClient from '../utils/api/axios';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';

interface Props {}

const Signup: NextPage<Props> = ({}) => {
  const { status } = useSession();
  const [confirmPwdErr, setConfirmPwdErr] = useState('');
  const [pwdErr, setPwdErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [conflict, setConflict] = useState('');
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setConfirmPwdErr('');
    setPwdErr('');
    setEmailErr('');
    setConflict('');

    const data = new FormData(e.currentTarget);
    console.log(data);
    const email = data.get('email');
    const password = data.get('password');
    const confirmPassword = data.get('confirmPassword');
    if (confirmPassword === '') {
      setConfirmPwdErr('confirm password should not be empty');
    }
    if (password !== confirmPassword) {
      setConfirmPwdErr('must match with Password Field');
      return;
    }
    await axiosClient
      .post(
        '/users/register',
        JSON.stringify({
          email,
          password,
        })
      )
      .then(() => router.push('/login'))
      .catch((err) => {
        if (err.status === 400) {
          const { email, password } = err.data.error;
          email && setEmailErr(email[0]!);
          password && setPwdErr(password[0]!);
        }
        if (err.status === 409) {
          console.log(err.data.message);
          setConflict(err.data.message);
        }
      });
  };

  useEffect(() => {
    setConfirmPwdErr('');
    setConflict('');
    setEmailErr('');
    setPwdErr('');

    return () => {
      setConfirmPwdErr('');
      setConflict('');
      setEmailErr('');
      setPwdErr('');
    };
  }, []);

  return (
    <Layout>
      <Box component={'h2'}>Kanban</Box>
      {!!conflict && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert severity='error' variant='outlined'>
            <AlertTitle>Error</AlertTitle>
            <strong>{conflict}</strong>
          </Alert>
        </Stack>
      )}
      <Box component={'form'} sx={{ mt: 1 }} onSubmit={handleSubmit} noValidate>
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
          error={confirmPwdErr !== pwdErr}
          helperText={confirmPwdErr}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant='outlined'
          color='success'
          type='submit'
          fullWidth
          loading={status === 'loading'}
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
    </Layout>
  );
};

export default Signup;
