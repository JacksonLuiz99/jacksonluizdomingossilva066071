// Decodifica o payload de um JWT sem validação
export function decodeJwtPayload(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Retorna o timestamp de expiração do token (em millisegundos)
export function getTokenExpirationTime(token: string): number | null {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return null;
  return payload.exp * 1000; // Converte para millisegundos
}

//Verifica se o token está próximo de expirar
export function isTokenExpiringSoon(
  token: string, // JWT token
  minutesBeforeExpiry: number = 5, // Quantos minutos antes de expirar por padrão é 5
): boolean {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return false;

  const now = Date.now();
  const timeUntilExpiry = expirationTime - now;
  const thresholdMs = minutesBeforeExpiry * 60 * 1000;

  // Token está dentro da janela de renovação E ainda não expirou
  return timeUntilExpiry <= thresholdMs && timeUntilExpiry > 0;
}

//Verifica se o token já expirou
export function isTokenExpired(token: string): boolean {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return true;
  return Date.now() >= expirationTime;
}
