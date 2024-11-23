import { isAxiosError } from "axios";
import { toast } from "react-toastify";

export const alertErrorAxios = (error: unknown) => {
  if (isAxiosError(error)) {
    if (error.response) {
      toast.error(
        `${
          error.response.data?.message
            ? error.response.data.message
            : error.response.statusText
        }`,
      );
      return;
    }
    toast.error(error.message);
    return;
  }
  console.log(error);
};
