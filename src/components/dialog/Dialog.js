import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import axios from "axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({ user, dispatch }) {
  const [open, setOpen] = React.useState(false);
  const [isDelete, setIsDelete] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleDelete = async () => {
    try {
      // dispatch action to delte user - all post of user and logout
      await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/users/${user._id}`, {
        data: { userId: user._id },
      });
      setIsDelete(true);
      setTimeout(() => {
        dispatch({
          type: "LOGOUT",
        });
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <span className="settingsUpdateTitle" onClick={handleClickOpen}>
        Delete Account
      </span>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <>
          <DialogTitle color="warning">{`You sure wanna delete account ${user.username}`}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              If you delete this account, you will lost all posts and cannot
              restore them!
            </DialogContentText>
          </DialogContent>
          {isDelete ? (
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert severity="success">
                Your account and all posts has been deleted ...
              </Alert>
            </Stack>
          ) : (
            <DialogActions>
              <Button onClick={handleClose}>cancel</Button>
              <Button variant="contained" color="error" onClick={handleDelete}>
                Delete
              </Button>
            </DialogActions>
          )}
        </>
      </Dialog>
    </div>
  );
}
