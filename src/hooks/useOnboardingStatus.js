import { useEffect, useState } from "react";
import axiosInstance from "src/utils/axios";

// Cache result so multiple components don't make duplicate API calls
let _cache = null;
let _promise = null;

const useOnboardingStatus = () => {
  const [status, setStatus] = useState(_cache);

  useEffect(() => {
    if (_cache) { setStatus(_cache); return; }
    if (!_promise) {
      _promise = axiosInstance.get("api/wp/onboarding/status")
        .then(({ data: r }) => { _cache = r?.data; return _cache; })
        .catch(() => { _cache = null; return null; });
    }
    _promise.then((s) => { if (s) setStatus(s); });
  }, []);

  return {
    isActive: status?.onboarding_done === true,
    isLoading: status === null,
    status,
  };
};

export default useOnboardingStatus;
