// import { Injectable } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';

// @Injectable()
// export class PrismaService extends PrismaClient
//   {

//   constructor() {
//     super();
//   }

// }

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
  }

  /**
   * The onModuleInit is optional — if you leave it out, Prisma will connect lazily on its first call to the database.
   */
  async onModuleInit() {
    await this.$connect();
  }
}
