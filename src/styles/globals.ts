import {
  colors,
  fonts,
  fontSizes,
  fontWeights,
  text,
  spacing,
  gradients,
  borders,
  animations,
} from "./variables";

export const globalStyles = {
  "*": {
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },
  body: {
    overflow: "hidden",
    letterSpacing: text.letterSpacing,
    lineHeight: text.lineHeight,
  },
  a: {
    color: "inherit",
    textDecoration: "none",
  },
  "h1, h2": {
    fontFamily: fonts.first,
    fontWeight: fontWeights.extraBold,
    fontSize: fontSizes.title,
  },
  "h3, h4, h5, h6, span, p": {
    fontFamily: fonts.second,
    fontWeight: fontWeights.regular,
    fontSize: fontSizes.normal,
  },
  primaryButton: {
    width: "140px",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.normal,
    fontSize: fontSizes.small,
    color: colors.white,
    background: gradients.toRight,
    border: "none",
    borderRadius: borders.radius,
    cursor: "pointer",
    transition: animations.transition,
    "&:hover": {
      filter: "brightness(1.2)",
    },
  },
};
