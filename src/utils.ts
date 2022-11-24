import { DailyMetric, Transfer, Global } from "../generated/schema";
import { Transfer as TransferEvent } from "../generated/Dai/Dai";
import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export function getOrCreateTransfer(event: TransferEvent): Transfer {
  const id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let transfer = Transfer.load(id);

  if (transfer) return transfer;

  transfer = new Transfer(id);

  transfer.src = event.params.src;
  transfer.dst = event.params.dst;
  transfer.wad = event.params.wad;
  transfer.blockNumber = event.block.number;
  transfer.blockTimestamp = event.block.timestamp;
  transfer.transactionHash = event.transaction.hash;

  return transfer;
}

export function getOrCreateGlobal(): Global {
  const id = "current";
  let global = Global.load(id);

  if (global) return global;

  global = new Global(id);
  global.totalSupply = BigDecimal.zero();

  return global;
}

export function getOrCreateDailyMetric(id: string): DailyMetric {
  let metric = DailyMetric.load(id);

  if (metric) return metric;

  const global = Global.load("current");

  metric = new DailyMetric(id);
  metric.totalSupply = global ? global.totalSupply : BigDecimal.zero();

  return metric;
}

export namespace integer {
  export const TEN = BigInt.fromI32(10);
}

export namespace decimals {
  export function fromBigInt(value: BigInt, decimals: u8): BigDecimal {
    const precision = integer.TEN.pow(decimals).toBigDecimal();

    return value.divDecimal(precision);
  }
}
