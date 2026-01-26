import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initGA = () => {
  if (import.meta.env.PROD && GA_MEASUREMENT_ID) {
    ReactGA.initialize(GA_MEASUREMENT_ID);
  }
};

export const logPageView = () => {
  if (import.meta.env.PROD) {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
  }
};

export const logEvent = (category: string, action: string, label?: string) => {
  if (import.meta.env.PROD) {
    ReactGA.event({
      category,
      action,
      label,
    });
  }
};
