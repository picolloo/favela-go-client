import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore, MdQrCodeScanner} from "react-icons/md";
import ReactLoading from 'react-loading';

import useTokenContract from "../hooks/useTokenContract";
import ipfs from "../utils/ipfs";
import CTAButton from "./CTAButton";
import NFTList from "./NFTList";
import QrReader from "./QrContainerReader";
import { contractHash } from '../config'
import { NFT } from "../utils/types";

export default function UserList() {
  const [nfts, nftsSet] = useState<NFT[]>([])
  const { account } = useWeb3React();
  const [scanReaderEnabled, scanReaderEnabledSet] = useState(false)
  const [showButtonScanQr, setShowButtonScanQr] = useState(true)
  const [nftLen, nftLenSet] = useState(0)
  const [offset, offsetSet] = useState(0)
  const [loading, loadingSet] = useState(true)
  const [limit] = useState(6)
  const contract = useTokenContract(contractHash)

  function openScanQRCode() {
    setShowButtonScanQr(false)
    return scanReaderEnabledSet(true)
  }

  function closeQRCode() {
    setShowButtonScanQr(true)
    return scanReaderEnabledSet(false)
  }

  useEffect(() => {
    (async function() {
      nftLenSet(await ipfs.totalOfNftsByAccount(contract, account))
    })()
  }, [account, contract])

  useEffect(() => {
    (async function() {
      loadingSet(true)
      if (contract) {
        let ids = await contract.getAllNftsIdsByAddress(account);
        const nfts = await ipfs.getNftsByIds(contract, ids, limit, offset)
        nftsSet(nfts)
      }
      loadingSet(false)
    })()
  }, [contract, account, limit, offset])

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="mb-2 mt-2">
          {showButtonScanQr && (
            <CTAButton
              handleClick={openScanQRCode}
            >
              <div className="flex">
                <MdQrCodeScanner size={24} className="mr-2"/>
                Scan QR Code
              </div>
            </CTAButton>
          )}

          {!showButtonScanQr && (
            <CTAButton
              handleClick={closeQRCode}
            >
              Close QR Code
            </CTAButton>
          )}
        </div>

        <div className="flex items-center">
          {
            scanReaderEnabled && <QrReader
              contract={contract}
              address={account}
            />
          }
        </div>

        <div className="grid grid-cols-2 my-4">
            <MdOutlineNavigateBefore 
              size={36}
              color={offset != 0 ? "#161c22" : "#EBEBE4"}
              onClick={() => offset != 0 && offsetSet(offset => offset - limit) }
            />
            <MdOutlineNavigateNext
              size={36}
              color={offset + limit < nftLen ? "#161c22" : "#EBEBE4"}
              onClick={() => offset + limit < nftLen && offsetSet(offset => offset + limit) }
            />
        </div>

        {loading ? 
          <ReactLoading type={"spinningBubbles"} color={"#D33DD6"} height={50} width={50} /> : 
          <NFTList nfts={nfts} 
        />}
      </div>
    </>
  )
}