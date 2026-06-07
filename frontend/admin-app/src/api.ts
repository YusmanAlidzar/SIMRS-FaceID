export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export interface RegisterPatientPayload {
  id: string;
  name: string;
  nik: string;
  gender: "Laki-laki" | "Perempuan";
  age?: number;
  birth_date?: string;
  address?: string;
  phone?: string;
  photo_url?: string;
  face_encoding?: string | null;
}

export const registerPatient = async (payload: RegisterPatientPayload) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.error || `Registration failed (${response.status})`;
    throw new Error(errorMessage);
  }

  return data;
};
