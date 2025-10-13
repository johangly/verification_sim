export interface PhoneNumber {
  id: number;
  phoneNumber: string;
  status: PhoneNumberStatus;
  createdAt: string;
  updatedAt: string;
}
export interface PhoneNumberPaginated {
  data: PhoneNumber[];
    pagination:{
        currentPage: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
    }
}
export interface CreatePhoneNumberRequest {
  phoneNumber: string;
  status?: PhoneNumberStatus;
}

export interface CreatePhoneNumberByFileRequest {
  file: File;
  status?: PhoneNumberStatus | undefined;
}

export interface UpdatePhoneNumberRequest {
  phoneNumber?: string;
  status?: PhoneNumberStatus;
}

export type PhoneNumberStatus = 'no verificado' | 'verificado' | 'por verificar';