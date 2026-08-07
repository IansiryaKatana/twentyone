import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import { Bold, Heading2, Heading3, Italic, Link2, List, ListOrdered, Redo2, Undo2 } from "lucide-react";
import { adminBtnGhost } from "@/admin/adminClassNames";
import { cn } from "@/lib/utils";

type AdminRichTextFieldProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeightClass?: string;
};

export function AdminRichTextField({
  value,
  onChange,
  placeholder = "Write content…",
  disabled = false,
  minHeightClass = "[&_.ProseMirror]:min-h-[140px]",
}: AdminRichTextFieldProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor) return null;

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="overflow-hidden rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-white">
      {!disabled ? (
        <div className="flex flex-wrap gap-1 border-b border-[var(--admin-border)] p-2">
          <button
            type="button"
            className={cn(adminBtnGhost, editor.isActive("heading", { level: 2 }) && "bg-[var(--admin-bg)]")}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            aria-label="Heading 2"
          >
            <Heading2 className="size-4" />
          </button>
          <button
            type="button"
            className={cn(adminBtnGhost, editor.isActive("heading", { level: 3 }) && "bg-[var(--admin-bg)]")}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            aria-label="Heading 3"
          >
            <Heading3 className="size-4" />
          </button>
          <button
            type="button"
            className={cn(adminBtnGhost, editor.isActive("bold") && "bg-[var(--admin-bg)]")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            aria-label="Bold"
          >
            <Bold className="size-4" />
          </button>
          <button
            type="button"
            className={cn(adminBtnGhost, editor.isActive("italic") && "bg-[var(--admin-bg)]")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            aria-label="Italic"
          >
            <Italic className="size-4" />
          </button>
          <button
            type="button"
            className={cn(adminBtnGhost, editor.isActive("bulletList") && "bg-[var(--admin-bg)]")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            aria-label="Bullet list"
          >
            <List className="size-4" />
          </button>
          <button
            type="button"
            className={cn(adminBtnGhost, editor.isActive("orderedList") && "bg-[var(--admin-bg)]")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            aria-label="Ordered list"
          >
            <ListOrdered className="size-4" />
          </button>
          <button type="button" className={adminBtnGhost} onClick={setLink} aria-label="Link">
            <Link2 className="size-4" />
          </button>
          <button
            type="button"
            className={adminBtnGhost}
            onClick={() => editor.chain().focus().undo().run()}
            aria-label="Undo"
          >
            <Undo2 className="size-4" />
          </button>
          <button
            type="button"
            className={adminBtnGhost}
            onClick={() => editor.chain().focus().redo().run()}
            aria-label="Redo"
          >
            <Redo2 className="size-4" />
          </button>
        </div>
      ) : null}
      <EditorContent
        editor={editor}
        className={cn(
          "prose prose-sm max-w-none px-3 py-2.5 text-sm [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-[var(--admin-muted)] [&_.ProseMirror_h2]:font-display [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:uppercase [&_.ProseMirror_h3]:font-display [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:uppercase",
          minHeightClass,
        )}
      />
    </div>
  );
}
