const { RHFTextField } = require("src/components/hook-form");

const MetaInformation = () => {
  return (
    <>
      <RHFTextField
        name="meta_keywords"
        label={"products.add.meta_keywords"}
        multiline
        fullWidth
        rows={3}
      />

      <RHFTextField
        name="meta_description"
        label={"products.add.meta_description"}
        multiline
        fullWidth
        rows={3}
      />
      <RHFTextField
        name="short_description"
        label={"products.add.short_description"}
        multiline
        fullWidth
        rows={2}
      />
      <RHFTextField
        name="title"
        label={"products.add.title"}
        multiline
        fullWidth
        rows={2}
      />
    </>
  );
};
export default MetaInformation;
