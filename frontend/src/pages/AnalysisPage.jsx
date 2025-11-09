import React from 'react';
import AnalysisBoard from '../components/AnalysisBoard';

export default function AnalysisPage() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Analysis Board</h2>
      <AnalysisBoard />
    </div>
  );
}
