import React from 'react';
import Container from '../components/Container';

const TailwindProbe = () => {
  return (
    <div className="min-h-screen bg-red-200 py-10">
      <Container>
        <div className="rounded-2xl border-4 border-blue-700 bg-green-200 p-8 shadow-lg">
          <h1 className="text-6xl font-bold text-blue-600">Tailwind Test</h1>
          <p className="mt-4 text-xl text-neutral-800">If this page is styled, Tailwind is working at runtime.</p>
          <p className="mt-2 text-sm text-neutral-700">If this green box is centered, the global container is also working.</p>
        </div>
      </Container>
    </div>
  );
};

export default TailwindProbe;