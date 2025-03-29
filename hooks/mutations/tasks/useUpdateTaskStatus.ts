import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tasklistid,
      taskid,
      status,
    }: {
      tasklistid: string;
      taskid: string;
      status: string;
    }) => {
      try {
        const response = axios.patch(
          `/api/google/tasks/tasklist/${tasklistid}/task/${taskid}`,
          { status }
        );

        return (await response).data;
      } catch (error) {
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "Failed to update task";
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasklist"] });
    },
  });
};

export default useUpdateTask;
