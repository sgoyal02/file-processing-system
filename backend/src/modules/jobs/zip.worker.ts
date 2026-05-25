// import { workerData, parentPort } from 'worker_threads';
// import * as archiver from 'archiver';
// import fs from 'fs';
// import path from 'path';

const { workerData, parentPort } = require('worker_threads');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

console.log("start worker data: ", workerData);
const createZip = async () => {
    try {
    const outDir = path.dirname(workerData.outPath);
    await fs.promises.mkdir(outDir, {recursive: true});
    const output = fs.createWriteStream(workerData.outPath);
    const archive = archiver('zip', {zlib:{level: 6}});
    archive.pipe(output);

    let comp = 0;     //comp calc
    for (const file of workerData.filesData) {
        archive.file(file.path, {name:file.name});
        comp++;
        parentPort?.postMessage({
            type: 'progress',
            progress: Math.round((comp/workerData.filesData.length) * 90) //till 90per--later comp
        });
    }
    await new Promise<void>((resolve, reject) => {  //waiting tillzip comp --?
        output.on('close', resolve);
        archive.on('error', reject);
        archive.finalize();
    });
    parentPort?.postMessage({type: 'done', outputPath: workerData.outPath});
    }catch(err: any) {
        parentPort?.postMessage({type: 'error', message: err.message});
    }
}

createZip();