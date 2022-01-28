import { saveAs } from "file-saver";

const dlGraph = (reference, name) => {
    let svgURL = new XMLSerializer().serializeToString(reference);
    let svgBlob = new Blob([svgURL], { type: "image/svg+xml;charset=utf-8" });
    saveAs(svgBlob, name);
}

export default dlGraph