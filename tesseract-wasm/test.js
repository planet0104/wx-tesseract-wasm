import { createOCREngine } from 'tesseract-wasm';
import fs from 'fs';
import { getSync } from '@andreekeberg/imagedata'

function readFileToBuffer(filePath){
  return new Promise((resolve, reject) =>{
    fs.readFile(filePath, (err, data) => {
      if(err){
        reject(err);
      }else{
        resolve(data);
      }
    });
  })
}

async function runOCR() {

  var wasmBinaryFileData = await readFileToBuffer('./dist/tesseract-core.wasm');

  const wasmBinary = new Uint8Array(wasmBinaryFileData.buffer);

  let ocrEngine = await createOCREngine({
    wasmBinary,
    progressChannel: {
      postMessage: msg => {
        console.log('progress>', msg);
      },
    }
  });

  console.log('ocrEngine创建成功');

  console.log('加载模型...');

  const model = new Uint8Array((await readFileToBuffer('./chi_sim.traineddata')).buffer);

  ocrEngine.loadModel(model);

  console.log('读取图片...');

  const imageData = getSync('test.png');

  console.log('加载图片...');
  ocrEngine.loadImage(imageData);

  console.log('识别文字...');
  let text = ocrEngine.getText();

  console.log('识别结果:', text);
}

runOCR();