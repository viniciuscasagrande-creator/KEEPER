import * as jsonLogic from 'json-logic-js';
import { RuleDefinition, RuleEvaluationResult, RuleAction } from './types';

export class RuleEvaluator {
  /**
   * Evaluates an array of rules against a provided context payload.
   * Rules are evaluated in descending order of priority.
   */
  public static evaluate(
    rules: RuleDefinition[],
    contextData: Record<string, unknown>,
  ): RuleEvaluationResult {
    // Sort rules by priority (highest priority first)
    const sortedRules = [...rules]
      .filter((r) => r.isActive)
      .sort((a, b) => b.priority - a.priority);

    const matchedRules: RuleDefinition[] = [];
    const actionsToExecute: RuleAction[] = [];
    let isBlocked = false;
    let blockReason: string | undefined;

    for (const rule of sortedRules) {
      try {
        const isMatch = Boolean(jsonLogic.apply(rule.conditions, contextData));
        if (isMatch) {
          matchedRules.push(rule);
          for (const action of rule.actions) {
            actionsToExecute.push(action);
            if (action.type === 'BLOCK_ACTION') {
              isBlocked = true;
              blockReason = (action.params.reason as string) || `Blocked by rule: ${rule.name}`;
            }
          }
        }
      } catch (err) {
        console.error(`Error evaluating rule ${rule.id} (${rule.name}):`, err);
      }
    }

    return {
      isTriggered: matchedRules.length > 0,
      matchedRules,
      actionsToExecute,
      isBlocked,
      blockReason,
    };
  }

  /**
   * Validates if a JSON-logic condition structure is valid syntactically.
   */
  public static validateCondition(condition: unknown): boolean {
    if (!condition || typeof condition !== 'object') {
      return false;
    }
    try {
      jsonLogic.apply(condition as jsonLogic.RulesLogic, {});
      return true;
    } catch {
      return false;
    }
  }
}
