"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  doc, getDoc, updateDoc, collection, addDoc, getDocs, 
  orderBy, query, writeBatch 
} from 'firebase/firestore';
import { db } from '../../../../lib/firebase/firebase';
import { useAuth } from '../../../../lib/contexts/AuthContext';
import Navbar from "../../../../components/ui/navbar";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import EditorJS from '@editorjs/editorjs';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import EJLaTeX from 'editorjs-latex';

// Import Editor.js Tools
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Embed from '@editorjs/embed';
import Code from '@editorjs/code';
import LinkTool from '@editorjs/link';
import Table from '@editorjs/table';
import Warning from '@editorjs/warning';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import CheckList from '@editorjs/checklist';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';
import SimpleImage from '@editorjs/simple-image';

interface Course {
  id: string;
  title: string;
  description: string;
  medium: string;
  price: number;
  published: boolean;
  authorId: string;
}

interface Section {
  id: string;
  title: string;
  order: number;
}

interface Page {
  id: string;
  sectionId: string;
  title: string;
  order: number;
  content: any; // Editor.js data
}

export default function EditCourse() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const editorRef = useRef<EditorJS | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [pageTitle, setPageTitle] = useState<string>('');

  useEffect(() => {
    if (user && id) {
      fetchCourse();
      fetchSections();
    }
  }, [user, id]);

  useEffect(() => {
    if (selectedPage) {
      setPageTitle(selectedPage.title); // Initialize page title
      initializeEditor(selectedPage.content);
    } else if (editorRef.current) {
      editorRef.current.destroy();
      editorRef.current = null;
    }
  }, [selectedPage]);

  const fetchCourse = async () => {
    if (!user || !id) return;
    const courseDoc = await getDoc(doc(db, 'courses', id as string));
    if (courseDoc.exists()) {
      setCourse({ id: courseDoc.id, ...courseDoc.data() } as Course);
    }
  };

  const fetchSections = async () => {
    if (!id) return;
    const sectionsCollection = collection(db, 'courses', id as string, 'sections');
    const q = query(sectionsCollection, orderBy('order'));
    const sectionsSnapshot = await getDocs(q);
    const sectionsList = sectionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Section));
    setSections(sectionsList);

    // Fetch pages for each section
    const allPages: Page[] = [];
    for (const section of sectionsList) {
      const pagesCollection = collection(db, 'courses', id as string, 'sections', section.id, 'pages');
      const qPage = query(pagesCollection, orderBy('order'));
      const pagesSnapshot = await getDocs(qPage);
      const pagesList = pagesSnapshot.docs.map(doc => ({
        id: doc.id,
        sectionId: section.id,
        ...doc.data()
      }) as Page);
      allPages.push(...pagesList);
    }
    setPages(allPages);
  };

  const handleCourseUpdate = async (field: keyof Course, value: string | number | boolean) => {
    if (!course) return;
    try {
      await updateDoc(doc(db, 'courses', course.id), { [field]: value });
      setCourse({ ...course, [field]: value });
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course. Please try again.');
    }
  };
 
  const handleAddSection = async () => {
    if (!course) return;
    try {
      const newSection = {
        title: 'Default Section',
        order: sections.length,
      };
      const docRef = await addDoc(collection(db, 'courses', course.id, 'sections'), newSection);
      const createdSection: Section = { id: docRef.id, ...newSection };
      setSections([...sections, createdSection]);

      // Automatically create a default page within the new section
      const newPage = {
        title: 'Default Page',
        order: 0,
        sectionId: createdSection.id,
        content: {
          time: new Date().getTime(),
          blocks: [],
          version: "2.19.0"
        },
      };
      const pageRef = await addDoc(collection(db, 'courses', course.id, 'sections', createdSection.id, 'pages'), newPage);
      const createdPage: Page = { id: pageRef.id, ...newPage };
      setPages([...pages, createdPage]);

      // Select the newly created page
      setSelectedPage(createdPage);
    } catch (error) {
      console.error('Error adding section:', error);
      alert('Failed to add section. Please try again.');
    }
  };

  const handleSectionUpdate = async (sectionId: string, title: string) => {
    try {
      await updateDoc(doc(db, 'courses', course!.id, 'sections', sectionId), { title });
      setSections(sections.map(sec => sec.id === sectionId ? { ...sec, title } : sec));
    } catch (error) {
      console.error('Error updating section:', error);
      alert('Failed to update section. Please try again.');
    }
  };

  const handleAddPage = async (sectionId: string) => {
    try {
      const currentPages = pages.filter(page => page.sectionId === sectionId);
      const newPage = {
        title: 'New Page',
        order: currentPages.length,
        sectionId: sectionId,
        content: {
          time: new Date().getTime(),
          blocks: [],
          version: "2.19.0"
        },
      };
      const docRef = await addDoc(collection(db, 'courses', course!.id, 'sections', sectionId, 'pages'), newPage);
      const createdPage: Page = { id: docRef.id, ...newPage };
      setPages([...pages, createdPage]);
      setSelectedPage(createdPage);
    } catch (error) {
      console.error('Error adding page:', error);
      alert('Failed to add page. Please try again.');
    }
  };

  const handlePageUpdate = async (pageId: string, title: string) => {
    try {
      const page = pages.find(p => p.id === pageId);
      if (!page) return;
      await updateDoc(doc(db, 'courses', course!.id, 'sections', page.sectionId, 'pages', pageId), { title });
      setPages(pages.map(p => p.id === pageId ? { ...p, title } : p));
    } catch (error) {
      console.error('Error updating page:', error);
      alert('Failed to update page. Please try again.');
    }
  };

  const handlePageSelect = (page: Page) => {
    setSelectedPage(page);
  };

  const initializeEditor = (data: any) => {
    if (editorRef.current) {
      editorRef.current.destroy();
      editorRef.current = null;
    }

    editorRef.current = new EditorJS({
      holder: 'editorjs',
      data: data,
      onChange: async () => {
        const savedData = await editorRef.current!.save();
        updatePageContent(selectedPage!.id, savedData);
      },
      tools: {
        header: Header,
        list: List,
        image: {
          class: Image,
          config: {
            endpoints: {
              byFile: 'http://localhost:8008/uploadFile', // Replace with your image upload endpoint
              byUrl: 'http://localhost:8008/fetchUrl',    // Replace with your URL fetch endpoint
            }
          }
        },
        embed: Embed,
        code: Code,
        linkTool: LinkTool,
        table: Table,
        warning: Warning,
        quote: Quote,
        marker: Marker,
        checklist: CheckList,
        delimiter: Delimiter,
        inlineCode: InlineCode,
        simpleImage: SimpleImage,
        Math: {
          class: EJLaTeX,
          shortcut: 'CMD+SHIFT+M',
          config: {
            css: '.math-input-wrapper { padding: 5px; }'
          }
        },
      },
      autofocus: true,
    });
  };

  const updatePageContent = async (pageId: string, content: any) => {
    try {
      await updateDoc(doc(db, 'courses', course!.id, 'sections', getSectionIdByPageId(pageId), 'pages', pageId), { content });
      setPages(pages.map(p => p.id === pageId ? { ...p, content } : p));
    } catch (error) {
      console.error('Error updating page content:', error);
      alert('Failed to update page content. Please try again.');
    }
  };

  const getSectionIdByPageId = (pageId: string): string => {
    const page = pages.find(p => p.id === pageId);
    return page ? page.sectionId : '';
  };

  const toggleSectionCollapse = (sectionId: string) => {
    const newCollapsedSections = new Set(collapsedSections);
    if (newCollapsedSections.has(sectionId)) {
      newCollapsedSections.delete(sectionId);
    } else {
      newCollapsedSections.add(sectionId);
    }
    setCollapsedSections(newCollapsedSections);
  };

  const handlePageTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setPageTitle(newTitle);
    if (selectedPage) {
      try {
        await updateDoc(doc(db, 'courses', course!.id, 'sections', selectedPage.sectionId, 'pages', selectedPage.id), { title: newTitle });
        setPages(pages.map(p => p.id === selectedPage.id ? { ...p, title: newTitle } : p));
      } catch (error) {
        console.error('Error updating page title:', error);
        alert('Failed to update page title. Please try again.');
      }
    }
  };

  const onDragEnd = async (result: any) => {
    const { source, destination, type } = result;

    if (!destination) {
      return;
    }

    if (type === 'section') {
      const newSections = Array.from(sections);
      const [reorderedSection] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, reorderedSection);

      setSections(newSections);
      await updateSectionsOrder(newSections);
    } else if (type === 'page') {
      const sourceSectionId = source.droppableId;
      const destSectionId = destination.droppableId;

      const newPages = Array.from(pages);
      const [reorderedPage] = newPages.splice(newPages.findIndex(p => p.id === result.draggableId), 1);
      
      if (sourceSectionId !== destSectionId) {
        reorderedPage.sectionId = destSectionId;
      }

      const insertIndex = newPages.findIndex(p => p.sectionId === destSectionId && p.order >= destination.index);
      if (insertIndex === -1) {
        newPages.push(reorderedPage);
      } else {
        newPages.splice(insertIndex, 0, reorderedPage);
      }

      setPages(newPages);
      await updatePagesOrder(newPages, sourceSectionId, destSectionId);
    }
  };

  const updateSectionsOrder = async (newSections: Section[]) => {
    const batch = writeBatch(db);
    newSections.forEach((section, index) => {
      const sectionRef = doc(db, 'courses', course!.id, 'sections', section.id);
      batch.update(sectionRef, { order: index });
    });
    await batch.commit();
  };

  const updatePagesOrder = async (newPages: Page[], sourceSectionId: string, destSectionId: string) => {
    const batch = writeBatch(db);
    const affectedSections = new Set([sourceSectionId, destSectionId]);

    for (const sectionId of Array.from(affectedSections)) {
      const sectionPages = newPages.filter(page => page.sectionId === sectionId);
      for (const page of sectionPages) {
        const oldPageRef = doc(db, 'courses', course!.id, 'sections', sourceSectionId, 'pages', page.id);
        const newPageRef = doc(db, 'courses', course!.id, 'sections', sectionId, 'pages', page.id);

        if (sectionId !== sourceSectionId) {
          // Page moved to a new section
          batch.delete(oldPageRef);
          batch.set(newPageRef, {
            title: page.title,
            order: sectionPages.indexOf(page),
            content: page.content,
            sectionId: sectionId
          });
        } else {
          // Page stayed in the same section or was reordered
          batch.update(newPageRef, {
            order: sectionPages.indexOf(page),
            sectionId: sectionId
          });
        }
      }
    }

    await batch.commit();
  };

  return (
    <div className="min-h-screen w-full bg-black text-pink-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <div 
          className={`transition-transform duration-300 ${
            isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
          } fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-gray-900 text-white p-4 overflow-y-auto z-40`}
        >
          <div className="flex justify-end items-center mb-4">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
              className="focus:outline-none"
              aria-label={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isSidebarCollapsed ? '→' : '←'}
            </button>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections" type="section">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {sections.map((section, index) => (
                    <Draggable key={section.id} draggableId={section.id} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="bg-gray-800 rounded mb-2"
                        >
                          <div className="flex items-center p-2 h-8">
                            <button 
                              {...provided.dragHandleProps}
                              onClick={() => toggleSectionCollapse(section.id)} 
                              className="mr-2 focus:outline-none"
                              aria-label={collapsedSections.has(section.id) ? 'Expand Section' : 'Collapse Section'}
                            >
                              {collapsedSections.has(section.id) ? '▸' : '▾'}
                            </button>
                            {!isSidebarCollapsed && (
                              <Input
                                value={section.title}
                                onChange={(e) => handleSectionUpdate(section.id, e.target.value)}
                                className="text-white bg-gray-700 border-none w-full text-xs h-6"
                                placeholder="Section Title"
                              />
                            )}
                            {!isSidebarCollapsed && (
                              <Button 
                                {...provided.dragHandleProps}
                                onClick={() => handleAddPage(section.id)} 
                                className="ml-2 text-xs px-2 py-0 h-6"
                              >
                                +
                              </Button>
                            )}
                          </div>
                          {!collapsedSections.has(section.id) && (
                            <Droppable droppableId={section.id} type="page">
                              {(provided) => (
                                <ul
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                  className="mt-1 space-y-1"
                                >
                                  {pages
                                    .filter(page => page.sectionId === section.id)
                                    .sort((a, b) => a.order - b.order)
                                    .map((page, index) => (
                                      <Draggable key={page.id} draggableId={page.id} index={index}>
                                        {(provided) => (
                                          <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="flex items-center bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition-colors duration-200 h-8 pl-6"
                                            onClick={() => handlePageSelect(page)}
                                          >
                                            <span className="truncate text-xs px-2 h-full flex items-center w-full">
                                              {page.title || 'Untitled Page'}
                                            </span>
                                          </li>
                                        )}
                                      </Draggable>
                                    ))}
                                  {provided.placeholder}
                                </ul>
                              )}
                            </Droppable>
                          )}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
          {!isSidebarCollapsed && (
            <Button 
              onClick={handleAddSection} 
              className="w-full mt-4 text-xs px-2 py-1 h-8"
            >
              + Add Section
            </Button>
          )}
        </div>

        {/* Toggle button for collapsed sidebar */}
        {isSidebarCollapsed && (
          <button 
            onClick={() => setIsSidebarCollapsed(false)}
            className="fixed top-24 left-4 z-50 bg-gray-900 text-white p-2 rounded focus:outline-none"
            aria-label="Expand Sidebar"
          >
            →
          </button>
        )}

        {/* Editor */}
        <div className={`flex-1 bg-black transition-all duration-300 ${isSidebarCollapsed ? 'ml-0' : 'ml-64'} mt-20`}>
          {selectedPage ? (
            <div className="max-w-3xl mx-auto px-4">
              <Input
                value={pageTitle}
                onChange={handlePageTitleChange}
                className="text-3xl font-bold mb-8 mt-8 text-white bg-transparent border-b border-pink-500 focus:border-pink-300 focus:outline-none w-full"
                placeholder="Page Title"
              />
              <div id="editorjs" className="bg-black rounded h-full overflow-auto"></div>
            </div>
          ) : (
            <div className="text-white text-center mt-20">Select a page to edit</div>
          )}
        </div>
      </div>
    </div>
  );
}