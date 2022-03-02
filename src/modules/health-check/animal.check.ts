import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';

export interface Animal {
  name: string;
  type: string;
}

@Injectable()
export class AnimalHealthIndicator extends HealthIndicator {
  private animals: Animal[] = [
    { name: 'Bird', type: 'goodboy' },
    { name: 'chipmunk', type: 'badboy' },
  ];

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const badboys = this.animals.filter((animal) => animal.type === 'badboy');
    const isHealthy = badboys.length === 0;
    const result: HealthIndicatorResult = this.getStatus(key, isHealthy, {
      badboys: badboys.length,
    });

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('Animal check failed', result);
  }
}
