export interface Applications {
  cvApplicationId: number;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  image: string;
  link: string;
  status: string;
}

export interface RejectCVRequest {
  cvApplicationId: Applications["cvApplicationId"];
  response: string;
}

export interface ApprovedCVRequest {
  cvApplicationId: number;
  email: string;
  fullName: string;
  gender: string;
  phone: string;
  address: string;
  image: string;
  dateOfBirth: string;
  description: string;
  areaId: number;
  response?: string;
}

