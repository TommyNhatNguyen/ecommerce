import {
  useState,
  useEffect,
  useRef,
  useMemo,
  forwardRef,
  Ref,
  LegacyRef,
} from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Alignment,
  AutoImage,
  Autosave,
  BlockQuote,
  Bold,
  Essentials,
  FindAndReplace,
  GeneralHtmlSupport,
  Heading,
  HorizontalLine,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  Paragraph,
  PasteFromMarkdownExperimental,
  PasteFromOffice,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  EditorConfig,
  SimpleUploadAdapter,
  FileRepository,
  Typing,
  DeleteCommand,
  Delete,
  UploadResponse,
  ImageUploadEditing,
  Editor,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import "./style.css";
import { cookiesStorage } from "@/app/shared/utils/localStorage";
import { ValueType } from "tailwindcss/types/config";
/**
 * Create a free account with a trial: https://portal.ckeditor.com/checkout?plan=free
 */
const LICENSE_KEY = "GPL"; // or <YOUR_LICENSE_KEY>.

type CustomEditorPropsType = {
  initialLoading?: boolean;
  editorContainerClassName?: ValueType;
};

// @ts-nocheck
const CustomEditor = (
  {
    initialLoading = false,
    editorContainerClassName,
    ...props
  }: CustomEditorPropsType,
  ref: Ref<CKEditor<ClassicEditor>>,
) => {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, [initialLoading]);

  const editorConfig: EditorConfig = useMemo(() => {
    return {
      toolbar: {
        items: [
          "findAndReplace",
          "|",
          "heading",
          "|",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "|",
          "specialCharacters",
          "horizontalLine",
          "link",
          "insertImage",
          "mediaEmbed",
          "insertTable",
          "blockQuote",
          "|",
          "alignment",
          "|",
          "bulletedList",
          "numberedList",
          "todoList",
          "outdent",
          "indent",
        ],
        shouldNotGroupWhenFull: false,
      },
      plugins: [
        SimpleUploadAdapter,
        Alignment,
        AutoImage,
        Typing,
        Delete,
        Autosave,
        BlockQuote,
        Bold,
        Essentials,
        FindAndReplace,
        GeneralHtmlSupport,
        Heading,
        HorizontalLine,
        ImageBlock,
        ImageCaption,
        ImageInline,
        ImageInsert,
        ImageInsertViaUrl,
        ImageResize,
        ImageStyle,
        ImageTextAlternative,
        ImageToolbar,
        ImageUpload,
        ImageUploadEditing,
        Indent,
        IndentBlock,
        Italic,
        Link,
        LinkImage,
        List,
        ListProperties,
        MediaEmbed,
        Paragraph,
        PasteFromMarkdownExperimental,
        PasteFromOffice,
        SpecialCharacters,
        SpecialCharactersArrows,
        SpecialCharactersCurrency,
        SpecialCharactersEssentials,
        SpecialCharactersLatin,
        SpecialCharactersMathematical,
        SpecialCharactersText,
        Strikethrough,
        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        TextTransformation,
        TodoList,
        Underline,
      ],
      heading: {
        options: [
          {
            model: "paragraph",
            title: "Paragraph",
            class: "ck-heading_paragraph",
          },
          {
            model: "heading1",
            view: "h1",
            title: "Heading 1",
            class: "ck-heading_heading1",
          },
          {
            model: "heading2",
            view: "h2",
            title: "Heading 2",
            class: "ck-heading_heading2",
          },
          {
            model: "heading3",
            view: "h3",
            title: "Heading 3",
            class: "ck-heading_heading3",
          },
          {
            model: "heading4",
            view: "h4",
            title: "Heading 4",
            class: "ck-heading_heading4",
          },
          {
            model: "heading5",
            view: "h5",
            title: "Heading 5",
            class: "ck-heading_heading5",
          },
          {
            model: "heading6",
            view: "h6",
            title: "Heading 6",
            class: "ck-heading_heading6",
          },
        ],
      },
      htmlSupport: {
        allowEmpty: ["img", "span", "i"],
        allow: [
          {
            name: /^.*$/,
            styles: true,
            attributes: true,
            classes: true,
          },
          {
            name: "img",
            attributes: { key: "src", value: true },
            classes: true,
            styles: true,
          },
        ],
      },
      image: {
        toolbar: [
          "toggleImageCaption",
          "imageTextAlternative",
          "|",
          "imageStyle:inline",
          "imageStyle:wrapText",
          "imageStyle:breakText",
          "|",
          "resizeImage",
        ],
      },
      initialData: "",
      licenseKey: LICENSE_KEY,
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: "https://",
        decorators: {
          toggleDownloadable: {
            mode: "manual",
            label: "Downloadable",
            attributes: {
              download: "file",
            },
          },
        },
      },
      list: {
        properties: {
          styles: true,
          startIndex: true,
          reversed: true,
        },
      },
      placeholder: "Type or paste your content here!",
      table: {
        contentToolbar: [
          "tableColumn",
          "tableRow",
          "mergeTableCells",
          "tableProperties",
          "tableCellProperties",
        ],
      },
      simpleUpload: {
        uploadUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/upload`,
        headers: {
          Authorization: `Bearer ${cookiesStorage.getToken()?.accessToken}`,
        },
      },
    } as EditorConfig;
  }, [isLayoutReady]);
  return (
    <div className="editor-main-container">
      <div
        className="editor-container editor-container_classic-editor editor-container_include-word-count"
        ref={editorContainerRef}
      >
        <div className="editor-container__editor">
          <div ref={editorRef} className={editorContainerClassName}>
            {isLayoutReady && (
              <CKEditor
                editor={ClassicEditor}
                config={editorConfig}
                {...props}
                ref={ref}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default forwardRef(CustomEditor);
