import { getFileType, getFileName, getFileFullName, getFileFormat } from "src/utils/getFileFormat";

describe("getFileType", () => {
  it("extracts jpg extension", () => {
    expect(getFileType("photo.jpg")).toBe("jpg");
  });

  it("extracts pdf extension", () => {
    expect(getFileType("document.pdf")).toBe("pdf");
  });

  it("handles path with directories", () => {
    expect(getFileType("/path/to/file.png")).toBe("png");
  });
});

describe("getFileName", () => {
  it("extracts filename without extension", () => {
    expect(getFileName("photo.jpg")).toBe("photo");
  });
});

describe("getFileFullName", () => {
  it("extracts full filename from path", () => {
    expect(getFileFullName("/path/to/photo.jpg")).toBe("photo.jpg");
  });
});

describe("getFileFormat", () => {
  it("identifies image format", () => {
    expect(getFileFormat("photo.jpg")).toBe("image");
  });

  it("identifies pdf format", () => {
    expect(getFileFormat("document.pdf")).toBe("pdf");
  });

  it("identifies video format", () => {
    expect(getFileFormat("video.mp4")).toBe("video");
  });
});
