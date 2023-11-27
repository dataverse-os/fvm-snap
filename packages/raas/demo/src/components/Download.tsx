import React, { FC } from 'react';

type FileDownloaderComponentProps = {
  cid: string;
};
const FileDownloader: FC<FileDownloaderComponentProps> = ({ cid }) => {
  const handleDownload = () => {
    const fileUrl = `https://gateway.lighthouse.storage/ipfs/${cid}`;
    const fileName = 'myfile.pdf';

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };

  return <button onClick={handleDownload}>Download File</button>;
};

export default FileDownloader;
