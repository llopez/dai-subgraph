import { Address, ethereum, BigInt } from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as";
import { Transfer as TransferEvent } from "../generated/Dai/Dai";

export function createTransferEvent(
  src: Address,
  dst: Address,
  wad: BigInt
): TransferEvent {
  const event = changetype<TransferEvent>(newMockEvent());

  event.parameters = [
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src)),
    new ethereum.EventParam("dst", ethereum.Value.fromAddress(dst)),
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad)),
  ];

  return event;
}
