export interface ConcentratedDataPost {
    name:string
    description:string
    isActive:boolean
}
export interface ConcentratedDataPut {
    id:number
    name:string
    description:string
    isActive:boolean
}

export interface ConcentratedDataGet {
    id:number
    name:string
    description:string
    code:string
    isActive:boolean
    createdAt:string
    updatedAt:string
}