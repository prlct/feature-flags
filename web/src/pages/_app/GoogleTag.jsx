import Script from 'next/script';

const GoogleTag = () => {
  if (process.env.NEXT_PUBLIC_APP_ENV === 'development') return null;

  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-JKRP1ZQ38Z" />
      <Script id="gtag">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-JKRP1ZQ38Z');
        `}
      </Script>
    </>
  );
};

export default GoogleTag;
