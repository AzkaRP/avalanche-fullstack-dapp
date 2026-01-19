import { Injectable, ServiceUnavailableException, InternalServerErrorException } from "@nestjs/common";
import { createPublicClient, http } from "viem";
import { avalancheFuji } from "viem/chains";
import { SIMPLE_STORAGE_ABI } from "./simple-storage.abi";

@Injectable()
export class BlockchainService {
  private client;
  private contractAddress: `0x${string}`;

  constructor() {
    this.client = createPublicClient({
      chain: avalancheFuji,
      transport: http("https://api.avax-test.network/ext/bc/C/rpc"),
    });

    // GANTI dengan address hasil deploy Day 2
    this.contractAddress = "0xabE74f63a111F240b55e5EF1Aa931443e53C973D";
  }

  // 🔹 Read latest value
  async getLatestValue() {
    try {
      const value = await this.client.readContract({
        address: this.contractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: "getValue",
      });

      return {
        value: value.toString(),
      };
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  // 🔹 Read ValueUpdated events
  async getValueUpdatedEvents(fromblock: number, toblock: number | string) {
    try {
      // sebelum eksekusi logic pastikan (toBlock - fromBlock) < 2048
      // jika lebih besar, kembalikkan error ke client

      const events = await this.client.getLogs({
        address: this.contractAddress,
        event: {
          type: "event",
          name: "ValueUpdated",
          inputs: [
            {
              name: "newValue",
              type: "uint256",
              indexed: false,
            },
          ],
        },
        fromBlock: BigInt(fromblock), // speaker demo (jelaskan ini anti-pattern)
        toBlock: toblock === 'latest' ? 'latest' : BigInt(toblock as number),
      });

      return events.map((event) => ({
        blockNumber: event.blockNumber?.toString(),
        value: event.args.newValue.toString(),
        txHash: event.transactionHash,
      }));
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  // 🔹 Centralized RPC Error Handler
  private handleRpcError(error: any): never {
    const message = error?.message?.toLowerCase() || "";

    console.log({ error: message });

    if (message.includes("timeout")) {
      throw new ServiceUnavailableException(
        "RPC timeout. Silakan coba beberapa saat lagi."
      );
    }

    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("failed")
    ) {
      throw new ServiceUnavailableException(
        "Tidak dapat terhubung ke blockchain RPC."
      );
    }

    throw new InternalServerErrorException(
      "Terjadi kesalahan saat membaca data blockchain."
    );
  }
}
