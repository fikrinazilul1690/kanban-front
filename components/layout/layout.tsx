import { FC, ReactNode } from 'react';
import { Container, Box } from '@mui/material';
import Image from 'next/image';

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <Container component={'main'} maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </Container>
  );
};

export default Layout;
