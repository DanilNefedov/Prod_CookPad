'use client'

import { ErrorPageContent } from "@/app/components/ux-helpers/error";



interface DataProps {
    reset: () => void;
}

export default function ErrorPage({ reset }: DataProps) {

    return (
        <ErrorPageContent reset={reset}></ErrorPageContent>
    );
}