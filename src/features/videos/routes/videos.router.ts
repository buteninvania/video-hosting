import {Router, Request, Response} from "express";
import {db, setDB} from "../../../db/db";
import {ResolutionsString, VideoDbType} from "../../../db/video-db-type";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../../../types";
import {VideosURIParamsModel} from "../models/VideosURIParamsModel";
import {VideosViewModel} from "../models/VideosViewModel";
import {createNextDate, SETTINGS} from "../../../settings";
import {VideosCreateModel} from "../models/VideosCreateModel";
import {OutputErrorsType} from "../types/output-errors-type";
import {createInputValidation, updateInputValidation} from "../validator/video-data-validator";
import {VideosUpdateModel} from "../models/VideosUpdateModel";

const getVideosViewModel = (dbVideo: VideoDbType): VideosViewModel => {
    return {
        id: dbVideo.id,
        title: dbVideo.title,
        author: dbVideo.author,
        canBeDownloaded: dbVideo.canBeDownloaded,
        minAgeRestriction: dbVideo.minAgeRestriction,
        createdAt: dbVideo.createdAt,
        publicationDate: dbVideo.publicationDate,
        availableResolutions: dbVideo.availableResolutions
    }
}

const getAvailableResolutions = (reqBody: VideosCreateModel): ResolutionsString[] => {
    return reqBody.availableResolutions?.length ? reqBody.availableResolutions : ["P144"];
}

const createVideo = (reqBody: VideosCreateModel): VideoDbType => {
    const id = Date.now() + Math.random();
    const createdAt = new Date().toISOString();
    const publicationDate = createNextDate(new Date());
    const availableResolutions = getAvailableResolutions(reqBody);

    return {
        id,
        title: reqBody.title,
        author: reqBody.author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt,
        publicationDate,
        availableResolutions
    }
}

export const videosRouter = Router();

const videoController = {
    getVideosController: (req: Request, res: Response<VideoDbType[]>) => {
        const videos = db.videos;
        res.status(SETTINGS.HTTP_STATUSES.OK).json(videos)
    },
    getVideoController: (req: RequestWithParams<VideosURIParamsModel>, res: Response<VideosViewModel>) => {
        if (!req.params.id) {
            res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND)
            return
        }

        const foundVideo = db.videos.find(c => c.id === +req.params.id)
        if (!foundVideo) {
            res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND)
            return
        }

        res.status(SETTINGS.HTTP_STATUSES.OK);
        res.json(getVideosViewModel(foundVideo))

    },
    createVideoController: (req: RequestWithBody<VideosCreateModel>, res: Response<VideosViewModel | OutputErrorsType>) => {
        const errorsMessages = createInputValidation(req.body);

        if (errorsMessages.errorsMessages?.length) {
            res.status(SETTINGS.HTTP_STATUSES.BAD_REQUEST)
            res.json(errorsMessages)
            return
        }

        const newVideo = createVideo(req.body);
        const videos = [...db.videos, newVideo];

        setDB({videos})

        res
            .status(SETTINGS.HTTP_STATUSES.CREATED)
            .json(newVideo)
    },
    updateVideoController: (req: RequestWithParamsAndBody<VideosURIParamsModel, VideosUpdateModel>, res: Response<OutputErrorsType | null>) => {
        const errorsMessages = updateInputValidation(req.body);

        if (!req.params.id) {
            res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
            return;
        }

        let foundVideo = db.videos.find(v => v.id === +req.params.id)

        if (!foundVideo) {
            res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
            return;
        }

        if (errorsMessages.errorsMessages?.length) {
            res.status(SETTINGS.HTTP_STATUSES.BAD_REQUEST)
            res.json(errorsMessages)
            return
        }

        Object.assign(foundVideo, req.body)

        res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT);
    },
    deleteVideoController: (req: RequestWithParams<VideosURIParamsModel>, res: Response) => {
        const foundVideo = db.videos.find(v => v.id === +req.params.id);

        if (!foundVideo) {
            res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
            return;
        }

        const videos = db.videos.filter(v => v.id !== foundVideo.id)

        setDB({videos})

        res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT);
    }
}

videosRouter.get('/', videoController.getVideosController)
videosRouter.get('/:id', videoController.getVideoController)
videosRouter.post('/', videoController.createVideoController)
videosRouter.put('/:id', videoController.updateVideoController)
videosRouter.delete('/:id', videoController.deleteVideoController)
