import React, { useRef, useEffect, useState } from 'react';
import EditorJS from '@editorjs/editorjs';

// Remove this line, as we'll import it dynamically
// import AttachesTool from '@editorjs/attaches';

interface EditorJSComponentProps {
  data: any;
  onChange: (data: any) => void;
}

const EditorJSComponent: React.FC<EditorJSComponentProps> = ({ data, onChange }) => {
  const editorRef = useRef<EditorJS | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initEditor = async () => {
      if (!editorRef.current) {
        try {
          const EditorJS = (await import('@editorjs/editorjs')).default;
          const Header = (await import('@editorjs/header')).default;
          const List = (await import('@editorjs/list')).default;
          const Image = (await import('@editorjs/image')).default;
          const Embed = (await import('@editorjs/embed')).default;
          console.log('Embed tool loaded:', Embed); // Log the loaded Embed tool
          const Code = (await import('@editorjs/code')).default;
          const LinkTool = (await import('@editorjs/link')).default;
          const Table = (await import('@editorjs/table')).default;
          const Quote = (await import('@editorjs/quote')).default;
          const Marker = (await import('@editorjs/marker')).default;
          const CheckList = (await import('@editorjs/checklist')).default;
          const Delimiter = (await import('@editorjs/delimiter')).default;
          const InlineCode = (await import('@editorjs/inline-code')).default;
          const SimpleImage = (await import('@editorjs/simple-image')).default;
          const EJLaTeX = (await import('editorjs-latex')).default;
          const Title = (await import('title-editorjs')).default;
          const Paragraph = (await import('@editorjs/paragraph')).default;
          const { ItalicInlineTool, UnderlineInlineTool, StrongInlineTool } = await import('editorjs-inline-tool');
          const Attaches = (await import('@editorjs/attaches')).default;
          const MermaidTool = (await import('editorjs-mermaid')).default;

          const editor = new EditorJS({
            holder: 'editorjs',
            data: data,
            onChange: async () => {
              if (editor && typeof editor.save === 'function') {
                const savedData = await editor.save();
                onChange(savedData);
              }
            },
            onReady: () => {
              if (isMounted) {
                setIsReady(true);
              }
            },
            tools: {
              header: Header,
              title: Title,
              list: List,
              image: {
                class: Image,
                config: {
                  endpoints: {
                    byFile: 'http://localhost:8008/uploadFile',
                    byUrl: 'http://localhost:8008/fetchUrl',
                  }
                }
              },
              embed: {
                class: Embed,
                config: {
                  services: {
                    youtube: true,
                    coub: true,
                    // Add other services you want to support
                  }
                },
                shortcut: 'CMD+SHIFT+E'  // Add this line
              },
              code: {
                class: Code,
                shortcut: 'CMD+SHIFT+C'
              },
              linkTool: {
                class: LinkTool,
                config: {
                  endpoint: 'http://localhost:8008/fetchUrl',
                }
              },
              table: Table, 
              quote: Quote,
              marker: {
                class: Marker,
                shortcut: 'CMD+SHIFT+M',
              },
              checklist: {
                class: CheckList,
                inlineToolbar: true,
              },
              delimiter: Delimiter,
              inlineCode: {
                class: InlineCode,
                shortcut: 'CMD+SHIFT+C',
              },
              simpleImage: SimpleImage,
              Math: {
                class: EJLaTeX,
                shortcut: 'CMD+SHIFT+M',
                config: {
                  css: `
                    .ce-block--math .ce-block__content {
                      max-width: 100% !important;
                    }
                    .math-input-wrapper { 
                      width: 100% !important; 
                      padding: 5px !important; 
                    }
                    .math-input { 
                      width: 100% !important; 
                      min-height: 40px !important; 
                      color: black !important; 
                      background-color: white !important; 
                      resize: vertical !important;
                    }
                    .math-output {
                      display: block !important;
                      margin-top: 10px !important;
                    }
                    .math-output + .math-output {
                      display: none !important;
                    }
                  `
                }
              },
              bold: {
                class: StrongInlineTool,
                shortcut: 'CMD+B',
                inlineToolbar: ['bold', 'italic', 'link'],
              },
              italic: {
                class: ItalicInlineTool,
                shortcut: 'CMD+I',
                inlineToolbar: ['bold', 'italic', 'link'],
              },
              underline: UnderlineInlineTool,
              paragraph: {
                class: Paragraph,
                inlineToolbar: true,
              },
              attaches: {
                class: Attaches,
                config: {
                  endpoint: 'http://localhost:8008/uploadFile'
                }
              },
              mermaid: MermaidTool,
            },
            autofocus: true,
            minHeight: 0,
          });

          if (isMounted) {
            editorRef.current = editor;
          }
        } catch (error) {
          console.error('Error initializing Editor.js:', error);
        }
      }
    };

    initEditor();

    return () => {
      isMounted = false;
      if (editorRef.current) {
        editorRef.current.isReady.then(() => {
          if (editorRef.current && typeof editorRef.current.destroy === 'function') {
            editorRef.current.destroy();
            editorRef.current = null;
          }
        });
      }
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && isReady) {
      editorRef.current.render(data);
    }
  }, [data, isReady]);

  return (
    <div id="editorjs" className="rounded h-full overflow-visible relative"></div>
  );
};

export default EditorJSComponent;