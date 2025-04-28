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
    margin: "0 !important",
    overflow: "hidden",
    letterSpacing: text.letterSpacing,
    lineHeight: text.lineHeight,
    fontFamily: fonts.second.regular,
  },
  a: {
    color: "inherit",
    textDecoration: "none",
    "&:focus": {
      outline: `2px solid ${colors.main}`,
      outlineOffset: "2px",
    },
  },
  "h1, h2": {
    fontFamily: fonts.first,
    fontWeight: fontWeights.extraBold,
    fontSize: fontSizes.title,
  },
  "h3, h4, h5, h6": {
    fontFamily: fonts.second.semiBold,
    fontWeight: fontWeights.semiBold,
    fontSize: fontSizes.normal,
  },
  "span, p": {
    fontFamily: fonts.second.regular,
    fontWeight: fontWeights.regular,
    fontSize: fontSizes.normal,
  },
  "input, textarea, select": {
    fontFamily: fonts.second.regular,
    fontSize: fontSizes.normal,
    padding: spacing.small,
    border: `${borders.width} solid ${colors.text}`,
    borderRadius: borders.smallRadius,
    "&:focus": {
      outline: `2px solid ${colors.main}`,
      outlineOffset: "2px",
    },
  },
  "ul, ol": {
    listStyle: "none",
    padding: 0,
  },
  img: {
    maxWidth: "100%",
    height: "auto",
  },
  "::selection": {
    backgroundColor: colors.main,
    color: colors.white,
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
    fontFamily: fonts.second.medium,
    fontWeight: fontWeights.medium,
    "&:hover": {
      filter: "brightness(1.2)",
    },
    "&:focus": {
      outline: `2px solid ${colors.main}`,
      outlineOffset: "2px",
    },
  },
};
