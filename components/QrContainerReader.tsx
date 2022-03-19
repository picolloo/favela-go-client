import { QrReader } from 'react-qr-reader';

import React, { useState } from "react"
import { ERC20 } from '../contracts/types'

const QrContainer = ({ contract, address }: { contract: ERC20, address: string }) => {
    const [data, setData] = useState('No result');
    const [txHash, setTxHash] = useState('');
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false)
    const [showDialog, setDialog] = useState(false)

    async function handlerScan(result, error) {
        if (error) {
            console.error(error)
            setError("No QR Code at the camera, please scan the QR Code")
            return
        }

        if (!result) {
            console.error(result)
            setError("NFT Identifier is null, verify the QR Code")
            return
        }

        const { id, lat, lng } = JSON.parse(result.text)
        if (id !== null && id !== undefined && !processing) {
            // TODO: verify the geolocation cords

            try {
                setData(id)
                setProcessing(true)
                console.log(`ID ${id} para o address ${address}`)

                const result = await contract.safeMint(address, id)
                alert(`NFT ${id} minted with success =D`)
                setTxHash(result.hash)
            } catch (err) {
                console.error(err)
            }
        } else {
            console.log(`its processing or Id is null - ${id}`)
        }
    }

    return (
        <>
            {showDialog && (
                <div className="dialog">
                    <div className="dialog-content">
                        <div className="close">
                            <button
                                onClick={() => {
                                    setError(null);
                                    setDialog(false);
                                    setProcessing(false);
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        {error && (
                            <div className="errorMessage">
                                <h2>{error}</h2>
                            </div>
                        )}
                        {txHash && (
                            <div className="description">
                                <h4 className="title">Transaction hash</h4>
                                <div className="detail detail-first-child">
                                    <h6 className="detail-content green">{txHash}</h6>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {!showDialog && !processing && (
                <div>
                    <QrReader
                        scanDelay={500}
                        onResult={handlerScan}
                        constraints={{ facingMode: 'user' }}
                        videoStyle={{
                            width: '100%',
                            align: 'center'
                        }}
                        videoContainerStyle={{
                            height: 250,
                            width: 250,
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                        containerStyle={{}}
                    />
                    <p>
                        {data}
                    </p>
                </div>
            )}
        </>
    );
};

export default QrContainer;