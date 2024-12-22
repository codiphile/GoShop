"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: ["extra-small", "small", "medium", "large"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  },
};

export default function Description({ data, handleData }) {
  const handleChange = (value) => {
    handleData("description", value);
  };

  const editorContainerStyle = {
    height: "250px", // Fixed height
    overflow: "auto", // Enable scrollbar for overflowing content
    border: "1px solid #ccc", // Optional: border styling
    borderRadius: "8px", // Optional: rounded corners
  };

  const qlContainerStyle = {
    height: "100%", // Ensures the Quill editor fills the parent container
  };

  const qlEditorStyle = {
    overflowY: "auto", // Vertical scrolling
    maxHeight: "100%", // Restrict the editor height
  };

  return (
    <section className="flex flex-col gap-3 bg-white border p-4 rounded-xl h-full">
      <h1 className="font-semibold">Description</h1>
      <div style={editorContainerStyle}>
        <ReactQuill
          value={data?.description}
          onChange={handleChange}
          modules={modules}
          placeholder="Enter your description here..."
          style={{ height: "100%" }} // Ensures ReactQuill respects the parent height
        />
        <style>
          {`
            .ql-container {
              height: 100%;
            }
            .ql-editor {
              overflow-y: auto;
              max-height: 100%;
            }
          `}
        </style>
      </div>
    </section>
  );
}
