export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.25,
  },
  h3: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: 0,
  },
  h4: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: 0.15,
  },
  h5: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
    letterSpacing: 0,
  },
  h6: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  subtitle1: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  subtitle2: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  button: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 1.25,
    textTransform: 'uppercase',
  },
  overline: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
};

export type TypographyVariant = keyof typeof Typography;
