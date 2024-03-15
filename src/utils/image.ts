export const getBase64 = (file: any, includeMime: boolean = false): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (includeMime) {
                const encoded: string | ArrayBuffer | null = reader.result;
                resolve(encoded as string);
                return;
            }

            let encoded: string = reader.result as string;
            encoded = encoded.replace(/^data:(.*;base64,)?/, '');
            if (encoded.length % 4 > 0) {
                encoded += '='.repeat(4 - (encoded.length % 4));
            }
            resolve(encoded);
        };
        reader.onerror = error => reject(error);
    });
};

export const createDownloadLink = (content: any) => `data:application/octet-stream;base64,${content}`;
  
export const checkMimeRegex = /(|||\||\|\|)$/i;
  
export const allowedFileTypes = [
    'text/csv',
    'image/png',
    'image/x-citrix-png',
    'image/x-png',
    'image/jpeg',
    'image/x-citrix-jpeg',
    'application/pdf',
    'application/vnd.ms-excel',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const allowedImageTypes = [
    'image/png',
    'image/x-citrix-png',
    'image/x-png',
    'image/jpeg',
    'image/x-citrix-jpeg',
];

export const allowedDocTypes = [
    'text/csv',
    'application/pdf',
    'application/vnd.ms-excel',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const allowedExcelTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
];

export const isImage = (file:any) => !!allowedImageTypes.find(e => e === file.type);

export const isDocument = (file: File): boolean => !!allowedDocTypes.find((e: string) => e === file.type);

export const isFileValid = (file: File): boolean => !!allowedFileTypes.find((e: string) => e === file.type);

export const isLessThan5MB = (file: File): boolean => file.size / 1024 / 1024 < 5;

export const isFileNameLengthLessThan80 = (file: File): boolean => file.name.length < 80;

export const isExcel = (file: File): boolean => !!allowedExcelTypes.find((e: string) => e === file.type);
