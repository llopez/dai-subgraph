import { Address } from "@graphprotocol/graph-ts";
import { Transfer as TransferEvent } from "../../generated/Dai/Dai";
import { Transfer } from "../../generated/schema";
import {
  getOrCreateDailyMetric,
  getOrCreateTransfer,
  decimals,
  getOrCreateGlobal,
} from "../utils";

const SECONDS_PER_DAY = 60 * 60 * 24;

function updateDailyMetrics(transfer: Transfer): void {
  const today = (transfer.blockTimestamp.toI64() / SECONDS_PER_DAY).toString();

  const dailyMetric = getOrCreateDailyMetric(today);

  const amount = decimals.fromBigInt(transfer.wad, 18);

  if (transfer.type == "MINT") {
    dailyMetric.totalSupply = dailyMetric.totalSupply.plus(amount);
  } else {
    dailyMetric.totalSupply = dailyMetric.totalSupply.minus(amount);
  }

  dailyMetric.blockNumber = transfer.blockNumber;
  dailyMetric.blockTimestamp = transfer.blockTimestamp;

  dailyMetric.save();
}

function handleMint(event: TransferEvent): void {
  const transfer = getOrCreateTransfer(event);

  transfer.type = "MINT";

  transfer.save();

  const global = getOrCreateGlobal();

  const amount = decimals.fromBigInt(transfer.wad, 18);

  global.totalSupply = global.totalSupply.plus(amount);

  global.save();

  updateDailyMetrics(transfer);
}

function handleBurn(event: TransferEvent): void {
  const transfer = getOrCreateTransfer(event);

  transfer.type = "BURN";

  transfer.save();

  const global = getOrCreateGlobal();

  const amount = decimals.fromBigInt(transfer.wad, 18);

  global.totalSupply = global.totalSupply.minus(amount);

  global.save();

  updateDailyMetrics(transfer);
}

export function handleTransfer(event: TransferEvent): void {
  if (event.params.src == Address.zero()) {
    handleMint(event);
    return;
  }

  if (event.params.dst == Address.zero()) {
    handleBurn(event);
    return;
  }

  const transfer = getOrCreateTransfer(event);

  transfer.type = "TRANSFER";

  transfer.save();
}
