import React, { useEffect, useState } from "react";

import { Message, Progress, Upload } from "@arco-design/web-react";
import { StorageSize } from "@dataverse/fvm-raas-provider";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
// import { css } from "styled-components";

import {
  FinderWrap,
  HeaderWrap,
  MainWrap,
  PageWrapper,
  Sidebar,
} from "./styled";

import AggregatorSwitchActiveSvg from "@/assets/icons/aggregator-switch-active.svg";
import AggregatorSwitchSvg from "@/assets/icons/aggregator-switch.svg";
import FileDownloadIconSvg from "@/assets/icons/file-download-icon.svg";
import FileShareIconSvg from "@/assets/icons/file-share-icon.svg";
// import FilterSelectorIconSvg from "@/assets/icons/filter-selector-icon.svg";
import FvmSnapBrandSvg from "@/assets/icons/fvm-snap-brand.svg";
import LoadingSvg from "@/assets/icons/loading.svg";
import SelectorDownArrowSvg from "@/assets/icons/selector-down-arrow.svg";
import UploadIconSvg from "@/assets/icons/upload-icon.svg";
import { UserAvatar } from "@/components/Avatar/UserAvatar";
import { FileInfoModal } from "@/components/FileInfoModal";
import { Search } from "@/components/Search";
import { Option, Selector } from "@/components/Selector";
import { useSnap } from "@/hooks";
import { FlexRow } from "@/styled";
import { FileObject } from "@/types";
import { normalizeSize, parseTime } from "@/utils";
import { fadeInVariants, rotateXVariants } from "@/utils/ui";

const aggregatorOptions: Option[] = [
  {
    value: "Lighthouse",
  },
];

// const filterOptions: Option[] = [
//   {
//     value: "All",
//   },
//   {
//     value: "Expiring in 1 mon",
//   },
// ];

const Home: React.FC = () => {
  const {
    snapState,
    handleLoadUploads,
    handleDownloadFile,
    handleUploadFile,
    handleQueryDealStatusByCid,
    handleSubmitCidToContract,
    handleSubmitCidToRaasBackend,
    handleGetActiveDealsFromContract,
    handleGetAllDealsFromContract,
  } = useSnap();
  const navigate = useNavigate();

  const [fileInfoModalVisible, setFileInfoModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileObject>();
  const [dealInfo, setDealInfo] = useState<
    Record<
      string,
      {
        dealStatus: any;
        activeDeals: any;
        allDeals: any;
      }
    >
  >({});
  const [searchContent, setSearchContent] = useState("");
  const [address, setAddress] = useState("");
  const [storageSize, setStorageSize] = useState<StorageSize>();
  const [fileUploading, setFileUploading] = useState(false);

  useEffect(() => {
    if (!snapState.installedSnap || !snapState.raasProvider.isProviderSet) {
      navigate("/");
      return;
    }
    handleLoadUploads().catch(console.warn);
    snapState.raasProvider.signer.getAddress().then(setAddress);
    snapState.raasProvider.getStorageSize().then(setStorageSize);
  }, []);

  useEffect(() => {
    if (!snapState.fileList) return;
    const cids = [...new Set(snapState.fileList.map(file => file.cid))];
    const dealInfo: Record<string, any> = {};
    cids.forEach(cid => {
      dealInfo[cid] = {
        dealStatus: null,
        activeDeals: null,
        allDeals: null,
      };
    });
    Promise.allSettled(
      cids.map(cid =>
        Promise.allSettled([
          handleQueryDealStatusByCid(cid)
            .then(res => {
              dealInfo[cid].dealStatus = res;
            })
            .catch(console.warn),
          handleGetActiveDealsFromContract(cid)
            .then(res => {
              dealInfo[cid].activeDeals = res;
            })
            .catch(console.warn),
          handleGetAllDealsFromContract(cid)
            .then(res => {
              dealInfo[cid].allDeals = res;
            })
            .catch(console.warn),
        ]),
      ),
    ).then(() => setDealInfo({ ...dealInfo }));
  }, [snapState.fileList]);

  useEffect(() => {
    if (!dealInfo || Object.values(dealInfo).length === 0) return;
    console.log({ dealStatus: dealInfo });
  }, [dealInfo]);

  const getRaasHealth = (cid: string) => {
    if (!dealInfo[cid]?.dealStatus) return NaN;
    const health =
      (dealInfo[cid].dealStatus.currentActiveDeals.length /
        (dealInfo[cid].dealStatus.dealInfos?.dealID.length ||
          dealInfo[cid].dealStatus.currentActiveDeals.length)) *
      100;
    return health > 100 ? 100 : health;
  };

  const getRaasHealthColor = (cid: string) => {
    const health = getRaasHealth(cid);
    if (Number.isNaN(health)) return "#5C5C5C";
    if (health >= 100) return "#33A754";
    if (health >= 60) return "#FFC107";
    return "#E64930";
  };

  return (
    <PageWrapper>
      <Sidebar>
        <div className='brand'>
          <img src={FvmSnapBrandSvg} />
          <span>FVM-Snap</span>
        </div>
        <div className='side-menu'>
          <p
            className='desc-text'
            style={{ marginLeft: "18px", marginBottom: "3px" }}
          >
            Choose aggregator
          </p>
          <AggregatorSelector />
        </div>
        <div className='footer'>
          <div className='storage'>
            <p className='desc-text' style={{ marginBottom: "11px" }}>
              Storage space
            </p>
            <Progress
              percent={
                storageSize
                  ? (storageSize.dataUsed / storageSize.dataLimit) * 100
                  : 0
              }
              showText={false}
              strokeWidth={4}
              color='#4383F7'
              trailColor='#DADBDD'
            />
            <p className='storage-text'>
              {storageSize && (
                <>
                  <span>{normalizeSize(storageSize.dataUsed)}</span>/
                  {normalizeSize(storageSize.dataLimit)}
                </>
              )}
            </p>
          </div>
          <button
            className='get-more-btn'
            onClick={() =>
              window.open(
                "https://files.lighthouse.storage/dashboard/topup",
                "_blank",
              )
            }
          >
            Get more storage space
          </button>
        </div>
      </Sidebar>
      <MainWrap>
        <HeaderWrap>
          <Search
            onChange={setSearchContent}
            placeHolder='search CID or name'
            style={{ maxWidth: "700px", flex: "1 1 auto", marginRight: "20px" }}
          />
          <FlexRow style={{ columnGap: "18px" }}>
            <Upload
              showUploadList={false}
              disabled={fileUploading}
              customRequest={async option => {
                const { onSuccess, onError, file } = option;
                console.log({ file });
                try {
                  setFileUploading(true);
                  const res = await handleUploadFile({
                    fileName: file.name,
                    blob: file,
                  });
                  const cid = res.Hash;
                  try {
                    await handleSubmitCidToContract(cid);
                    await handleSubmitCidToRaasBackend(cid);
                    Message.success("Upload success: " + file.name);
                  } catch (e) {
                    console.warn(e);
                    Message.warning(
                      "Upload success, but failed to submit to contract or raas backend: " +
                        file.name +
                        ". You may need to get some testnet Filecoin first.",
                    );
                  }
                  handleLoadUploads().catch(console.warn);
                  snapState.raasProvider
                    .getStorageSize()
                    .then(setStorageSize)
                    .catch(console.warn);
                  onSuccess(res);
                } catch (e) {
                  Message.error("Upload failed: " + file.name);
                  console.warn(e);
                  onError(e as any);
                } finally {
                  setFileUploading(false);
                }
              }}
            >
              <button className='upload-btn'>
                {fileUploading ? (
                  <img src={LoadingSvg} style={{ width: "24px" }} />
                ) : (
                  <>
                    <img src={UploadIconSvg} />
                    Upload
                  </>
                )}
              </button>
            </Upload>
            <UserAvatar address={address || ""} />
          </FlexRow>
        </HeaderWrap>
        <FinderWrap>
          <div className='top-bar'>
            <div className='info'>
              <span className='path'>Home</span>
              <span className='file-count'>
                Total ({snapState.fileList?.length || 0}) files
              </span>
            </div>
            {/* <Selector
              className='filter-selector'
              options={filterOptions}
              defaultSelected
              styleConfig={{
                padding: "8.5px",
                autoFitWidth: true,
                hoverStyle: css`
                  background-color: #f2f3f5;
                `,
                selectedStyle: css`
                  color: #4383f7;
                `,
                customRightContent: (
                  <img
                    src={FilterSelectorIconSvg}
                    style={{
                      position: "absolute",
                      top: "6.5px",
                      right: "12px",
                    }}
                  />
                ),
              }}
            /> */}
          </div>
          <div className='file-table'>
            <div className='table-container hideScrollbar'>
              <div className='table-header'>
                <div className='table-item'>Name</div>
                <div className='table-item'>Size</div>
                <div className='table-item'>Last modified</div>
                <div className='table-item'>RaaS health</div>
                <div className='table-item'></div>
              </div>
              {snapState.fileList
                ?.filter(
                  file =>
                    file.fileName
                      .toLowerCase()
                      .includes(searchContent.toLowerCase() || "") ||
                    file.cid
                      .toLowerCase()
                      .includes(searchContent.toLowerCase() || ""),
                )
                .map(file => {
                  return (
                    <div
                      key={file.id}
                      className='table-row'
                      onClick={() => {
                        setSelectedFile(file);
                        setFileInfoModalVisible(true);
                      }}
                    >
                      <div className='table-item'>{file.fileName}</div>
                      <div className='table-item'>
                        {normalizeSize(Number.parseInt(file.fileSizeInBytes))}
                      </div>
                      <div className='table-item'>
                        {parseTime(file.lastUpdate, "{d}-{m}-{y}")}
                      </div>
                      <div
                        className='table-item'
                        style={{ color: getRaasHealthColor(file.cid) }}
                      >
                        {getRaasHealth(file.cid)
                          ? getRaasHealth(file.cid).toFixed(2) + "%"
                          : "N/A"}
                      </div>
                      <div className='table-item buttons'>
                        <button
                          onClick={async e => {
                            e.stopPropagation();
                            const content = await handleDownloadFile(file.cid);
                            const blob = new Blob([content], {
                              type: file.mimeType,
                            });
                            const url = window.URL.createObjectURL(blob);
                            console.log({ content, blob, url });
                            const link = document.createElement("a");
                            link.href = url;
                            link.download = file.fileName;
                            link.click();
                          }}
                        >
                          <img src={FileDownloadIconSvg} />
                        </button>
                        <button
                          onClick={async e => {
                            e.stopPropagation();
                            try {
                              // copy download link to clipboard
                              await navigator.clipboard.writeText(
                                `https://gateway.lighthouse.storage/ipfs/${file.cid}`,
                              );
                              Message.success(
                                "File link is copied to clipboard",
                              );
                            } catch (e) {
                              console.warn(e);
                              Message.error("Failed to copy file link");
                            }
                          }}
                        >
                          <img src={FileShareIconSvg} />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </FinderWrap>
        <FileInfoModal
          open={fileInfoModalVisible}
          file={selectedFile}
          onClose={() => setFileInfoModalVisible(false)}
        />
      </MainWrap>
    </PageWrapper>
  );
};

const AggregatorSelector = () => {
  const [isSelecting, setIsSelecting] = useState(false);

  return (
    <Selector
      options={aggregatorOptions}
      defaultSelected
      onSelectingChange={setIsSelecting}
      styleConfig={{
        customLeftContent: (
          <div
            style={{
              position: "relative",
              top: "10px",
              left: "12px",
            }}
          >
            <motion.img
              src={AggregatorSwitchSvg}
              style={{ position: "absolute" }}
              variants={fadeInVariants}
              initial='show'
              animate={isSelecting ? "hidden" : "show"}
            />
            <motion.img
              src={AggregatorSwitchActiveSvg}
              style={{ position: "absolute" }}
              variants={fadeInVariants}
              initial='hidden'
              animate={isSelecting ? "show" : "hidden"}
            />
          </div>
        ),
        customRightContent: (
          <div style={{ position: "absolute", top: "16px", right: "25px" }}>
            <motion.img
              src={SelectorDownArrowSvg}
              style={{ position: "absolute" }}
              variants={rotateXVariants}
              animate={isSelecting ? "animate" : "initial"}
            />
          </div>
        ),
      }}
    />
  );
};

export default Home;
