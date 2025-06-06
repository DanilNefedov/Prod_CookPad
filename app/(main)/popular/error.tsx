'use client';

import { ErrorPageContent } from "@/app/components/ux-helpers/error";






interface DataProps {
  // error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: DataProps) {

  return (
    <ErrorPageContent reset={reset}></ErrorPageContent>
  );
}