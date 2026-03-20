import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router";

const useShowDraftButton = () => {
  const { watch } = useFormContext();
  const { bid } = useParams();
  const isDraft = watch("is_draft");
  const showDraftButton = useMemo(() => {
    if (bid) {
      if (isDraft) return true;
      return false;
    }
    return true;
  }, [bid, isDraft]);
  return showDraftButton;
};

export default useShowDraftButton;
