import { Button, Container } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";

import { PATH_DASHBOARD } from "src/routes/paths";
import DeleteQuestionDialog from "./Questions/deleteQuestionDialog";
import EditQuestionDialog from "./Questions/editQuestionDialog";
import MainSection from "./Questions/mainSection";
import NewQuestionDialog from "./Questions/newQuestionDialog";

const ProductQuestions = () => {
  const { state } = useLocation();
  const [openNew, setOpenNew] = useState(false);
  const closeNew = () => setOpenNew(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const openEdit = (data) => setEditData(data);
  const openDelete = (id) => setDeleteId(id);

  const fetchData = async () => {
    try {
      await setTimeout(
        () => alert("Need to get fetch api for questions"),
        1000
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Page title={"products.question.productQuestionsTitile"}>
        <Container>
          <HeaderBreadcrumbs
            heading={"products.question.productQuestions"}
            links={[
              { name: "dashboard", href: PATH_DASHBOARD.root },
              {
                name: "products.question.products.question",
                href: PATH_DASHBOARD.store.products.question,
              },
              { name: "products.question.productQuestions" },
            ]}
            action={
              <Button
                variant="contained"
                startIcon={
                  <Iconify icon={"eva:plus-fill"} width={20} height={20} />
                }
                onClick={() => setOpenNew(true)}
              >
                {"products.question.addQuestion"}
              </Button>
            }
          />
          <MainSection
            openDelete={openDelete}
            openEdit={openEdit}
            questions={state.questions}
          />
        </Container>

        <NewQuestionDialog
          fetchData={fetchData}
          open={openNew}
          onClose={closeNew}
        />
        <EditQuestionDialog
          editData={editData}
          fetchData={fetchData}
          onClose={() => setEditData(null)}
        />
        <DeleteQuestionDialog
          fetchData={fetchData}
          onClose={() => setDeleteId(null)}
          deleteId={deleteId}
        />
      </Page>
    </div>
  );
};

export default ProductQuestions;
