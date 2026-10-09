import { useMemo } from "react";

const HAS_LETTER = /[a-zA-Z]/;
const HAS_NUMBER = /[0-9]/;
const HAS_UPPER = /[A-Z]/;
const HAS_SPECIAL = /[^A-Za-z0-9]/;

export function usePasswordValidation(password = "", confirmPassword = "") {
  return useMemo(() => {
    const requirements = [
      {
        id: "min",
        label: "No mínimo 8 caracteres",
        valid: password.length >= 8,
      },
      {
        id: "letter",
        label: "Pelo menos uma letra",
        valid: HAS_LETTER.test(password),
      },
      {
        id: "number",
        label: "Pelo menos um número",
        valid: HAS_NUMBER.test(password),
      },
      {
        id: "upper",
        label: "Pelo menos uma letra maiúscula",
        valid: HAS_UPPER.test(password),
      },
      {
        id: "special",
        label: "Pelo menos um caractere especial (!@#$%^&*)",
        valid: HAS_SPECIAL.test(password),
      },
      {
        id: "match",
        label: "As senhas coincidem",
        valid: password.length > 0 && password === confirmPassword,
      },
    ];

    const isValid = requirements.every((r) => r.valid);

    return { requirements, isValid };
  }, [password, confirmPassword]);
}

export default usePasswordValidation;
