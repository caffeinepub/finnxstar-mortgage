import { useEffect, useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally run only on mount to set initial HTML without overwriting user edits
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  function exec(command: string, val?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, val);
  }

  function handleInput() {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }

  function handleLink() {
    const url = window.prompt("Enter URL (include https://):");
    if (url) {
      exec("createLink", url);
      handleInput();
    }
  }

  function handleFontSize(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    if (val === "h2") {
      exec("formatBlock", "h2");
    } else if (val === "p") {
      exec("formatBlock", "p");
    } else {
      exec("fontSize", val);
    }
    handleInput();
  }

  const btnClass =
    "px-2 py-1 text-sm rounded hover:bg-navy hover:text-white text-navy border border-transparent hover:border-navy transition-colors cursor-pointer";

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-100 border-b border-gray-200 px-2 py-1.5 flex flex-wrap items-center gap-1">
        <button
          type="button"
          className={btnClass}
          onClick={() => exec("bold")}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={`${btnClass} italic`}
          onClick={() => exec("italic")}
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          className={btnClass}
          onClick={() => exec("underline")}
          title="Underline"
        >
          <span className="underline">U</span>
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <select
          className="text-sm border border-gray-300 rounded px-1 py-0.5 bg-white text-navy cursor-pointer hover:border-navy transition-colors"
          defaultValue=""
          onChange={handleFontSize}
          title="Text size"
        >
          <option value="" disabled>
            Size
          </option>
          <option value="1">Small</option>
          <option value="3">Normal</option>
          <option value="4">Large</option>
          <option value="h2">Heading</option>
          <option value="p">Paragraph</option>
        </select>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          className={btnClass}
          onClick={() => exec("insertUnorderedList")}
          title="Bullet list"
        >
          &#8226; List
        </button>
        <button
          type="button"
          className={btnClass}
          onClick={() => exec("insertOrderedList")}
          title="Numbered list"
        >
          1. List
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          className={btnClass}
          onClick={handleLink}
          title="Insert link"
        >
          🔗 Link
        </button>
        <button
          type="button"
          className={btnClass}
          onClick={() => exec("removeFormat")}
          title="Remove formatting"
        >
          ✕ Clear
        </button>
      </div>

      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-ocid="admin.editor"
        onInput={handleInput}
        className="min-h-[200px] p-3 text-gray-800 outline-none focus:ring-2 focus:ring-inset focus:ring-gold/40 prose prose-sm max-w-none"
        style={{ lineHeight: "1.6" }}
      />
    </div>
  );
}
