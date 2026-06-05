import type { AxiosInstance } from "axios";
import type { IPlantDetectionCreateRequestDTO, IPlantDetectionCreateResponseDTO, IPlantDetectionsDTO, } from "@project/shared";

export const plantDetectionService = (api: AxiosInstance) => ({

    //POST /pdet/
    //Submits image for plant detection, returns requestId
    create: async (data: IPlantDetectionCreateRequestDTO): Promise<IPlantDetectionCreateResponseDTO> => {
        const formData = new FormData();
        formData.append("image", data.image);

        const response = await api.post<IPlantDetectionCreateResponseDTO>("/pdet/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    },

    //GET /pdet/:id
    //Fetches detection request status and result
    getById: async (id: number): Promise<IPlantDetectionsDTO> => {
        const response = await api.get<IPlantDetectionsDTO>(`/pdet/${id}`);
        return response.data;
    },

    //Polls GET /pdet/:id until status is DONE or FAILED
    //intervalMs: how often to poll (default 2000ms)
    //timeoutMs: max total wait time (default 60000ms)
    pollUntilDone: async (
        id: number,
        intervalMs = 2000,
        timeoutMs = 60_000,
    ): Promise<IPlantDetectionsDTO> => {
        const deadline = Date.now() + timeoutMs;

        return new Promise((resolve, reject) => {
            const tick = async () => {
                if (Date.now() > deadline) {
                    reject(new Error(`Polling timed out after ${timeoutMs}ms for request ${id}`));
                    return;
                }

                try {
                    const response = await api.get<IPlantDetectionsDTO>(`/pdet/${id}`);
                    const result = response.data;

                    if (result.type === "DONE" || result.type === "FAILED") {
                        resolve(result);
                    } else {
                        setTimeout(tick, intervalMs);
                    }
                } catch (err) {
                    reject(err);
                }
            };
            tick();
        });
    },
});