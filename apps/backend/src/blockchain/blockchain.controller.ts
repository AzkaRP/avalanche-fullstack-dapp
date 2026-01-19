import { Controller, Get, Post, Body } from "@nestjs/common";
import { BlockchainService } from "./blockchain.service";
import { GetEventsDto } from "./dto/get-events.dto";

@Controller("blockchain")
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  // GET /blockchain/value
  @Get("value")
  async getValue() {
    return this.blockchainService.getLatestValue();
  }

  // Ubah dari @Post menjadi @Get
  @Get("events") 
  async getEvents() {
    return this.blockchainService.getValueUpdatedEvents(50557000, 'latest' as any);
  }
}