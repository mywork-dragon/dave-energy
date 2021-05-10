import React from 'react';
import Olark from 'react-olark';

import { Header, Footer } from './components';


const olarkSiteId = process.env.OLARK_SITE_ID;
const olarkConfig = {
  'hb_custom_style': {
    'general': {
      'secondaryColor': '#002361',
    },
  },
  'hb_primary_color': '#23C45D',
  'hb_show_button_text': false,
  'hb_chatbox_size': 'sm',
};

interface LayoutProps {
  children?: React.ReactNode;
  isHeaderSticky?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, isHeaderSticky }) => {
  return (
    <>
      <Header isSticky={isHeaderSticky} css='margin: 0 46px;' />
        {children}
        {olarkSiteId && <Olark systemConfig={olarkConfig} siteId={olarkSiteId} />}
      <Footer />
    </>
  );
};
