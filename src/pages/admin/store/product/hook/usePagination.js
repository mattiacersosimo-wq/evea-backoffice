import { getProducts } from "src/redux/slices/product";

const { useState, useEffect } = require("react");
const { useSelector, useDispatch } = require("react-redux");

export const savePageToLocal = (pageNumber) =>
  localStorage.setItem("product_page_number", pageNumber);

export const getPageFromLocal = (pageNumber) =>
  localStorage.getItem("product_page_number", pageNumber) || 0;

const usePagination = () => {
  const product = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const data = product.products.data;
    if (data) {
      setTotalPages(data.last_page);
      setCurrentPage(data.current_page);
    }
  }, [product]);

  const handlePageChange = (_, pageNumber) => {
    dispatch(getProducts(pageNumber));
    setCurrentPage(pageNumber);
    savePageToLocal(pageNumber);
  };

  return { currentPage, totalPages, handlePageChange };
};

export default usePagination;
