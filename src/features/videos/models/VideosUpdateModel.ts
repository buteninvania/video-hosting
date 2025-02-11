import {ResolutionsString} from "../../../db/video-db-type";

export type VideosUpdateModel = {
    title: string
    author: string
    availableResolution?: ResolutionsString[]
    canBeDownloaded?: boolean | undefined
    minAgeRestriction?: number
    publicationDate?: string
}
