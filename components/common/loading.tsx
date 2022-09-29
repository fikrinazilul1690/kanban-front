import { FC } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface Props {
  fullHeight: number;
}

const Loading: FC<Props> = ({ fullHeight }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: fullHeight ? '100vh' : '100%',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;
