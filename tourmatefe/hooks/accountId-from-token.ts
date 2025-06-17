import { useToken } from "@/components/getToken"
import { MyJwtPayload } from "@/types/JwtPayload"
import { jwtDecode } from "jwt-decode"


export function useAccountIdFromToken(): number | undefined {
  const token = useToken("accessToken")
  try {
    if (!token) return undefined
    const decoded = jwtDecode<MyJwtPayload>(token.toString())
    return decoded?.AccountId ? Number(decoded.AccountId) : undefined
  } catch (err) {
    console.error("Invalid token:", err)
    return undefined
  }
}
