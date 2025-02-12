import {RequestWithBody, RequestWithParamsAndBody} from "../../../types";
import {VideosCreateModel} from "../models/VideosCreateModel";
import {Response} from "express";
import {VideosViewModel} from "../models/VideosViewModel";
import {OutputErrorsType} from "../types/output-errors-type";
import {createInputValidation, updateInputValidation} from "../validator/video-data-validator";
import {SETTINGS} from "../../../settings";
import {VideosURIParamsModel} from "../models/VideosURIParamsModel";
import {VideosUpdateModel} from "../models/VideosUpdateModel";

export const createInputMiddleware = (req: RequestWithBody<VideosCreateModel>, res: Response<VideosViewModel | OutputErrorsType>, next: () => void) => {
    const errorsMessages = createInputValidation(req.body);

    if (errorsMessages.errorsMessages?.length) {
        res.status(SETTINGS.HTTP_STATUSES.BAD_REQUEST)
        res.json(errorsMessages)
        return
    }

    next()
}

export const updateInputMiddleware = (req: RequestWithParamsAndBody<VideosURIParamsModel, VideosUpdateModel>, res: Response<OutputErrorsType | null>, next: () => void) => {
    const errorsMessages = updateInputValidation(req.body);

    if (errorsMessages.errorsMessages?.length) {
        res.status(SETTINGS.HTTP_STATUSES.BAD_REQUEST)
        res.json(errorsMessages)
        return
    }

    next()
}
