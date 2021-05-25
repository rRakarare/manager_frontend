import React from "react";
import { TemplateHandler } from "easy-template-x";
var _ = require("lodash");

const WordTemplateReplace = ({ filepath, filename, data, render }) => {



  const loadFile = async (url) => {
    const response = await fetch(url);
    const template = await response.blob();
    return template;
  };

  const getImage = async (url, width, height) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return {
      _type: "image",
      source: blob,
      format: blob.type,
      width: width,
      height: height,
    };
  };

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

  const datanew = async () => {
    const allkeys = Object.keys(data);
    allkeys.forEach((key) => {
      if (_.isArray(data[key])) {
        data[key].forEach((subobject, subindex) => {
          const subkeys = Object.keys(subobject);
          subkeys.forEach((subkey) => {
            if (data[key][subindex][subkey].isImage) {
              getImage(
                data[key][subindex][subkey].url,
                data[key][subindex][subkey].width,
                data[key][subindex][subkey].height
              ).then((res) => (data[key][subindex][subkey] = res));
            }
          });
        });
      } else {
        if (data[key].isImage) {
          getImage(data[key].url, data[key].width, data[key].height).then(
            (res) => (data[key] = res)
          );
        }
      }
    });


    return data;
  };

  const generateDocument = async () => {
    const handler = new TemplateHandler();
    const template = await loadFile(filepath);

    const data = await datanew();

    const doc = await handler.process(template, data);
    saveFile(filename, doc);
  };


  return render(generateDocument);
};

WordTemplateReplace.defaultProps = {
  render: (generateDocument) => (<button onClick={() => generateDocument()}>Word-Document</button>)
}

export default WordTemplateReplace;
