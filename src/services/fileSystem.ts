export async function openDirectory(): Promise<FileSystemDirectoryHandle> {
    if (!('showDirectoryPicker' in window)) {
        throw new Error(
            'This browser does not support the File System Access API. ' +
            'Please use a Chromium-based browser (Chrome, Edge, Brave) version 86 or later.'
        );
    }
    // @ts-ignore: File System Access API might need types or be experimental
    return window.showDirectoryPicker();
}
