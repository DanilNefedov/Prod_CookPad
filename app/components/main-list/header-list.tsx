import { AppBar, Button} from "@mui/material";
import Link from "next/link";
import { btnMain } from "@/app/main-styles";
import { headers } from "next/headers";



export async function HeaderList({pathname}:{pathname:string}) {
    // const headersList = await headers();
    // const referer = headersList.get('referer') || '';
    // const url = new URL(referer);
    // const pathname = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;

    // const headersList = headers();
    // const pathname = headersList.get("x-pathname") || "/";
    
    console.log(pathname)
    return (
        <AppBar position="static" sx={{ 
            backgroundColor: 'background.default', 
            alignItems: 'center', 
            m: '10px 0', 
            justifyContent:'center',
            flexDirection:'inherit',
            borderRadius:'10px',
            p:'10px 0',
            gap:'20px'
        }}>
            <Button
                component={Link}
                sx={{...btnMain, 
                    mb:'0', 
                    p:'6px 15px', 
                    minWidth:'100px',
                    backgroundColor:pathname === 'list' ? 'primary.main' : 'background.paper'
                }}
                href='/list'
            >
                List
            </Button>
            <Button
                component={Link}
                sx={{...btnMain, 
                    mb:'0', 
                    p:'6px 15px', 
                    minWidth:'100px',
                    backgroundColor:pathname === 'list-recipe' ? 'primary.main' : 'background.paper'
                }}
                href='/list-recipe'
            >
                Recipes
            </Button>
        </AppBar>
    )
}