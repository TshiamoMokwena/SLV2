export const extractYouTubeVideoId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
}

export const fetchYouTubeThumbnail = async (videoId: string): Promise<string> => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
