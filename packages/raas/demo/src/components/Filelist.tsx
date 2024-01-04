import React, { FC } from "react";

export type FileObject = {
  publicKey: string;
  fileName: string;
  mimeType: string;
  txHash: string;
  status: string;
  createdAt: number;
  fileSizeInBytes: string;
  cid: string;
  id: string;
  lastUpdate: number;
  encryption: boolean;
};

type FileListProps = {
  files: FileObject[];
};

const FileList: FC<FileListProps> = ({ files }) => {
  return (
    <ul>
      {files.map(file => (
        <li key={file.id}>
          <p>File Name: {file.fileName}</p>
          <p>File Size: {file.fileSizeInBytes} bytes</p>
          <p>Status: {file.status}</p>
          <p>Created At: {new Date(file.createdAt).toLocaleString()}</p>
          <p>CID: {file.cid}</p>
          {/* Render other properties as needed */}
        </li>
      ))}
    </ul>
  );
};

export default FileList;
