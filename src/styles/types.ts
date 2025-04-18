import { CSSProperties } from "react";

export type StyleObject = {
  [key: string]: CSSProperties | StyleObject;
};

export interface PageStyles {
  container: CSSProperties;
  imageWrapper: CSSProperties;
  image: CSSProperties;
  logoWrapper: CSSProperties;
  logo: CSSProperties;
  textWrapper: CSSProperties;
  title: CSSProperties;
  subtitle: CSSProperties;
  formContainer: CSSProperties;
  wrapper: CSSProperties & {
    "p, .title": CSSProperties;
    p: CSSProperties;
  };
  form: CSSProperties;
  inputContainer: CSSProperties;
  logoInput: CSSProperties;
  input: CSSProperties & {
    "&:focus": CSSProperties;
  };
  loginOther: CSSProperties & {
    "&::before, &::after": CSSProperties;
    "&::before": CSSProperties;
    "&::after": CSSProperties;
  };
  googleButton: CSSProperties & {
    "&:hover": CSSProperties;
  };
}
