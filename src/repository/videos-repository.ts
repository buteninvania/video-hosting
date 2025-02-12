import {db} from "../db/db";
import {ResolutionsString, VideoDbType} from "../db/video-db-type";
import {createNextDate} from "../settings";

export const videosRepository = {
    getVideos(): VideoDbType[] {
        return db.videos;
    },
    getVideoById(id: number): VideoDbType | null {
        if (!id) return null
        return db.videos.find(v => v.id === id) || null;
    },
    createVideo(title: string, author: string, availableResolutions: ResolutionsString[]): number {
        const id = Date.now() + Math.random();
        const createdAt = new Date().toISOString();
        const publicationDate = createNextDate(new Date());
        db.videos.push({
            id,
            title: title,
            author: author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt,
            publicationDate,
            availableResolutions
        })
        return id;
    },
    updateVideo(id: number, videoData: Partial<VideoDbType>): VideoDbType | null {
        const video = db.videos.find(v => v.id === id);
        if (!video) return null;
        Object.assign(video, videoData);
        return video
    },
    deleteProduct(id: number): boolean {
        const foundVideo = db.videos.find(v => v.id === id);
        if (!foundVideo) return false;
        db.videos = db.videos.filter(v => v.id !== id);
        return true;
    }
}
