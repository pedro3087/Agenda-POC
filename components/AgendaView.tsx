
import React from 'react';
import type { Agenda, Topic } from '../types';
import { ClockIcon, UsersIcon, SparklesIcon } from './icons';

interface AgendaViewProps {
  agenda: Agenda | null;
  isLoading: boolean;
  error: string | null;
}

const Placeholder: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
    <SparklesIcon className="w-16 h-16 mb-4 text-slate-400" />
    <h2 className="text-xl font-semibold text-slate-700">Ready to build your agenda?</h2>
    <p className="max-w-md mt-2">
      Upload a document using the panel on the left and click "Generate Agenda" to see the magic happen.
    </p>
  </div>
);

const LoadingSkeleton: React.FC = () => (
  <div className="p-8 animate-pulse">
    <div className="h-8 bg-slate-200 rounded w-3/4 mb-6"></div>
    <div className="h-6 bg-slate-200 rounded w-1/2 mb-8"></div>
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-start space-x-4">
          <div className="w-16">
            <div className="h-5 bg-slate-200 rounded-full w-full"></div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-4/6"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-red-600 bg-red-50 p-8 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-xl font-semibold">An Error Occurred</h3>
      <p className="mt-2 text-sm">{message}</p>
    </div>
);

const TimelineItem: React.FC<{ topic: Topic, isLast: boolean }> = ({ topic, isLast }) => (
  <div className="relative pl-12 pb-8">
    {!isLast && <div className="absolute top-3 left-3.5 w-0.5 h-full bg-slate-200"></div>}
    <div className="absolute top-1 left-0 flex items-center justify-center w-8 h-8 bg-white border-2 border-slate-200 rounded-full">
      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
    </div>
    <div className="flex items-baseline">
      <h3 className="font-bold text-slate-800 text-lg">{topic.title}</h3>
      <div className="ml-4 flex items-center text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
        <ClockIcon className="w-4 h-4 mr-1.5" />
        {topic.duration} min
      </div>
    </div>
    <p className="mt-1 text-slate-600">{topic.summary}</p>
  </div>
);

const AgendaView: React.FC<AgendaViewProps> = ({ agenda, isLoading, error }) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  if (error) {
    return <ErrorDisplay message={error} />;
  }
  if (!agenda) {
    return <Placeholder />;
  }

  const totalDuration = agenda.topics.reduce((sum, topic) => sum + topic.duration, 0);

  return (
    <div className="p-4 sm:p-6 md:p-8 overflow-y-auto h-full">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{agenda.title}</h2>
          <div className="mt-4 flex flex-wrap gap-4 text-slate-600">
            <div className="flex items-center">
              <UsersIcon className="w-5 h-5 mr-2 text-slate-400" />
              <strong className="mr-2">Stakeholders:</strong>
              <div className="flex flex-wrap gap-2">
                {agenda.stakeholders.map((name, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-5 h-5 mr-2 text-slate-400" />
              <strong className="mr-2">Total Time:</strong>
              <span>{totalDuration} minutes</span>
            </div>
          </div>
        </header>

        <div>
          {agenda.topics.map((topic, index) => (
            <TimelineItem
              key={index}
              topic={topic}
              isLast={index === agenda.topics.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgendaView;
