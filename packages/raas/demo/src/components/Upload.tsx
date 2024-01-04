import React, { ChangeEvent, useState } from "react";

import { Wallet } from "ethers";

import { UploadButton } from "./Buttons";
import { uploadToLightHouse } from "../utils";

type FileUploadComponentProps = {
  signer: Wallet;
};
const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  signer,
}) => {
  const [fileData, setFileData] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<Blob | undefined>(undefined);
  const [fileCid, setFileCid] = useState("");

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = e => {
        const result = e.target?.result as string;
        setFileData(result);
      };

      reader.readAsDataURL(file);
      setFile(file);
    }
  };

  const uploadFile = async () => {
    try {
      const res = await uploadToLightHouse(signer, {
        fileName: (file as Blob).name,
        blob: file as Blob,
      });
      console.log("res: ", res);
      setFileCid(res.data.Hash);
    } catch (e) {
      console.log("e: ", e);
    }
  };

  return (
    <div>
      <input type='file' onChange={handleFileUpload} />
      {/* {fileData && <img src={fileData} alt="Uploaded File" />}*/}
      <UploadButton
        onClick={uploadFile}
        // disabled={!state.installedSnap}
      />
      <div>
        {/* <input type="text" value={inputValue} onChange={handleInputChange} />*/}
        <p>{fileCid}</p>
      </div>
    </div>
  );
};

export default FileUploadComponent;
