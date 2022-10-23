import { FC, ReactNode } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Image from 'next/image';
import Sidebar from '../common/sidebar';

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
      }}
    >
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          p: 1,
          width: 'max-content',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
