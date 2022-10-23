import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/system/Box';
import { GetServerSideProps, NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';
import { getCsrfToken } from 'next-auth/react';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useRouter } from 'next/router';
import { getToken } from 'next-auth/jwt';
import BaseLayout from '../components/layout/base-layout';

interface Props {
  csrfToken: string;
}

const Login: NextPage<Props> = ({ csrfToken }) => {
  const { status } = useSession();
  const [err, setErr] = useState('');
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr('');

    const data = new FormData(e.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: `${router.query.callbackUrl || '/projects'}`,
    });

    if (res?.status === 401) {
      setErr(res.error!);
    }

    if (res?.ok) {
      router.push(res.url!);
    }
  };
  if (status === 'loading') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size={100} />
      </Box>
    );
  }
  return (
    <BaseLayout>
      <Box component={'h2'}>Kanban</Box>
      {!!err && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert severity='error' variant='outlined'>
            <AlertTitle>Error</AlertTitle>
            <strong>{err}</strong>
          </Alert>
        </Stack>
      )}
      <Box component={'form'} sx={{ mt: 1 }} onSubmit={handleSubmit}>
        <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
        <TextField
          margin='normal'
          required
          fullWidth
          id='email'
          label='Email'
          name='email'
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='password'
          label='Password'
          name='password'
          type={'password'}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant='outlined'
          color='success'
          type='submit'
          fullWidth
        >
          Login
        </LoadingButton>
      </Box>
      <Link href={'/signup'} passHref>
        <Button
          LinkComponent={'a'}
          sx={{
            textTransform: 'none',
          }}
        >
          Don&apos;t have an account? Signup
        </Button>
      </Link>
    </BaseLayout>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const csrfToken = await getCsrfToken(ctx);
  const token = await getToken(ctx);
  if (token) {
    return {
      redirect: { destination: '/projects', permanent: false },
      props: {},
    };
  }
  return {
    props: { csrfToken },
  };
};
