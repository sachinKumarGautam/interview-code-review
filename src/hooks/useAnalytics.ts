import { useEffect, useState } from "react";

// Best Practices:  Not handling the case where the eventParams might change during the component's lifecycle.
const useAnalytics = (eventName: string, eventParams: Record<string, any>) => {
  const [localParams, setLocalParams] = useState(eventParams);

  useEffect(
    () => {
      // Assume analyticsProvider is a global object.
      analyticsProvider.trackEvent(eventName, localParams);
    },
    [eventName, localParams]
  ); //  localParams is the dependency

  //  Problem: If eventParams changes after the component mounts, the effect won't re-run with the new params.
  //  The analyticsProvider.trackEvent will be called with the initial eventParams, not the updated ones.
};

export default useAnalytics;
