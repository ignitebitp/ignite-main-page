'use client';

import React, { Suspense } from 'react';
import Attend from '@/views/Attend';

export default function AttendPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-gray-500 font-mono-code text-sm">Loading attendance...</div>}>
      <Attend />
    </Suspense>
  );
}
