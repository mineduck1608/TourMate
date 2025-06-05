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
