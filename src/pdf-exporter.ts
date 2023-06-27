import { Buffer } from './blob-stream';
import { Config, RawOrParsedDelta } from './interfaces';
import {default as PdfBuilder } from './pdf-builder';

export class PdfExporter {

    private readonly _pdfBuilder: PdfBuilder;

    constructor() {
        this._pdfBuilder = new PdfBuilder();
    }

    // This is the function that should be called by external users.
    // Accepts a raw Quill delta or a parsed Quill delta (or an array of either)
    public generatePdf(delta: RawOrParsedDelta, config?: Config): Promise<Blob> {
        return new Promise(async (resolve, reject) => {
            try {
                let doc: any;
                const stream = await this._pdfBuilder.getPdfStream(doc, delta, config);
                stream.on('finish', () => {
                    const blob = stream.toBlob('application/pdf');
                    resolve(blob);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    // This is the function that should be called by external users.
    // Accepts a raw Quill delta or a parsed Quill delta (or an array of either)
    public generatePdfBase64(delta: RawOrParsedDelta, config?: Config): Promise<String> {
        return new Promise(async (resolve, reject) => {
           try {
                let doc: any;
                const stream = await this._pdfBuilder.getPdfStream(doc, delta, config);
                stream.on('finish', () => {
                    const reader =new FileReader()
                    reader.readAsDataURL(stream.toBlob('application/pdf'));
                    reader.onloadend = () => {
                        if(reader.result) resolve((reader.result as string).replace(/^data:.+;base64,/, 'data:application/pdf;base64,'));
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}

const exposedInstance = new PdfExporter();

export default exposedInstance;
