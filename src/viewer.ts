import fs from 'fs';

export class viewer {
    files: string[];
    constructor(paths: string[]) {

        this.files = [];
        for (const path of paths) {
            for (const file of fs.readdirSync(path)) {
                console.log(file);
                this.files.push(path + "\\" + file);
            }
        }
    }

    getFiles() {
        return this.files;
    }
}