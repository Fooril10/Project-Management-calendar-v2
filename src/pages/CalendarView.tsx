import React, { useState, useCallback } from 'react';
import { View } from 'react-big-calendar';
import { dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addMonths, subMonths } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useProjectStore } from '../store/projectStore';
import { CalendarToolbar } from '../components/calendar/CalendarToolbar';
import { AddTaskModal } from '../components/calendar/AddTaskModal';
import { ProjectSidebar } from '../components/calendar/ProjectSidebar';
import { DraggableCalendar } from '../components/calendar/DraggableCalendar';
import { CalendarEvent } from '../types/calendar';
import { TaskVisibilityToggle } from '../components/shared/TaskVisibilityToggle';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    'en-US': enUS,
  },
});

export function CalendarView() {
  const [view, setView] = useState<View>('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const projects = useProjectStore((state) => state.projects);
  const showCompleted = useProjectStore((state) => state.showCompleted);
  const toggleCompletedVisibility = useProjectStore((state) => state.toggleCompletedVisibility);

  const events: CalendarEvent[] = projects
    .filter((project) => project.isVisible)
    .flatMap((project) =>
      project.tasks
        .filter(task => showCompleted || !task.completed)
        .map((task) => ({
          id: task.id,
          title: `${task.title} • ${project.name}`,
          start: task.dateRange ? task.dateRange.start : task.dueDate,
          end: task.dateRange ? task.dateRange.end : task.dueDate,
          allDay: true,
          resource: {
            projectId: project.id,
            taskId: task.id,
            color: project.color,
            isRange: !!task.dateRange,
          },
        }))
    );

  const handleAddTask = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-4">
      <div className="w-64">
        <ProjectSidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousMonth}
                className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={handleToday}
                className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                Today
              </button>
            </div>
          </div>
          <TaskVisibilityToggle
            showCompleted={showCompleted}
            onToggleCompleted={toggleCompletedVisibility}
          />
        </div>
        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
          <DraggableCalendar
            localizer={localizer}
            events={events}
            view="month"
            onView={() => {}}
            hoveredDate={hoveredDate}
            onHoveredDateChange={setHoveredDate}
            onAddTask={handleAddTask}
            date={currentDate}
            onNavigate={setCurrentDate}
            toolbar={false}
          />
        </div>
      </div>
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
      />
    </div>
  );
}