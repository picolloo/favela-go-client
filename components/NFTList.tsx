import { BigNumber } from "ethers";

export type NFT = {
  url: String,
  id: BigNumber,
}

type NFTListProps = {
  nfts: NFT[],
  isAdmin?: Boolean
}

function NFTCard({url}) {
  return (
    <a className="w-32 h-32 mx-auto rounded-md bg-cover bg-top bg-no-repeat"
      style={{
        backgroundImage: `url(${url})`,
      }}
    >
    </a>
  )
}

export default function NFTList({nfts}: NFTListProps) {
  return (
    <div className="grid w-4/5 mx-auto grid-cols-2 gap-y-4">
      {nfts.map((n, i) => (
        <NFTCard key={i} url={n.url}/>
      ))}
    </div>
  )
}