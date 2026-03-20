import { paramCase } from "change-case";
import { useEffect, useState } from "react";
import useDataHandler from "src/components/data-handler/hooks/use-data-handler";
import fetchUser from "src/utils/fetchUser";

const useFaq = () => {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [state, actions] = useDataHandler({ categories: [], data: [] });
  useEffect(() => {
    const fetchFaq = async () => {
      actions.loading();
      try {
        const { status, data } = await (await fetchUser("user-faqs")).data;

        if (status) {
          const categories = data?.data.map(({ name }, i) => ({
            slug: paramCase(name),
            name,
          }));
          actions.success({ categories, data: data?.data }, true);

          setCategories(categories);
          setFaqs(data?.data);
          return;
        }
        actions.success({ categories: [], data: [] }, true);
      } catch (err) {
        actions.error();
        console.log(err);
      }
    };
    fetchFaq();
  }, []);

  return { state, categories, faqs };
};

export default useFaq;
