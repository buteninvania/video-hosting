import express from 'express'
import cors from 'cors'
import {SETTINGS} from './settings'
import {videosRouter} from "./features/videos/routes/videos.router";
import {db} from "./db/db";

export const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'})
})

app.delete(SETTINGS.PATH.TESTING, (req, res) => {
    db.videos = [];
    res.sendStatus(SETTINGS.HTTP_STATUSES.NO_CONTENT)
})

app.use(SETTINGS.PATH.VIDEOS, videosRouter)
