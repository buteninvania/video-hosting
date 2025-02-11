import {req} from "../test.helpers";
import {HTTP_STATUS_TYPE, SETTINGS} from "../../src/settings";
import {VideosCreateModel} from "../../src/features/videos/models/VideosCreateModel";

export const videosTestManager = {
    createVideo: async (data: VideosCreateModel, statusCode: HTTP_STATUS_TYPE = SETTINGS.HTTP_STATUSES.CREATED) => {
        const response = await req
            .post(`${SETTINGS.PATH.VIDEOS}`)
            .send(data)
            .expect(statusCode)

        let createdEntity;

        if (statusCode === SETTINGS.HTTP_STATUSES.CREATED) {
            createdEntity = response.body;

            expect(createdEntity).toEqual({
                id: expect.any(Number),
                ...data
            })
        }

        return {response, createdEntity}
    },
}
