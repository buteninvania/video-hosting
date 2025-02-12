import {Router, Request, Response} from "express";
import {ResolutionsString, VideoDbType} from "../../../db/video-db-type";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../../../types";
import {VideosURIParamsModel} from "../models/VideosURIParamsModel";
import {VideosViewModel} from "../models/VideosViewModel";
import {SETTINGS} from "../../../settings";
import {VideosCreateModel} from "../models/VideosCreateModel";
import {OutputErrorsType} from "../types/output-errors-type";
import {VideosUpdateModel} from "../models/VideosUpdateModel";
import {videosRepository} from "../../../repository/videos-repository";
import {createInputMiddleware, updateInputMiddleware} from "../middleware/videos.middleware";

export const videosRouter = Router();

const videoController = {
    getVideosController: (req: Request, res: Response<VideoDbType[]>) => {
        res.status(SETTINGS.HTTP_STATUSES.OK).json(videosRepository.getVideos());
    },
    getVideoController: (req: RequestWithParams<VideosURIParamsModel>, res: Response<VideosViewModel>) => {
        const foundVideo = videosRepository.getVideoById(+req.params.id);
        foundVideo
            ? res.status(SETTINGS.HTTP_STATUSES.OK).json(foundVideo)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    },
    createVideoController: (req: RequestWithBody<VideosCreateModel>, res: Response<VideosViewModel | OutputErrorsType>) => {
        const {title, author} = req.body;
        const availableResolutions: ResolutionsString[] = req.body.availableResolutions?.length
            ? req.body.availableResolutions
            : ["P144"]

        const videoId = videosRepository.createVideo(
            title,
            author,
            availableResolutions
        );

        const newVideo = videosRepository.getVideoById(videoId);
        newVideo
            ? res.status(SETTINGS.HTTP_STATUSES.CREATED).json(newVideo)
            : res.status(SETTINGS.HTTP_STATUSES.BAD_REQUEST)
    },
    updateVideoController: (req: RequestWithParamsAndBody<VideosURIParamsModel, VideosUpdateModel>, res: Response<OutputErrorsType | null>) => {
        videosRepository.updateVideo(+req.params.id, req.body)
            ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
            : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    },
    deleteVideoController: (req: RequestWithParams<VideosURIParamsModel>, res: Response) => {
        videosRepository.deleteProduct(+req.params.id)
        ? res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
        : res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND);
    }
}

videosRouter.get('/', videoController.getVideosController)
videosRouter.get('/:id', videoController.getVideoController)
videosRouter.post('/',createInputMiddleware, videoController.createVideoController)
videosRouter.put('/:id', updateInputMiddleware, videoController.updateVideoController)
videosRouter.delete('/:id', videoController.deleteVideoController)
