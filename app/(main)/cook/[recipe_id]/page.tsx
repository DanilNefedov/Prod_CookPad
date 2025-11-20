import { ContentCook } from '@/app/components/cook/ContentCook'



interface CookPageProps {
  params: { recipe_id: string };
}


export default async function Cook({ params }: CookPageProps) {
  const { recipe_id } = await params;


  return (
    <ContentCook recipe_id={recipe_id} />
  )
}
