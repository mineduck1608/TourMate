import { useState, useEffect } from "react";

/**
 * Hook để lấy token (đã hash) từ sessionStorage và trả về.
 * 
 * @param key khóa lưu token trong sessionStorage, mặc định 'accessToken'
 */
export function getToken(key: string = "accessToken") {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      const storedToken = sessionStorage.getItem(key);
      if (!storedToken) throw new Error("Token không tồn tại trong sessionStorage");
      setToken(storedToken);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [key]);

  return { token, loading, error };
}
