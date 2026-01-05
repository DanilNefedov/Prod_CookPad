


export const getImageSrc = (value?: string, options = 'c_fill,w_64,h_64,q_auto,f_auto'): string | undefined => {
    if (!value) return undefined;

    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('Cloudinary cloud name is missing');
        }
        return undefined;
    }

    return `https://res.cloudinary.com/${cloudName}/image/upload${options ? `/${options}` : ''}/${value}`;
};