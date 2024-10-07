"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  doc, getDoc, updateDoc, collection, addDoc, getDocs, 
  orderBy, query, writeBatch, deleteDoc, serverTimestamp, Timestamp 
} from 'firebase/firestore';
import { db } from '../../../../lib/firebase/firebase';
import { useAuth } from '../../../../lib/contexts/AuthContext';
import Navbar from "../../../../components/ui/navbar";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import EditorJS from '@editorjs/editorjs';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { MoreVertical, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../../components/ui/dialog";
import { Toaster } from "../../../../components/ui/toaster";
import { useToast } from "../../../../components/ui/use-toast";
import EditCourseDetailsModal from '../../../../components/edit-course-details-modal';
import dynamic from 'next/dynamic';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../../components/ui/alert-dialog";

const EditorJSComponent = dynamic(
  () => import('../../../../components/ui/editorjs'),
  { ssr: false }
);

const DragDropContextComponent = dynamic(
  () => import('react-beautiful-dnd').then((mod) => mod.DragDropContext),
  { ssr: false }
);

const DroppableComponent = dynamic(
  () => import('react-beautiful-dnd').then((mod) => mod.Droppable),
  { ssr: false }
);

const DraggableComponent = dynamic(
  () => import('react-beautiful-dnd').then((mod) => mod.Draggable),
  { ssr: false }
);

interface Course {
  id: string;
  title: string;
  description: string;
  medium: string;
  price: number;
  published: boolean;
  authorId: string;
  location: string;
  schedule: string;
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

interface Version {
  id: string;
  name: string;
  timestamp: Timestamp;
  data: {
    sections: Section[];
    pages: Page[];
  };
}

export default function EditCourse() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [pageTitle, setPageTitle] = useState<string>('');
  const editorRef = useRef<EditorJS | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ type: 'section' | 'page', id: string, sectionId?: string } | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [isViewingVersions, setIsViewingVersions] = useState(false);
  const [editingVersionId, setEditingVersionId] = useState<string | null>(null);
  const [editingVersionName, setEditingVersionName] = useState<string>('');
  const { toast } = useToast();
  const [isEditingCourseDetails, setIsEditingCourseDetails] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [restoreConfirmation, setRestoreConfirmation] = useState<Version | null>(null);

  useEffect(() => {
    if (user && id) {
      fetchCourse();
      fetchSections();
    }
  }, [user, id]);

  useEffect(() => {
    if (selectedPage) {
      setPageTitle(selectedPage.title);
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
    const sectionsList = sectionsSnapshot.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as Section));
    setSections(sectionsList);

    // Fetch pages for each section
    const allPages: Page[] = [];
    for (const section of sectionsList) {
      const pagesCollection = collection(db, 'courses', id as string, 'sections', section.id, 'pages');
      const qPage = query(pagesCollection, orderBy('order'));
      const pagesSnapshot = await getDocs(qPage);
      const pagesList = pagesSnapshot.docs.map((doc: QueryDocumentSnapshot) => ({
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

  const handleDeleteSection = async (sectionId: string) => {
    setDeleteConfirmation({ type: 'section', id: sectionId });
  };

  const handleDeletePage = async (pageId: string, sectionId: string) => {
    setDeleteConfirmation({ type: 'page', id: pageId, sectionId });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation || !course) return;

    try {
      if (deleteConfirmation.type === 'section') {
        const sectionId = deleteConfirmation.id;
        // Delete all pages in the section
        const pagesQuery = query(collection(db, 'courses', course.id, 'sections', sectionId, 'pages'));
        const pagesSnapshot = await getDocs(pagesQuery);
        const batch = writeBatch(db);
        pagesSnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        // Delete the section
        batch.delete(doc(db, 'courses', course.id, 'sections', sectionId));
        await batch.commit();

        // Update local state
        setSections(sections.filter(section => section.id !== sectionId));
        setPages(pages.filter(page => page.sectionId !== sectionId));
        if (selectedPage && selectedPage.sectionId === sectionId) {
          setSelectedPage(null);
        }
      } else if (deleteConfirmation.type === 'page' && deleteConfirmation.sectionId) {
        const { id: pageId, sectionId } = deleteConfirmation;
        await deleteDoc(doc(db, 'courses', course.id, 'sections', sectionId, 'pages', pageId));
        setPages(pages.filter(p => p.id !== pageId));
        if (selectedPage && selectedPage.id === pageId) {
          setSelectedPage(null);
        }
      }
    } catch (error) {
      console.error(`Error deleting ${deleteConfirmation.type}:`, error);
      alert(`Failed to delete ${deleteConfirmation.type}. Please try again.`);
    }

    setDeleteConfirmation(null);
  };

  const handleSaveVersion = async () => {
    if (!course) return;
    try {
      const versionData = {
        timestamp: serverTimestamp(),
        name: `Version ${versions.length + 1}`,
        data: {
          sections: sections,
          pages: pages,
        },
      };
      const docRef = await addDoc(collection(db, 'courses', course.id, 'versions'), versionData);
      const newVersion: Version = { id: docRef.id, ...versionData, timestamp: Timestamp.now() };
      setVersions([newVersion, ...versions]);
      toast({
        title: "Success",
        description: "Version saved successfully!",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error saving version:', error);
      toast({
        title: "Error",
        description: "Failed to save version. Please try again.",
        duration: 3000,
        variant: "destructive",
      });
    }
  };

  const handleViewVersions = async () => {
    if (!course) return;
    try {
      const versionsCollection = collection(db, 'courses', course.id, 'versions');
      const q = query(versionsCollection, orderBy('timestamp', 'desc'));
      const versionsSnapshot = await getDocs(q);
      const versionsList = versionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Version));
      setVersions(versionsList);
      setIsViewingVersions(true);
    } catch (error) {
      console.error('Error fetching versions:', error);
      alert('Failed to fetch versions. Please try again.');
    }
  };

  const handleRestoreVersion = async (version: Version) => {
    setRestoreConfirmation(version);
  };

  const confirmRestore = async (shouldSaveCurrent: boolean) => {
    if (!course || !restoreConfirmation) return;
    
    if (shouldSaveCurrent) {
      await handleSaveVersion();
    }

    try {
      // Update sections
      const sectionsBatch = writeBatch(db);
      restoreConfirmation.data.sections.forEach((section) => {
        const sectionRef = doc(db, 'courses', course.id, 'sections', section.id);
        sectionsBatch.set(sectionRef, section);
      });
      await sectionsBatch.commit();

      // Update pages
      const pagesBatch = writeBatch(db);
      restoreConfirmation.data.pages.forEach((page) => {
        const pageRef = doc(db, 'courses', course.id, 'sections', page.sectionId, 'pages', page.id);
        pagesBatch.set(pageRef, page);
      });
      await pagesBatch.commit();

      // Update local state
      setSections(restoreConfirmation.data.sections);
      setPages(restoreConfirmation.data.pages);
      setIsViewingVersions(false);
      toast({
        title: "Success",
        description: "Version restored successfully!",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error restoring version:', error);
      toast({
        title: "Error",
        description: "Failed to restore version. Please try again.",
        duration: 3000,
        variant: "destructive",
      });
    }

    setRestoreConfirmation(null);
  };

  const handleEditVersionName = async (version: Version) => {
    if (!course) return;
    try {
      await updateDoc(doc(db, 'courses', course.id, 'versions', version.id), { name: editingVersionName });
      setVersions(versions.map(v => v.id === version.id ? { ...v, name: editingVersionName } : v));
      setEditingVersionId(null);
      toast({
        title: "Success",
        description: "Version name updated successfully!",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating version name:', error);
      toast({
        title: "Error",
        description: "Failed to update version name. Please try again.",
        duration: 3000,
        variant: "destructive",
      });
    }
  };

  const handleEditCourseDetails = async (courseData: { description: string; medium: string; price: number; location: string; schedule: string }) => {
    if (!course) return;
    try {
      await updateDoc(doc(db, 'courses', course.id), courseData);
      setCourse({ ...course, ...courseData });
      setIsEditingCourseDetails(false);
      toast({
        title: "Success",
        description: "Course details updated successfully!",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating course details:', error);
      toast({
        title: "Error",
        description: "Failed to update course details. Please try again.",
        duration: 3000,
        variant: "destructive",
      });
    }
  };

  // Add this function to check if the content is valid
  const isValidContent = (content: any) => {
    return content && typeof content === 'object' && Array.isArray(content.blocks);
  };

  const handleEditorChange = (data: any) => {
    if (selectedPage) {
      updatePageContent(selectedPage.id, data);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-pink-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <div 
          className={`transition-transform duration-300 ${
            isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
          } fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-gray-900 text-white z-40 flex flex-col`}
        >
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex justify-end items-center mb-4">
              <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                className="focus:outline-none"
                aria-label={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {isSidebarCollapsed ? '→' : '←'}
              </button>
            </div>
            <DragDropContextComponent onDragEnd={onDragEnd}>
              <DroppableComponent droppableId="sections" type="section">
                {(provided) => (
                  <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {sections.map((section, index) => (
                      <DraggableComponent key={section.id} draggableId={section.id} index={index}>
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
                              {!isSidebarCollapsed && (
                                <Button
                                  onClick={() => handleDeleteSection(section.id)}
                                  className="ml-2 text-white p-1 rounded h-5 w-5 flex items-center justify-center cursor-pointer transition-colors duration-200"
                                  title="Delete Section"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                            {!collapsedSections.has(section.id) && (
                              <DroppableComponent droppableId={section.id} type="page">
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
                                        <DraggableComponent key={page.id} draggableId={page.id} index={index}>
                                          {(provided) => (
                                            <li
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              className="flex items-center justify-between bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition-colors duration-200 h-8 pl-6"
                                            >
                                              <span className="truncate text-xs px-2 h-full flex items-center w-full" onClick={() => handlePageSelect(page)}>
                                                {page.title || 'Untitled Page'}
                                              </span>
                                              <Button
                                                onClick={() => handleDeletePage(page.id, section.id)}
                                                className="mr-2 text-white p-1 rounded h-4 w-4 flex items-center justify-center cursor-pointer transition-colors duration-200"
                                                title="Delete Page"
                                              >
                                                <Trash2 className="h-2 w-2" />
                                              </Button>
                                            </li>
                                          )}
                                        </DraggableComponent>
                                      ))}
                                    {provided.placeholder}
                                  </ul>
                                )}
                              </DroppableComponent>
                            )}
                          </li>
                        )}
                      </DraggableComponent>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </DroppableComponent>
            </DragDropContextComponent>
            {!isSidebarCollapsed && (
              <Button 
                onClick={handleAddSection} 
                className="w-full mt-4 text-xs px-2 py-1 h-8"
              >
                + Add Section
              </Button>
            )}
          </div>
          
          {/* New buttons for saving and viewing versions, and editing course details */}
          {!isSidebarCollapsed && (
            <div className="p-2 bg-gray-800">
              <div className="flex space-x-2 mb-2">
                <Button 
                  onClick={handleSaveVersion} 
                  className="flex-1 text-xs px-2 py-1 h-6 bg-white text-black hover:bg-gray-200"
                >
                  Save Version
                </Button>
                <Button 
                  onClick={handleViewVersions} 
                  className="flex-1 text-xs px-2 py-1 h-6 bg-white text-black hover:bg-gray-200"
                >
                  View Versions
                </Button>
              </div>
              <Button 
                onClick={() => setIsEditingCourseDetails(true)} 
                className="w-full text-xs px-2 py-1 h-6 bg-white text-black hover:bg-gray-200"
              >
                Course Details
              </Button>
            </div>
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
            <div className="max-w-5xl mx-auto px-4 pb-32">
              <Input
                value={pageTitle}
                onChange={handlePageTitleChange}
                className="text-3xl font-bold mb-8 mt-8 text-white bg-transparent border-b border-pink-500 focus:border-pink-300 focus:outline-none w-full"
                placeholder="Page Title"
              />
              {editorError ? (
                <div className="text-red-500 mb-4">{editorError}</div>
              ) : (
                <EditorJSComponent
                  key={selectedPage.id}
                  data={selectedPage.content}
                  onChange={handleEditorChange}
                />
              )}
              <div className="h-32"></div>
            </div>
          ) : (
            <div className="text-white text-center mt-20">Select a page to edit</div>
          )}
        </div>
      </div>

      {/* Add this Dialog component at the end of the JSX, before the closing div */}
      <Dialog open={deleteConfirmation !== null} onOpenChange={() => setDeleteConfirmation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {deleteConfirmation?.type}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update this Dialog for viewing versions */}
      <Dialog open={isViewingVersions} onOpenChange={setIsViewingVersions}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Saved Versions</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {versions.map((version) => (
              <div key={version.id} className="flex justify-between items-center p-2 border-b">
                {editingVersionId === version.id ? (
                  <Input
                    value={editingVersionName}
                    onChange={(e) => setEditingVersionName(e.target.value)}
                    onBlur={() => handleEditVersionName(version)}
                    onKeyPress={(e) => e.key === 'Enter' && handleEditVersionName(version)}
                    className="mr-2 text-black" // Added text-black class here
                  />
                ) : (
                  <span onClick={() => {
                    setEditingVersionId(version.id);
                    setEditingVersionName(version.name);
                  }}>
                    {version.name} - {version.timestamp.toDate().toLocaleString()}
                  </span>
                )}
                <Button onClick={() => handleRestoreVersion(version)}>Restore</Button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewingVersions(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditCourseDetailsModal
        isOpen={isEditingCourseDetails}
        onClose={() => setIsEditingCourseDetails(false)}
        onSubmit={handleEditCourseDetails}
        initialData={{
          description: course?.description || '',
          medium: course?.medium || '',
          price: course?.price || 0,
          location: course?.location || '',
          schedule: course?.schedule || '',
        }}
      />

      <Toaster />

      {/* Add this new AlertDialog component at the end of the JSX, before the closing div */}
      <AlertDialog open={restoreConfirmation !== null} onOpenChange={() => setRestoreConfirmation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Version</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to save the current version before restoring?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRestoreConfirmation(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmRestore(false)}>Don't Save, Just Restore</AlertDialogAction>
            <AlertDialogAction onClick={() => confirmRestore(true)}>Save and Restore</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}