import { PhoneNumber,PhoneNumberStatus } from './phoneNumber';

export interface CampaignsPhoneNumberType extends Omit<PhoneNumber, 'id' | 'createdAt' | 'updatedAt'>{
    id: number;
    phoneNumber: string;
    status: PhoneNumberStatus;
}
  
export interface CampaignsMessageType {
    id: number;
    sentAt: string;
    templateUsed: string;
    responseReceived: string;
    respondedAt: string;
    messageStatus: string;
    updatedAt: string;
    campaignId: number;
    phoneNumber: CampaignsPhoneNumberType; // Usamos la interfaz del teléfono
  }
  
  // 3. Interfaz para el objeto 'campaign'
export interface CampaignType {
    id: number;
    sentAt: string;
    templateUsed: string;
    createdByUser: number;
    createdAt: string;
    updatedAt: string;
    messages: CampaignsMessageType[]; // Un array de la interfaz de mensaje
  }