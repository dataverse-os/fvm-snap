import React, { useEffect, useState } from "react";

import { FullScreenModal } from "@dataverse/dataverse-components";
import dayjs from "dayjs";

import { ModalContainer } from "./styled";

import FilePreviewAudioSvg from "@/assets/icons/file-preview-audio.svg";
import FilePreviewImageSvg from "@/assets/icons/file-preview-image.svg";
import FilePreviewPdfSvg from "@/assets/icons/file-preview-pdf.svg";
import FilePreviewTextSvg from "@/assets/icons/file-preview-text.svg";
import FilePreviewUnknownSvg from "@/assets/icons/file-preview-unknown.svg";
import FilePreviewVideoSvg from "@/assets/icons/file-preview-video.svg";
import LoadingSvg from "@/assets/icons/loading.svg";
import ModalCloseIconSvg from "@/assets/icons/modal-close-icon.svg";
import { useSnap } from "@/hooks";
import { FileObject } from "@/types";
import { cidAbbreviation, normalizeSize } from "@/utils";

interface FileInfoModalProps {
  // data?: NFTData;
  file?: FileObject;
  // applicationRegistry: ApplicationRegistry;
  open: boolean;
  onClose?: () => void;
}

const filePreviewIconRegex = [
  {
    regex: /^audio\/.*/,
    icon: FilePreviewAudioSvg,
  },
  {
    regex: /^image\/.*/,
    icon: FilePreviewImageSvg,
  },
  {
    regex: /^video\/.*/,
    icon: FilePreviewVideoSvg,
  },
  {
    regex: /^text\/.*/,
    icon: FilePreviewTextSvg,
  },
  {
    regex: /^application\/pdf/,
    icon: FilePreviewPdfSvg,
  },
  {
    regex: /.*/,
    icon: FilePreviewUnknownSvg,
  },
];

export const FileInfoModal = ({
  // data,
  file,
  // applicationRegistry,
  open,
  onClose,
}: FileInfoModalProps) => {
  const { handleQueryDealStatusByCid, handleSubmitCidToContract } = useSnap();
  const [visible, setVisible] = useState(false);
  const [dealStatus, setDealStatus] = useState<any>();
  const [isRenewing, setIsRenewing] = useState(false);

  const handleClosePage = () => {
    onClose?.();
    setVisible(false);
  };

  useEffect(() => {
    if (open) {
      setDealStatus(undefined);
      setVisible(true);
      if (file) {
        handleQueryDealStatusByCid(file.cid).then(setDealStatus);
      }
    }
  }, [open]);

  return (
    <FullScreenModal
      controlVisible={visible}
      portal
      onCancel={handleClosePage}
      id='file-info-modal'
    >
      <ModalContainer>
        <div className='info-container'>
          <div className='title'>{file?.fileName}</div>
          <div className='file-info'>
            <div className='info-list'>
              <div className='info-item'>
                <div className='info-key'>Type</div>
                <div className='info-value'>{file?.mimeType}</div>
              </div>
              <div className='info-item'>
                <div className='info-key'>Size</div>
                <div className='info-value'>
                  {file && normalizeSize(Number.parseInt(file.fileSizeInBytes))}
                </div>
              </div>
              <div className='info-item'>
                <div className='info-key'>Created</div>
                <div className='info-value'>
                  {file && dayjs(file.createdAt).format("YYYY.MM.DD,HH:mmA")}
                </div>
              </div>
              <div className='info-item'>
                <div className='info-key'>CID</div>
                <div className='info-value'>{cidAbbreviation(file?.cid)}</div>
              </div>
              <div className='info-item'>
                <div className='info-key'>Storage deals</div>
                <div
                  className='info-value'
                  data-unavailable={!dealStatus?.dealInfos}
                >
                  {!dealStatus?.dealInfos && "in progress"}
                </div>
              </div>
              {dealStatus?.dealInfos && (
                <div
                  className='extra hideScrollbar'
                  style={{
                    marginTop: "5px",
                    maxHeight: "100px",
                    overflow: "auto",
                  }}
                >
                  {(dealStatus.dealInfos.dealID as string[]).map(dealId => {
                    return (
                      <div className='extra-item' key={dealId}>
                        <div className='extra-key'>
                          <a
                            target='_blank'
                            href={`https://calibration.filfox.info/en/deal/${dealId}`}
                            rel='noreferrer'
                          >
                            {dealId}
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className='extra'>
              <div className='extra-item'>
                <div className='extra-key'>LinkToCARFile</div>
                <div className='extra-value'>
                  <a
                    target='_blank'
                    href={`https://gateway.lighthouse.storage/ipfs/${file?.cid}`}
                    rel='noreferrer'
                  >
                    https://gateway.lighthouse.storage/ipfs/{file?.cid}
                  </a>
                </div>
              </div>
              <div className='extra-item'>
                <div className='extra-key'>MinerId</div>
                <div
                  className='extra-value'
                  data-unavailable={!dealStatus?.dealInfos}
                >
                  {dealStatus?.dealInfos
                    ? [...new Set(dealStatus.dealInfos.miner as string[])].join(
                        ", ",
                      )
                    : "in progress"}
                </div>
              </div>
              <div className='extra-item'>
                <div className='extra-key'>Number of copies</div>
                <div
                  className='extra-value'
                  data-unavailable={!dealStatus?.currentActiveDeals}
                >
                  {dealStatus?.currentActiveDeals
                    ? dealStatus?.currentActiveDeals.length
                    : "in progress"}
                </div>
              </div>
              <div className='extra-item'>
                <div className='extra-key'>Repair Threshold</div>
                <div className='extra-value' data-unavailable>
                  N/A
                </div>
              </div>
              <div className='extra-item'>
                <div className='extra-key'>Renew Threshold</div>
                <div className='extra-value' data-unavailable>
                  N/A
                </div>
              </div>
              <div className='extra-item' style={{ marginTop: "10px" }}>
                <div className='extra-key'></div>
                <div className='extra-value buttons'>
                  <button
                    disabled
                    onClick={async () => {
                      if (!file) return;
                      setIsRenewing(true);
                      try {
                        await handleSubmitCidToContract(file.cid);
                      } finally {
                        setIsRenewing(false);
                      }
                    }}
                  >
                    {isRenewing ? (
                      <img src={LoadingSvg} style={{ width: "20px" }} />
                    ) : (
                      "Renew"
                    )}
                  </button>
                  <button disabled>Repair</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='content-container'>
          <div className='image-box'>
            {file && (
              <img
                src={
                  filePreviewIconRegex.find(({ regex }) => {
                    return regex.test(file.mimeType || "");
                  })?.icon
                }
              />
            )}
          </div>
        </div>

        <img
          className='close-btn'
          src={ModalCloseIconSvg}
          onClick={handleClosePage}
        />
      </ModalContainer>
    </FullScreenModal>
  );
};
