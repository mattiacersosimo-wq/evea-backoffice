import { useMemo } from "react";
import DataHandlerList from "src/components/data-handler/list";
import Map from "src/components/map";
import useIsPackage from "src/components/package-or-product/hooks/use-is-package";
import PaginationButtons from "src/components/pagination";
import { isMenuActive } from "src/utils/actionProtector";
import ProductCard from "./ProductCard";
import useProductList from "./hooks/useProductList";
import useIsSubscription from "src/components/package-or-product/hooks/use-is-subscription";

const genStatus = (gp, p) => {
  const test = isMenuActive(gp, p);
  return {
    video: test("view-edit-video"),
    document: test("view-edit-document"),
    sampleDocument: test("view-edit-sampledocument"),
    questions: test("view-edit-questions"),
    edit: test("view-edit-product"),
    delete: test("delete"),
  };
};

const ProductList = () => {
  const { state, fetchProducts, ...rest } = useProductList();
  const { data, ...dataProps } = state;

  const isPackage = useIsPackage();
  const isSubscription = useIsSubscription();

  const status = useMemo(() => {
    if (isPackage) {
      return genStatus("nav.store.title", "nav.store.packages");
    }
    if (isSubscription) {
      return genStatus("nav.store.title", "nav.store.subscriptions");
    }
    return genStatus("nav.store.title", "nav.store.products");
  }, [isPackage, isSubscription]);

  return (
    <div>
      <DataHandlerList dataProps={{ ...dataProps }}>
        <Map
          list={data}
          render={(item) => (
            <ProductCard
              status={status}
              {...item}
              key={item.id}
              refresh={() => fetchProducts(rest.page)}
            />
          )}
        />
      </DataHandlerList>

      <PaginationButtons {...rest} />
    </div>
  );
};

export default ProductList;
