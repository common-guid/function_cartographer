export async function openDirectory(): Promise<FileSystemDirectoryHandle> {
    // @ts-ignore: File System Access API might need types or be experimental
    return window.showDirectoryPicker();
}
