export interface PhoneNumber {
  id: number;
  phoneNumber: string;
  status: 'no verificado' | 'verificado' | 'por verificar';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePhoneNumberRequest {
  phoneNumber: string;
  status?: 'no verificado' | 'verificado' | 'por verificar';
}

export interface UpdatePhoneNumberRequest {
  phoneNumber?: string;
  status?: 'no verificado' | 'verificado' | 'por verificar';
}