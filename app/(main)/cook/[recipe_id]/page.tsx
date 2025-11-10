import { ContentCook } from '@/app/components/cook/ContentCook'
import { getUserId } from '@/app/helpers/user-data-cashe';
import { auth } from '@/config/auth/auth';




export default async function Cook({ params }: { params: { recipe_id: string } }) {
  const { recipe_id } = await params;
  const session = await auth()

  console.log(recipe_id, session?.user.connection_id)
  
  return (
    <ContentCook />
  )
}
