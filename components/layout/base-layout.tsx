import { FC, ReactNode } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

interface Props {
  children: ReactNode;
}

const BaseLayout: FC<Props> = ({ children }) => {
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

export default BaseLayout;
