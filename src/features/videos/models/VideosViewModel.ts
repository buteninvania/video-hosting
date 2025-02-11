import {ResolutionsString} from "../../../db/video-db-type";

export type VideosViewModel = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string
    availableResolutions: ResolutionsString[]
}
