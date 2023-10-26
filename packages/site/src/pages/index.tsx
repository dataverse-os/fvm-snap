import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { ethers, Wallet } from 'ethers';
import { ExternalProvider } from '@ethersproject/providers/src.ts/web3-provider';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  download,
  getAllDeals,
  getDealStatusByCid,
  getExpiringDeals,
  getProof,
  getSnap,
  isLocalSnap,
  loadAllUploads,
  RaasTask,
  sendHello,
  shouldDisplayReconnectButton,
  submitToContract,
  submitToRaasBackend,
  uploadFile,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendHelloButton,
  Card,
  UploadButton,
  LoadAllUploadsButton,
  SubmitCidToContractButton,
  SubmitTaskToRaasBackendButton,
  QueryProofByCidButton,
  QueryDealStatusByCidButton,
  GetAllDealsFromContractButton,
  GetActiveDealsFromContractButton,
  GetExpiringDealsFromContractButton,
} from '../components';
import { defaultSnapOrigin } from '../config';
import FileUploadComponent from '../components/Upload';
import DisplayInputComponent from '../components/Input';
import FileDownloader from '../components/Download';
import FileList, { FileObject } from '../components/Filelist';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [signer, setSigner] = useState<Wallet | undefined>(undefined);
  const [fileList, setFileList] = useState<FileObject[]>([]);

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.snapsDetected;

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });

      const provider = new ethers.providers.Web3Provider(
        window.ethereum as unknown as ExternalProvider,
      );
      const s = await provider.getSigner();
      setSigner(s as unknown as Wallet);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleSendHelloClick = async () => {
    try {
      await sendHello();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleUploadClick = async () => {
    try {
      await uploadFile();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleDownloadClick = async () => {
    const cid = 'Qmcdx5n36geM79Aghu3x1ov1VhuX1LHdsu82Xeh76TspxQ';
    try {
      await download(cid);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleLoadUploadsClick = async () => {
    // console.log('provider: ', provider2);
    // console.log('provider: ', await provider2.getSigner().getAddress());
    try {
      const uploads = await loadAllUploads(signer as Wallet);
      setFileList(uploads);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleSubmitCidToContract = async (/* cid: string*/) => {
    // todo:
    const cid = 'Qmcdx5n36geM79Aghu3x1ov1VhuX1LHdsu82Xeh76TspxQ';
    try {
      await submitToContract(signer as Wallet, cid);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleSubmitCidToRaasBackend = async (/* cid: string*/) => {
    const cid = 'Qmcdx5n36geM79Aghu3x1ov1VhuX1LHdsu82Xeh76TspxQ';
    const requestReceivedTime = new Date();
    const endDate = requestReceivedTime.setMonth(
      requestReceivedTime.getMonth() + 1,
    );
    const replicationTarget = 2;
    const epochs = 4; // how many epochs before deal end should deal be renewed
    const task: RaasTask = {
      cid,
      replicationTarget,
      endDate,
      epochs,
    };

    try {
      await submitToRaasBackend(signer as Wallet, task);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleQueryProofByCid = async (/* cid: string*/) => {
    const cid = 'Qmcdx5n36geM79Aghu3x1ov1VhuX1LHdsu82Xeh76TspxQ';
    try {
      const podsi = await getProof(cid);
      console.log('podsi: ', podsi);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleQueryDealStatusByCid = async (/* cid: string*/) => {
    const cid = 'Qmcdx5n36geM79Aghu3x1ov1VhuX1LHdsu82Xeh76TspxQ';
    try {
      const podsi = await getDealStatusByCid(cid);
      console.log('podsi: ', podsi);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleGetAllDealsFromContract = async (/* cid: string*/) => {
    const cid = 'Qmcdx5n36geM79Aghu3x1ov1VhuX1LHdsu82Xeh76TspxQ';
    try {
      const res = await getAllDeals(signer as Wallet, cid);
      console.log('res: ', res);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleGetActiveDealsFromContract = async (/* cid: string*/) => {
    const cid = 'Qmcdx5n36geM79Aghu3x1ov1VhuX1LHdsu82Xeh76TspxQ';
    try {
      const res = await getAllDeals(signer as Wallet, cid);
      console.log('res: ', res);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleGetExpiringDealsFromContract = async (/* cid: string*/) => {
    const cid = 'Qmcdx5n36geM79Aghu3x1ov1VhuX1LHdsu82Xeh76TspxQ';
    try {
      const res = await getExpiringDeals(signer as Wallet, cid, 4);
      console.log('res: ', res);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  return (
    <Container>
      <Heading>
        Welcome to <Span>template-snap</Span>
      </Heading>
      <Subtitle>
        Get started by editing <code>src/index.ts</code>
      </Subtitle>
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!isMetaMaskReady && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the example snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!isMetaMaskReady}
                />
              ),
            }}
            disabled={!isMetaMaskReady}
          />
        )}
        {shouldDisplayReconnectButton(state.installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={handleConnectClick}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
          />
        )}
        <Card
          content={{
            title: 'UploadFile',
            description: 'Upload file to lighthouse',
          }}
          disabled={!state.installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
          input={<FileUploadComponent signer={signer as Wallet} />}
        />

        <Card
          content={{
            title: 'DownloadFile',
            description: 'Download file from lighthouse',
            // button: (
            //   <DownloadButton
            //     onClick={handleDownloadClick}
            //     disabled={!state.installedSnap}
            //   />
            // ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
          input={
            <FileDownloader
              cid={'Qmcdx5n36geM79Aghu3x1ov1VhuX1LHdsu82Xeh76TspxQ'}
            />
          }
        />

        <Card
          content={{
            title: 'LoadAllUploads',
            description: 'Load all files upload to lighthouse',
            button: (
              <LoadAllUploadsButton
                onClick={handleLoadUploadsClick}
                disabled={!state.installedSnap}
              />
            ),
            // input: <FileList  files={fileList as unknown as FileObject[]}/>
          }}
          disabled={!state.installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        <ul>
          {fileList.map((file) => (
            <li key={file.id}>
              <p>File Name: {file.fileName}</p>
              <p>File Size: {file.fileSizeInBytes} bytes</p>
              <p>Status: {file.status}</p>
              <p>Created At: {new Date(file.createdAt).toLocaleString()}</p>
              <p>CID: {file.cid}</p>
              <a href={`https://gateway.lighthouse.storage/ipfs/${file.cid}`}>
                Download
              </a>
              {/* Render other properties as needed */}
            </li>
          ))}
        </ul>

        <Card
          content={{
            title: 'SubmitTaskToContract',
            description:
              'Submit cid to raas aggregator contract: QmZTVrPFStb9hKi5WLxa2FKU9FAYSwnw9Ufg2uCiFgvLfp',
            button: (
              <SubmitCidToContractButton
                onClick={handleSubmitCidToContract}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          input={<DisplayInputComponent />}
          fullWidth={
            isMetaMaskReady &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        <Card
          content={{
            title: 'SubmitTaskToRaasBackend',
            description:
              'Submit cid to raas backend: QmZTVrPFStb9hKi5WLxa2FKU9FAYSwnw9Ufg2uCiFgvLfp',
            button: (
              <SubmitTaskToRaasBackendButton
                onClick={handleSubmitCidToRaasBackend}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />

        <Card
          content={{
            title: 'GetProofByCid',
            description: 'Query proof from raas backend by cid',
            button: (
              <QueryProofByCidButton
                onClick={handleQueryProofByCid}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />

        <Card
          content={{
            title: 'GetDealStatusByCid',
            description: 'Query deal status by cid',
            button: (
              <QueryDealStatusByCidButton
                onClick={handleQueryDealStatusByCid}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />

        <Card
          content={{
            title: 'GetAllDealsFromContract',
            description: 'Get all deals by querying aggregator contract',
            button: (
              <GetAllDealsFromContractButton
                onClick={handleGetAllDealsFromContract}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />

        <Card
          content={{
            title: 'GetActiveDealsFromContract',
            description: 'Get active deals by querying aggregator contract',
            button: (
              <GetActiveDealsFromContractButton
                onClick={handleGetExpiringDealsFromContract}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />

        <Card
          content={{
            title: 'GetExpiringDealsFromContract',
            description: 'Get expiring deals by querying aggregator contract',
            button: (
              <GetExpiringDealsFromContractButton
                onClick={handleGetActiveDealsFromContract}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            isMetaMaskReady &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />

        <Notice>
          <p>
            Please note that the <b>snap.manifest.json</b> and{' '}
            <b>package.json</b> must be located in the server root directory and
            the bundle must be hosted at the location specified by the location
            field.
          </p>
        </Notice>
      </CardContainer>
    </Container>
  );
};

export default Index;
