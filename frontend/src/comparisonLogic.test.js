import { getRecommendation, estimateCosts, getComparison } from './comparisonLogic';

describe('comparisonLogic', () => {
  describe('getComparison', () => {
    test('returns comparison data for all services', () => {
      const result = getComparison();
      expect(result).toHaveProperty('lambda');
      expect(result).toHaveProperty('ec2');
      expect(result).toHaveProperty('ecs');
      expect(result).toHaveProperty('fargate');
      expect(result.lambda).toHaveProperty('cost');
      expect(result.lambda).toHaveProperty('scalability');
      expect(result.lambda).toHaveProperty('operationalEffort');
      expect(result.lambda).toHaveProperty('learningCurve');
      expect(result.lambda).toHaveProperty('bestUseCases');
    });
  });

  describe('estimateCosts', () => {
    test('returns cost estimates for all services', () => {
      const inputs = {
        trafficPattern: 'spiky',
        budgetFocus: 'lowest'
      };
      const result = estimateCosts(inputs);
      expect(result).toHaveProperty('lambda');
      expect(result).toHaveProperty('ec2');
      expect(result).toHaveProperty('ecs');
      expect(result).toHaveProperty('fargate');
      expect(typeof result.lambda).toBe('number');
      expect(typeof result.ec2).toBe('number');
      expect(typeof result.ecs).toBe('number');
      expect(typeof result.fargate).toBe('number');
    });

    test('calculates different costs for different traffic patterns', () => {
      const lowTraffic = estimateCosts({ trafficPattern: 'low', budgetFocus: 'lowest' });
      const highTraffic = estimateCosts({ trafficPattern: 'high', budgetFocus: 'lowest' });
      expect(highTraffic.lambda).toBeGreaterThan(lowTraffic.lambda);
    });
  });

  describe('getRecommendation', () => {
    const mockRules = [
      {
        conditions: {
          trafficPattern: ['spiky'],
          budgetFocus: ['lowest'],
          teamExperience: ['beginner'],
          architecture: ['event-driven']
        },
        service: 'AWS Lambda',
        reason: 'Test reason'
      },
      {
        conditions: {
          trafficPattern: ['consistent'],
          budgetFocus: ['predictable'],
          teamExperience: ['strong-devops'],
          architecture: ['monolith']
        },
        service: 'Amazon EC2',
        reason: 'Test reason'
      }
    ];

    test('returns top 3 recommendations', () => {
      const inputs = { trafficPattern: 'spiky', budgetFocus: 'lowest', teamExperience: 'beginner', architecture: 'event-driven' };
      const result = getRecommendation(inputs, mockRules);
      expect(result).toHaveProperty('top3');
      expect(Array.isArray(result.top3)).toBe(true);
      expect(result.top3.length).toBeLessThanOrEqual(3);
    });

    test('includes reasoning path', () => {
      const inputs = { trafficPattern: 'spiky', budgetFocus: 'lowest', teamExperience: 'beginner', architecture: 'event-driven' };
      const result = getRecommendation(inputs, mockRules);
      expect(result).toHaveProperty('reasoningPath');
      expect(typeof result.reasoningPath).toBe('string');
    });

    test('handles empty rules array', () => {
      const inputs = { trafficPattern: 'spiky', budgetFocus: 'lowest', teamExperience: 'beginner', architecture: 'event-driven' };
      const result = getRecommendation(inputs, []);
      expect(result.top3).toEqual([]);
      expect(result.reasoningPath).toBe('');
    });
  });
});
