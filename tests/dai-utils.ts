import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { Approval, LogNote, Transfer } from "../generated/Dai/Dai"

export function createApprovalEvent(
  src: Address,
  guy: Address,
  wad: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("guy", ethereum.Value.fromAddress(guy))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return approvalEvent
}

export function createLogNoteEvent(
  sig: Bytes,
  usr: Address,
  arg1: Bytes,
  arg2: Bytes,
  data: Bytes
): LogNote {
  let logNoteEvent = changetype<LogNote>(newMockEvent())

  logNoteEvent.parameters = new Array()

  logNoteEvent.parameters.push(
    new ethereum.EventParam("sig", ethereum.Value.fromFixedBytes(sig))
  )
  logNoteEvent.parameters.push(
    new ethereum.EventParam("usr", ethereum.Value.fromAddress(usr))
  )
  logNoteEvent.parameters.push(
    new ethereum.EventParam("arg1", ethereum.Value.fromFixedBytes(arg1))
  )
  logNoteEvent.parameters.push(
    new ethereum.EventParam("arg2", ethereum.Value.fromFixedBytes(arg2))
  )
  logNoteEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromBytes(data))
  )

  return logNoteEvent
}

export function createTransferEvent(
  src: Address,
  dst: Address,
  wad: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("src", ethereum.Value.fromAddress(src))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("dst", ethereum.Value.fromAddress(dst))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("wad", ethereum.Value.fromUnsignedBigInt(wad))
  )

  return transferEvent
}
