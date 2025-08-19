'use client';

import { ErrorPageContent } from "@/app/components/ui-helpers/Error";






interface Props {
  reset: () => void;
}

export default function ErrorPage({ reset }: Props) {

  return (
    <ErrorPageContent reset={reset}></ErrorPageContent>
  );
}