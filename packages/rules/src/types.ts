export type RuleTriggerType =
  | 'finance.payable.created'
  | 'finance.payable.payment_requested'
  | 'finance.receivable.due'
  | 'hr.vacation.requested'
  | 'hr.employee.admitted'
  | 'purchase.order.created'
  | string;

export type RuleActionType =
  | 'REQUIRE_APPROVAL'
  | 'BLOCK_ACTION'
  | 'SET_FIELD_VALUE'
  | 'DISPATCH_NOTIFICATION'
  | 'ADD_TAG';

export interface RuleAction {
  type: RuleActionType;
  params: Record<string, unknown>;
}

export interface RuleDefinition {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  trigger: RuleTriggerType;
  priority: number;
  isActive: boolean;
  conditions: Record<string, unknown>; // JSON-logic schema
  actions: RuleAction[];
}

export interface RuleEvaluationResult {
  isTriggered: boolean;
  matchedRules: RuleDefinition[];
  actionsToExecute: RuleAction[];
  isBlocked: boolean;
  blockReason?: string;
}
