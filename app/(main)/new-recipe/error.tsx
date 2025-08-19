'use client';


import { ErrorPageContent } from "@/app/components/ui-helpers/ErrorPageContent";






interface Props {
  // error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: Props) {

  return (
    <ErrorPageContent reset={reset}></ErrorPageContent>
  );
}