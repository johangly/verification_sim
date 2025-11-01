import { GroupDataGet } from './groups';
export interface PromoterDataPost {
    name: string;
    email: string;
    groupId: number;
    isActive: boolean;

}
export interface PromoterDataPut extends PromoterDataPost {
    id: number;
}
export interface PromoterDataGet extends PromoterDataPut {
    code: string;
    grupo: GroupDataGet;
    createdAt: string;
    updatedAt: string;
}