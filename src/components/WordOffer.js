import React, {useEffect} from "react";
import { TemplateHandler } from 'easy-template-x';

const loadFile = async (url) => {
  const response = await fetch(url)
  const template = await response.blob()
  return template
}

const loadImage = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob()
  console.log(blob)
  return blob
}


function saveFile(filename, blob) {

  const blobUrl = URL.createObjectURL(blob);

  let link = document.createElement("a");
  link.download = filename;
  link.href = blobUrl;


  document.body.appendChild(link);
  link.click();


  setTimeout(() => {
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      link = null;
  }, 0);
}


const WordOffer = () => {

  useEffect(() => {
    loadImage("/logo512.png")
  }, [])

  const img = loadImage("/logo512.png");

  const data = {
    posts: [
        { author: 'Alon Bar', text: 'Very important\ntext here!' },
        { author: 'Alon Bar', text: 'Forgot to mention that...' }
    ],
    'iq': {
      _type: "image",
      source: img,
      format: MimeType.Png,
      width: 200,
      height: 200
  }

};

  const generateDocument = async () => {
    const handler = new TemplateHandler()
    const template = await loadFile('/tag-example.docx')
    const doc = await handler.process(template, data)
    saveFile('myfile.docx', doc)
  }

  return <button onClick={() => generateDocument()}>Create Offer</button>;
}

export default WordOffer;
