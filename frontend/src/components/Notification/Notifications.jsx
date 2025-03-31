import { useSnackbar } from "notistack";

export const useNotifier = () => {
  const { enqueueSnackbar } = useSnackbar();

  return {
    notifySuccess: (msg) => enqueueSnackbar(msg, { variant: "success" }),
    notifyError: (msg) => enqueueSnackbar(msg, { variant: "error" }),
  };
};
