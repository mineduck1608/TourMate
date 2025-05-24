import { useState, useEffect } from "react";

/**
 * Hook để lấy token (đã hash) từ sessionStorage và trả về.
 * 
 * @param key khóa lưu token trong sessionStorage, mặc định 'accessToken'
 */
export function getToken(key: string = "accessToken") {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedToken = sessionStorage.getItem(key);
      if (!storedToken) throw new Error("Token không tồn tại trong sessionStorage");
      setToken(storedToken);
    } catch (err) {
    } finally {
    }
  }, [key]);

  return token;
}
