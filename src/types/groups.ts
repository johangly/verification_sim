import { ConcentratedDataGet } from "./concentrated"

export interface GroupDataPost {
    name: string
    description: string
    concentratedId: number
    isActive: boolean
}
export interface GroupDataGet extends GroupDataPost {
    id: number
    code: string
    createdAt: string
    updatedAt: string
    concentrado:ConcentratedDataGet
}
export interface GroupDataPut{
    id: number
    name: string
    description: string
    concentratedId: number
    isActive: boolean
}