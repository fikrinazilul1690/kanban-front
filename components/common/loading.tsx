import { FC } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

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
