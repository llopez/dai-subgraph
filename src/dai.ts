import { Transfer as TransferEvent } from "../generated/Dai/Dai";
import { Transfer } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  const entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.src = event.params.src;
  entity.dst = event.params.dst;
  entity.wad = event.params.wad;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
