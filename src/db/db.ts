import {VideoDbType} from './video-db-type'

export type DBType = {
    videos: VideoDbType[]
}

export const db: DBType = {
    videos: [],
}

export const setDB = (dataset?: Partial<DBType>) => {
    if (!dataset) {
        db.videos = []
        return
    }

    db.videos = dataset.videos || db.videos
}
