import Script from 'next/script';

const CrispChat = () => {
  if (process.env.NEXT_PUBLIC_APP_ENV === 'development') return null;

  return (
    <Script id="crisp-chat">
      {`window.$crisp=[];window.CRISP_WEBSITE_ID="${process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID}";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`}
    </Script>
  );
};

export default CrispChat;
