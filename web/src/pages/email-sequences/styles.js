import { createStyles } from '@mantine/core';

export const useStyles = createStyles(({ colors }) => ({
  tabPanel: {
    width: '100%',
    gap: 16,
  },
  tabItem: {
    borderRadius: 8,
    height: 42,
    color: '#909090',
    fontWeight: 700,
    fontSize: 16,
    padding: '9px 20px',
    '&[data-active]': {
      backgroundColor: colors.gray[0],
      color: colors.gray[9],
      outline: 'none',
    },
    '&[data-active]:hover': {
      backgroundColor: colors.gray[0],
      color: colors.gray[9],
    },
    '@media (max-width: 768px)': {
      padding: 0,
      height: 24,
      '& .mantine-Tabs-tabLabel': {
        display: 'flex',
        flexDirection: 'row',
      },
    },
  },
  headerGroup: {
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 24,
    '@media (max-width: 768px)': {
      '& h2': {
        fontSize: 18,
      },
    },
  },
  inactiveTabItem: {
    padding: 24,
    width: 363,
    height: 180,
    borderRadius: 20,
    border: `1px solid ${colors.gray[2]}`,
    fontWeight: 700,
    fontSize: 18,
    alignItems: 'self-end',
    justifyContent: 'start',
    opacity: 0.8,
    backgroundSize: 'cover',
    '& .mantine-Tabs-tabLabel': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
    },
    '&:hover': {
      borderColor: colors.primary[4],
      '&:after': {
        content: '""',
        display: 'block',
        width: 'calc(100% - 24px)',
        height: '100%',
        borderRadius: 20,
        position: 'absolute',
        top: 0,
        background: 'transparent',
        opacity: 0.6,
        backgroundImage: 'linear-gradient(to right, rgba(255,0,0,0), rgba(115, 74, 183, 0.15))',
      },
    },
    '@media (max-width: 768px)': {
      padding: 16,
      height: 56,
      alignItems: 'center',
      backgroundImage: 'none',
      fontSize: 16,
      borderRadius: 10,
      '&:hover': {
        '&:after': {
          content: '""',
          display: 'block',
          width: 'calc(100% - 14px)',
          height: '100%',
          borderRadius: 20,
          '@media (max-width: 768px)': {
            borderRadius: 10,
          },
          position: 'absolute',
          top: 0,
          background: 'transparent',
          opacity: 0.6,
          backgroundImage: 'linear-gradient(296.06deg, rgba(115, 74, 183, 0.15) 13.6%, rgba(255, 255, 255, 0) 80.2%)',
        },
      },
    },
  },
  addButton: {
    padding: '8px 24px',
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '19px',
    textAlign: 'center',
    borderRadius: 8,
    width: 174,
    height: 40,
    '@media (max-width: 768px)': {
      padding: '8px 12px',
      fontSize: 15,
      width: 129,
    },
  },
}));

export const tabListStyles = (theme, openedPipeline) => {
  if (openedPipeline !== 'activation-pipelines') {
    return {
      width: 'calc(100% - 185px)',
      paddingRight: 100,
      flexWrap: 'nowrap',
      overflow: 'scroll',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        width: 0,
      },
      '@media (min-width: 768px)': {
        '&:after': {
          content: '""',
          display: 'block',
          width: 180,
          height: 42,
          position: 'absolute',
          top: 0,
          left: 'auto',
          right: 185,
          background: 'transparent',
          opacity: 1,
          backgroundImage: 'linear-gradient(to right, rgba(255,0,0,0), #FFFFFF)',
        },
      },
    };
  }
};
