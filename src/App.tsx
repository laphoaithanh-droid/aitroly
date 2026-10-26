import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AppProvider, useApp, NavView } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { CompetitionShowcase } from './components/showcase/CompetitionShowcase';
import { StudentManagement } from './components/students/StudentManagement';
import { ClassroomManagement } from './components/classroom/ClassroomManagement';
import { EnglishWorld } from './components/learning/EnglishWorld';
import { MathWorld } from './components/learning/MathWorld';
import { VietnameseWorld } from './components/learning/VietnameseWorld';
import { InformaticsWorld } from './components/learning/InformaticsWorld';
import { GameHub } from './components/games/GameHub';
import { AIBuddyChat } from './components/ai/AIBuddyChat';
import { AITeacherAssistant } from './components/ai/AITeacherAssistant';
import { DifferentiatedAssignmentHub } from './components/assignments/DifferentiatedAssignmentHub';
import { DigitalLibrary } from './components/resources/DigitalLibrary';
import { ParentPortal } from './components/parent/ParentPortal';
import { ReportsAnalytics } from './components/reports/ReportsAnalytics';
import { DatabaseModal } from './components/database/DatabaseModal';
import { ApiKeyModal } from './components/settings/ApiKeyModal';
import { SubjectWorld } from './components/learning/SubjectWorld';
import { ClassModal } from './components/classroom/ClassModal';
import { TeacherProfileModal } from './components/settings/TeacherProfileModal';
import { SubjectModal } from './components/subjects/SubjectModal';
import { LessonEditorModal } from './components/learning/LessonEditorModal';
import { LoginModal } from './components/auth/LoginModal';
import { ChangePasswordModal } from './components/auth/ChangePasswordModal';
import { SaveBackupModal } from './components/settings/SaveBackupModal';
import { SaveToast } from './components/common/SaveToast';

const MainLayout: React.FC = () => {
  const { activeView, isApiKeyModalOpen, setApiKeyModalOpen } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Fixed Left Sidebar */}
      <Sidebar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Container (offset by sidebar width on desktop) */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
        {/* Top Header with Role Switcher & Contest Ribbon */}
        <div className="relative">
          {/* Mobile hamburger toggle */}
          <div className="lg:hidden absolute left-3 top-2.5 z-40">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-xl bg-slate-800 text-white shadow-md hover:bg-slate-700 transition-colors"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <Header />
        </div>

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeView === 'dashboard' && <Dashboard />}
          {activeView === 'competition' && <CompetitionShowcase />}
          {activeView === 'students' && <StudentManagement />}
          {activeView === 'classroom' && <ClassroomManagement />}
          {activeView === 'english' && <EnglishWorld />}
          {activeView === 'math' && <MathWorld />}
          {activeView === 'vietnamese' && <VietnameseWorld />}
          {activeView === 'informatics' && <InformaticsWorld />}
          {activeView === 'games' && <GameHub />}
          {activeView === 'aibuddy' && <AIBuddyChat />}
          {activeView === 'assistant' && <AITeacherAssistant />}
          {activeView === 'assignments' && <DifferentiatedAssignmentHub />}
          {activeView === 'materials' && <DigitalLibrary />}
          {activeView === 'parents' && <ParentPortal />}
          {activeView === 'reports' && <ReportsAnalytics />}
          {activeView === 'subject-world' && <SubjectWorld />}
        </main>

        {/* Online Database Connection & Cloud Sync Modal */}
        <DatabaseModal />

        {/* Multi-Class Switcher & Creator Modal */}
        <ClassModal />

        {/* Teacher Profile & School Settings Modal */}
        <TeacherProfileModal />

        {/* Subject Management & New Subject Creator Modal */}
        <SubjectModal />

        {/* Lesson Editor Modal for all subjects and grades */}
        <LessonEditorModal />

        {/* Gemini API Key & Model Setup Modal */}
        <ApiKeyModal
          isOpen={isApiKeyModalOpen}
          onClose={() => setApiKeyModalOpen(false)}
        />

        {/* Authentication Login & Session Modal */}
        <LoginModal />

        {/* Teacher Change Password Modal */}
        <ChangePasswordModal />

        {/* Save & Full Backup Management Modal */}
        <SaveBackupModal />

        {/* Global Save Toast Notification */}
        <SaveToast />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
