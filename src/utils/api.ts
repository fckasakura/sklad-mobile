export const registerUser = async (data: {
    firstName: string;
    lastName: string;
    telephone: string;
    countryId: number;
    city: string;
    email: string;
    password: string;
  }) => {
    const res = await fetch("https://stoq-web-api.devspace.bafid.app/api/v1/users", {
      method: "POST",
      headers: {
        "Accept-Language": "en-US",
        "Content-Language": "en-US",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      const err = await res.json();
      throw new Error(JSON.stringify(err));
    }
  
    return res.json();
  };
  