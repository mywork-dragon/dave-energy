import { useState } from 'react';
import { AnalyticsSuperModel, ElectricityDocument } from 'models';

type DataType = keyof ElectricityDocument;

type Subtitle = 'Last Billing' | 'YTD';

const mapKeyToTitle: {
  [key in DataType]: Subtitle;
} = {
  // The displayed value represents the state to switch to, not the current
  // state
  lastBilling: 'YTD',
  ytd: 'Last Billing',
};

interface HookReturn {
  pctChange?: string | null;
  unit?: string | null;
  value?: string | null;
  subtitle: Subtitle;
  toSwitch(): void;
}

export const useAnalyticsToggle = (
  analyticsSuperData: AnalyticsSuperModel | null,
): HookReturn => {
  const [toDisplay, setToDisplay] = useState<DataType>('ytd');

  const toSwitch = () =>
    setToDisplay(prevState => (prevState === 'ytd' ? 'lastBilling' : 'ytd'));

  const { pctChange, unit, value } =
    analyticsSuperData?.electricity?.[toDisplay] ?? {};

  const subtitle = mapKeyToTitle[toDisplay];

  return { pctChange, unit, value, subtitle, toSwitch };
};
