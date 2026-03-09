export const fonts = {
  fraunces: {
    regular: 'Fraunces-Regular',
    semiBold: 'Fraunces-SemiBold',
  },
  sourceSans: {
    regular: 'SourceSans3-Regular',
    medium: 'SourceSans3-Medium',
  },
} as const;

export const typography = {
  displayXl: {
    fontFamily: fonts.fraunces.semiBold,
    fontSize: 48,
  },
  displayLg: {
    fontFamily: fonts.fraunces.regular,
    fontSize: 36,
  },
  displayMd: {
    fontFamily: fonts.fraunces.regular,
    fontSize: 28,
  },
  title: {
    fontFamily: fonts.fraunces.semiBold,
    fontSize: 20,
  },
  bodyLg: {
    fontFamily: fonts.sourceSans.regular,
    fontSize: 17,
  },
  bodyMd: {
    fontFamily: fonts.sourceSans.regular,
    fontSize: 15,
  },
  label: {
    fontFamily: fonts.sourceSans.medium,
    fontSize: 13,
  },
  caption: {
    fontFamily: fonts.sourceSans.regular,
    fontSize: 11,
  },
} as const;
