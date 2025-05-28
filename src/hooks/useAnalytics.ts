import { useEffect, useState } from "react";

const useAnalytics = (eventName: string, eventParams: Record<string, any>) => {
  const [localParams, setLocalParams] = useState(eventParams);

  useEffect(
    () => {
      analyticsProvider.trackEvent(eventName, localParams);
    },
    [eventName, localParams]
  );
};

export default useAnalytics;
