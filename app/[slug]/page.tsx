'use client';

import React, { Suspense } from 'react';
import MegaEvent from '@/views/MegaEvent';

export default function DynamicEventPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-gray-500 font-mono-code text-sm">Loading event...</div>}>
      <MegaEvent />
    </Suspense>
  );
}
