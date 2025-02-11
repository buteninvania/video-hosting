import {VideosCreateModel} from "../models/VideosCreateModel";
import {OutputErrorsType} from "../types/output-errors-type";
import {Resolutions} from "../../../db/video-db-type";
import {VideosUpdateModel} from "../models/VideosUpdateModel";
import {isISODate} from "../../../settings";

const ageRestriction = {
    max: 18,
    min: 1
}

export const createInputValidation = (video: VideosCreateModel): OutputErrorsType => {
    const errors: OutputErrorsType = {
        errorsMessages: []
    }

    if (!video.title) {
        errors.errorsMessages?.push({
            field: "title",
            message: "title is a required field"
        })
    }

    if (video.title && video.title.length > 40) {
        errors.errorsMessages?.push({
            field: "title",
            message: "title must be no more than 40 characters long."
        })
    }

    if (!video.author) {
        errors.errorsMessages?.push({
            field: "author",
            message: "author is a required field"
        })
    }

    if (video.author && video.author.length > 20) {
        errors.errorsMessages?.push({
            field: "author",
            message: "author must be no more than 20 characters long"
        })
    }

    if (!!video.availableResolutions && (!Array.isArray(video.availableResolutions)
        || video.availableResolutions.find(p => !Resolutions[p]))
    ) {
        errors.errorsMessages?.push({
            message: 'Invalid data type or invalid value', field: 'availableResolutions'
        })
    }

    return errors
}

export const updateInputValidation = (video: VideosUpdateModel): OutputErrorsType => {
    const errors: OutputErrorsType = {
        errorsMessages: []
    }

    if (!video.title) {
        errors.errorsMessages?.push({
            field: "title",
            message: "title is a required field"
        })
    }

    if (video.title && video.title.length > 40) {
        errors.errorsMessages?.push({
            field: "title",
            message: "title must be no more than 40 characters long."
        })
    }

    if (!video.author) {
        errors.errorsMessages?.push({
            field: "author",
            message: "author is a required field"
        })
    }

    if (video.author && video.author.length > 20) {
        errors.errorsMessages?.push({
            field: "author",
            message: "author must be no more than 20 characters long"
        })
    }

    if (!!video.availableResolution && (!Array.isArray(video.availableResolution)
        || video.availableResolution.find(p => !Resolutions[p]))
    ) {
        errors.errorsMessages?.push({
            message: 'Invalid data type or invalid value', field: 'availableResolutions'
        })
    }

    if (video.canBeDownloaded && typeof video.canBeDownloaded !== "boolean") {
        errors.errorsMessages?.push({
            message: 'Invalid data type or invalid value',
            field: 'canBeDownloaded'
        })
    }

    if (!!video.minAgeRestriction && typeof video.minAgeRestriction !== "number") {
        errors.errorsMessages?.push({
            message: `The min Age Restriction field must be of the number type.`, field: 'minAgeRestriction'
        })
    }

    if (typeof video.minAgeRestriction === "number" && video.minAgeRestriction > ageRestriction.max) {
        errors.errorsMessages?.push({
            message: `The maximum age limit is no more than 18 years, and you have ${video.minAgeRestriction}`, field: 'minAgeRestriction'
        })
    }

    if (typeof video?.minAgeRestriction === "number" && video?.minAgeRestriction < ageRestriction.min) {
        errors.errorsMessages?.push({
            message: `The minimum age limit is at least 1 year, and you have ${video.minAgeRestriction}`, field: 'minAgeRestriction'
        })
    }

    if (video.publicationDate && !isISODate(video.publicationDate)) {
        errors.errorsMessages?.push({
            message: `The publication Date field must be a string and in the string($datetime) format`,
            field: 'publicationDate'
        })
    }

    return errors
}
