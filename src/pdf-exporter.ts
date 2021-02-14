import { Config, RawOrParsedDelta } from './interfaces';
import {default as PdfBuilder } from './pdf-builder';

export class PdfExporter {

    private readonly _pdfBuilder: PdfBuilder;

    constructor() {
        this._pdfBuilder = new PdfBuilder();
    }

    // This is the function that should be called by external users.
    // Accepts a raw Quill delta or a parsed Quill delta (or an array of either)
    public generatePdf(delta: RawOrParsedDelta, config: Config): Promise<Blob | object> {
        return new Promise((resolve, reject) => {
            try {
                let doc: any;
                const stream = this._pdfBuilder.getPdfStream(doc, delta, config);
                console.log('stream', stream);
                /*
                stream.on('finish', () => {
                    const blob = stream.toBlob('application/pdf');
                    resolve(blob);
                });
                */
               resolve(stream.toBlob('application/pdf'));
            } catch (err) {
                reject(err);
            }
        });
    }
}

const exposedInstance = new PdfExporter();

export default exposedInstance;