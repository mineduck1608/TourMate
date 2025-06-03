import { MyJwtPayload } from "@/types/JwtPayload";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

/**
 * Hook để lấy token (đã hash) từ sessionStorage và trả về.
 * 
 * @param key khóa lưu token trong sessionStorage, mặc định 'accessToken'
 */
export function useToken(key: string = "accessToken") {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
      const storedToken = sessionStorage.getItem(key);
      if (!storedToken) throw new Error("Token không tồn tại trong sessionStorage");
      setToken(storedToken);


  }, [key]);

  return token;
}

export function getUserRole(key: string): string | null {
      const decoded: MyJwtPayload | null = key ? jwtDecode<MyJwtPayload>(key.toString()) : null;
      console.log('Decoded');
      
      console.log(decoded);
      
      return decoded?.Role ?? null;
}
