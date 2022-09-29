import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/system';
import { GetServerSideProps, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Layout from '../components/layout/layout';
import { getCsrfToken } from 'next-auth/react';
import Button from '@mui/material/Button';
import Link from 'next/link';

interface Props {
  csrfToken: string;
}

const Login: NextPage<Props> = ({ csrfToken }) => {
  const { status } = useSession();
  return (
    <Layout>
      <Box
        component={'form'}
        sx={{ mt: 1 }}
        method='post'
        action='/api/auth/callback/credentials'
      >
        <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
        <TextField
          margin='normal'
          required
          fullWidth
          id='email'
          label='Email'
          name='email'
          disabled={status === 'loading'}
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
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant='outlined'
          color='success'
          type='submit'
          fullWidth
          loading={status === 'loading'}
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
    </Layout>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const csrfToken = await getCsrfToken(ctx);
  return {
    props: { csrfToken },
  };
};
