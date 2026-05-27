import { workerData, parentPort } from 'worker_threads';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

console.log("start worker data: ", workerData);
export const createZip = async () => {
    try {
    const outDir = path.dirname(workerData.outPath);
    await fs.promises.mkdir(outDir, {recursive: true});
    const output = fs.createWriteStream(workerData.outPath);
    const archive = archiver('zip', {zlib:{level: 6}});
    archive.pipe(output);

    const steps = [10, 30, 50, 70, 90];
    for (const progress of steps) {
      parentPort?.postMessage({ type: 'progress', progress });
      await new Promise(r => setTimeout(r, 800));
    }

    for (const file of workerData.filesData) {
        archive.file(file.path, {name:file.name});
        // comp++;
        // parentPort?.postMessage({
        //     type: 'progress',
        //     progress: Math.round((comp/workerData.filesData.length) * 90) //till 90per--later comp
        // });
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