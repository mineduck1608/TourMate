import { MembershipPackage } from "@/types/membership-package"
import http from "../utils/http"

export const getMembershipById = async (id: number) => {
  const response = await http.get<MembershipPackage>(`membership-packages/${id}`)
  return response.data
} 