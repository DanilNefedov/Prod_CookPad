import '@mui/material/styles';


declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        grayButton: true;
        blackRedBtn: true;
        blackBtn: true;
    }
}

declare module '@mui/material/IconButton' {
    interface IconButtonPropsColorOverrides {
        grayRed: true;
        redGray: true;
        white:true;
    }
}

declare module '@mui/material/Chip' {
    interface ChipPropsColorOverrides {
        darkRed: true;
        darkBg:true
    }
}

declare module '@mui/material/TextField' {
    interface TextFieldPropsVariantOverrides {
        underlined: true;
    }
}

declare module '@mui/material/styles' {
    interface CommonColors {
        black46: string;
        cardBlack7:string
    }
    
    interface Palette {
        supportBackground: {
            light: string;
            dark: string;
        };
    }

    interface PaletteOptions {
        supportBackground?: {
            light: string;
            dark: string;
        };
    }

    interface TypeText {
        lightGray?: string;
    }
    
    interface PaletteColor {
        contrast?: string;
    }

    interface SimplePaletteColorOptions {
        contrast?: string;
    }
    
}