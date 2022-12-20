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
      '& button': {
        borderRadius: 8,
        padding: 8,
        width: 128,
        height: 40,
        fontSize: 16,
      },
    },
  },
  inactiveTabItem: {
    paddingBottom: 24,
    paddingLeft: 24,
    width: 363,
    height: 180,
    borderRadius: 20,
    border: `1px solid ${colors.gray[2]}`,
    fontWeight: 700,
    fontSize: 18,
    alignItems: 'self-end',
    justifyContent: 'start',
    opacity: 0.8,
    backgroundImage: 'url(https://email.uplers.com/blog/wp-content/uploads/2020/11/Points-to-keep-in-mind-while-creating-promotional-email-campaigns-with-SFMC.jpg)',
    backgroundSize: 'cover',
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
        backgroundImage: 'linear-gradient(to right, rgba(255,0,0,0), #FFFFFF)',
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
