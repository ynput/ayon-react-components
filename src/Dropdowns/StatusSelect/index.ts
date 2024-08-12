// demo data
import statusesData from './statuses.json'
import { Status } from './StatusField'
export const statuses = statusesData as Status[]
export const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

export * from './StatusSelect'
export * from './StatusField'
