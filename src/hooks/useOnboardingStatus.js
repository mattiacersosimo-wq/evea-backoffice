import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

// Cache result so multiple components don't make duplicate API calls
let _cache = null;
let _promise = null;
const _listeners = new Set();

const fetchStatus = () => {
  _promise = axiosInstance.get("api/wp/onboarding/status")
    .then(({ data: r }) => {
      _cache = r?.data;
      _listeners.forEach((cb) => cb(_cache));
      return _cache;
    })
    .catch(() => { _cache = null; return null; });
  return _promise;
};

export const invalidateOnboardingStatus = () => {
  _cache = null;
  _promise = null;
  return fetchStatus();
};

const useOnboardingStatus = () => {
  const [status, setStatus] = useState(_cache);

  useEffect(() => {
    if (_cache) { setStatus(_cache); }
    if (!_promise) fetchStatus();
    _promise.then((s) => { if (s) setStatus(s); });

    const listener = (s) => setStatus(s);
    _listeners.add(listener);
    return () => { _listeners.delete(listener); };
  }, []);

  return {
    isActive: status?.onboarding_done === true,
    isLoading: status === null,
    status,
  };
};

export default useOnboardingStatus;
