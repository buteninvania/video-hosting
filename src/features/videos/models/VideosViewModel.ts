import {ResolutionsString} from "../../../db/video-db-type";

export type VideosViewModel = {
    id: number
    title: string
    author: string
    canBeDownloaded?: boolean
    minAgeRestriction?: number
    createdAt?: string
    publicationDate?: string
    availableResolution?: ResolutionsString[]
}
