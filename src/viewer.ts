import fs from 'fs';

export class viewer {
    files: string[];
    constructor(paths: string[], extensions: string[]) {

        this.files = [];
        for (const path of paths) {
            for (const file of fs.readdirSync(path)) {
                for (const extension of extensions) {
                    if (file.endsWith(extension)) {
                        this.files.push(path + "\\" + file);
                    }
                }
            }
        }
    }

    getFiles(): string[] {
        return this.files;
    }
}