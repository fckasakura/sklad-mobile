const BASE_URL = "https://stoq-web-api.devspace.bafid.app";

export const loginUser = async ({ email, password }: { email: string; password: string }) => {
  const response = await fetch("https://stoq-web-api.devspace.bafid.app/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Login: email, Password: password }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Ошибка авторизации");
  }

  return response.json();
};


// Регистрация
export const registerUser = async (data: {
  firstName: string;
  lastName: string;
  telephone: string;
  city: string;
  email: string;
  password: string;
}) => {
  const response = await fetch(`${BASE_URL}/api/v1/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "en-US",
      "Content-Language": "en-US",
    },
    body: JSON.stringify({
      ...data,
      countryId: 1, // фиксировано, иначе API ругается
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Ошибка регистрации");
  }

  return response.json();
};
