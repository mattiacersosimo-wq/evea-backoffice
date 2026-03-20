import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import useFetch from "./useFetch";

const useGetDocument = () => {
  const { data: documents, categories, ...rest } = useFetch("documents");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [state, actions] = useDataHandler();

  useEffect(() => {
    actions.loading();
    if (documents.length > 0) {
      if (selectedCategory === "all") {
        actions.success(documents);
      } else {
        actions.success(
          documents.filter(
            ({ category_id }) => category_id === selectedCategory
          )
        );
      }
    } else {
      actions.success([]);
    }
  }, [documents, selectedCategory]);

  return { categories, state, selectedCategory, setSelectedCategory, ...rest };
};
export default useGetDocument;
