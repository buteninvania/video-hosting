import {ResolutionsString} from "../../../db/video-db-type";

export type VideosCreateModel = {
    title: string
    author: string
    availableResolution?: ResolutionsString[]
}
