import { Box } from '@mui/material'
import { headerCook, mainBoxCook } from './styles'
import { ContentCook } from '@/app/components/cook/content-cook'
import { HeaderCook } from '@/app/components/cook/header-cook'
import { CookProvider } from '@/app/components/cook/cook-provider'




export default async function Cook({params}: {params: Promise<{ recipe_id: string }>}) {
  const {recipe_id} = await params

  return (
    <CookProvider recipe_id={recipe_id} >
      <Box sx={mainBoxCook}>
        <Box sx={headerCook}>
          <HeaderCook recipe_id={recipe_id} />
        </Box>
        <ContentCook recipe_id={recipe_id} />
      </Box>
    </CookProvider>
  )
}
