import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { assert, beforeEach, clearStore, describe, test } from "matchstick-as";
import { Global } from "../../generated/schema";
import { handleTransfer } from "../../src/handlers/dai";
import { timestampIntoDays } from "../../src/utils";
import { createTransferEvent } from "../helpers";

const zeroAddress = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);
const address1 = Address.fromString(
  "0x0000000000000000000000000000000000000001"
);
const address2 = Address.fromString(
  "0x0000000000000000000000000000000000000002"
);

describe("DAI", () => {
  beforeEach(() => {
    clearStore();
  });

  beforeEach(() => {
    const global = new Global("current");
    global.totalSupply = BigDecimal.fromString("100");
    global.save();
  });

  describe("handleTransfer", () => {
    describe("when transfer from zero address (mint)", () => {
      test("increases Global.totalSupply", () => {
        const wad = BigInt.fromString("1000000000000000000");
        const event = createTransferEvent(zeroAddress, address1, wad);

        handleTransfer(event);

        assert.fieldEquals("Global", "current", "totalSupply", "101");
      });

      test("updates DailyMetric", () => {
        const wad = BigInt.fromString("1000000000000000000");
        const event = createTransferEvent(zeroAddress, address1, wad);

        event.block.timestamp = BigInt.fromI32(60 * 60 * 24 * 90); // day 90th
        event.block.number = BigInt.fromI32(1001);

        handleTransfer(event);

        const id = timestampIntoDays(event.block.timestamp).toString();

        assert.fieldEquals(
          "DailyMetric",
          id,
          "blockTimestamp",
          event.block.timestamp.toString()
        );
        assert.fieldEquals(
          "DailyMetric",
          id,
          "blockNumber",
          event.block.number.toString()
        );
        assert.fieldEquals("DailyMetric", id, "totalSupply", "101");
      });
      test("creates mint transfer", () => {
        const wad = BigInt.fromString("1000000000000000000");
        const event = createTransferEvent(zeroAddress, address1, wad);

        handleTransfer(event);

        const id = event.transaction.hash
          .concatI32(event.logIndex.toI32())
          .toHexString();

        assert.fieldEquals("Transfer", id, "type", "MINT");
        assert.fieldEquals("Transfer", id, "src", zeroAddress.toHexString());
        assert.fieldEquals("Transfer", id, "dst", address1.toHexString());
        assert.fieldEquals("Transfer", id, "wad", wad.toString());
      });
    });

    describe("when transfer to zero address (burn)", () => {
      test("decreases Global.totalSupply", () => {
        const wad = BigInt.fromString("1000000000000000000");

        const event = createTransferEvent(address1, zeroAddress, wad);

        handleTransfer(event);

        assert.fieldEquals("Global", "current", "totalSupply", "99");
      });

      test("updates DailyMetric", () => {
        const wad = BigInt.fromString("1000000000000000000");

        const event = createTransferEvent(address1, zeroAddress, wad);

        event.block.timestamp = BigInt.fromI32(60 * 60 * 24 * 90); // day 90th
        event.block.number = BigInt.fromI32(1001);

        handleTransfer(event);

        const id = timestampIntoDays(event.block.timestamp).toString();

        assert.fieldEquals(
          "DailyMetric",
          id,
          "blockTimestamp",
          event.block.timestamp.toString()
        );
        assert.fieldEquals(
          "DailyMetric",
          id,
          "blockNumber",
          event.block.number.toString()
        );
        assert.fieldEquals("DailyMetric", id, "totalSupply", "99");
      });

      test("creates burn transfer", () => {
        const wad = BigInt.fromString("1000000000000000000");

        const event = createTransferEvent(address1, zeroAddress, wad);

        handleTransfer(event);

        const id = event.transaction.hash
          .concatI32(event.logIndex.toI32())
          .toHexString();

        assert.fieldEquals("Transfer", id, "type", "BURN");
        assert.fieldEquals("Transfer", id, "src", address1.toHexString());
        assert.fieldEquals("Transfer", id, "dst", zeroAddress.toHexString());
        assert.fieldEquals("Transfer", id, "wad", wad.toString());
      });
    });

    describe("when transfer neither from or to zero address (transfer)", () => {
      test("does not change Global.totalSupply", () => {
        const wad = BigInt.fromString("1000000000000000000");

        const event = createTransferEvent(address1, address2, wad);

        handleTransfer(event);

        assert.fieldEquals("Global", "current", "totalSupply", "100");
      });
      test("does not create metric", () => {
        const wad = BigInt.fromString("1000000000000000000");

        const event = createTransferEvent(address1, address2, wad);

        handleTransfer(event);

        assert.entityCount("DailyMetric", 0);
      });
      test("creates transfer", () => {
        const wad = BigInt.fromString("1000000000000000000");

        const event = createTransferEvent(address1, address2, wad);

        handleTransfer(event);

        const id = event.transaction.hash
          .concatI32(event.logIndex.toI32())
          .toHexString();

        assert.fieldEquals("Transfer", id, "type", "TRANSFER");
        assert.fieldEquals("Transfer", id, "src", address1.toHexString());
        assert.fieldEquals("Transfer", id, "dst", address2.toHexString());
        assert.fieldEquals("Transfer", id, "wad", wad.toString());
      });
    });
  });
});
