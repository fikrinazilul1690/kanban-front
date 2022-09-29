import { LoadingButton } from '@mui/lab';
import { Box, TextField, Button } from '@mui/material';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Layout from '../components/layout/layout';

interface Props {}

const Signup: NextPage<Props> = ({}) => {
  const { status } = useSession();
  return (
    <Layout>
      <Box component={'form'} sx={{ mt: 1 }}>
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
        <TextField
          margin='normal'
          required
          fullWidth
          id='confirmPassword'
          label='Confirm Password'
          name='confirmPassword'
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
