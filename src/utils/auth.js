export function getToken() {
  return localStorage.getItem('token');
}

export function saveToken(token) {
  localStorage.setItem('token', token);
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function decodeToken() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    console.log('Decoded JWT payload:', atob(payload));  // log decoded payload for testing
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function getRole() {
  return decodeToken()?.role || null;   // returns "PATIENT", "DOCTOR", etc.
}

export function isTokenExpired() {
  const decoded = decodeToken();
  if (!decoded) return true;
  return decoded.exp * 1000 < Date.now();
}

export function isLoggedIn() {
  return !!getToken() && !isTokenExpired();
}