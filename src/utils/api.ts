const BASE_URL = "https://stoq-web-api.devspace.bafid.app";

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${BASE_URL}/api/Auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Ошибка входа");
  }

  return response.json(); // вернёт токен
};

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
      countryId: 1,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Ошибка регистрации");
  }

  return response.json();
};
