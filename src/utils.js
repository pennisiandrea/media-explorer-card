
export function isDirectory(item) {
    return item?.media_class === "directory";
}
export function isImage(item) {
    return item?.media_class === "image";
}
export function isVideo(item) {
    return item?.media_class === "video";
}
export function isAudio(item) {
    return item?.media_class === "audio";
}