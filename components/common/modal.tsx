import { FC, ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import DialogContentText from '@mui/material/DialogContentText/DialogContentText';
import DialogActions from '@mui/material/DialogActions/DialogActions';
import Button from '@mui/material/Button/Button';

interface Props {
  show: boolean;
  onClose: () => void;
  onClick: () => void;
  children: ReactNode;
  title: string;
  description: string;
  action: string;
  colorAction: color;
}
type color =
  | 'inherit'
  | 'error'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning';
const Modal: FC<Props> = ({
  show,
  onClose,
  title,
  children,
  onClick,
  description,
  action,
  colorAction,
}) => {
  return (
    <Dialog open={show} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onClick} color={colorAction}>
          {action}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
