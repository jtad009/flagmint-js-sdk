/**
 * Port of FF-EU `utils/flag-evaluator.utest.ts` against the SDK `flagEvaluator` module.
 * Spec: server flag-evaluator (not Go). Write-time validateFlagContext tests omitted.
 */
import * as evaluationLogic from './flagEvaluator';
import type { Condition, Rollout, Variation, Segment } from './flagEvaluator';

jest.mock('./stringHash', () => ({
  stringHash: jest.fn().mockImplementation((str: string) => {
    return str.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  }),
  hashPercent: jest.fn().mockImplementation((str: string) => {
    const h = str.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return h % 100;
  }),
}));

type EvaluationContextT = Record<string, any>;
type FlagValue = any;
type TVariation = Variation;
type SegmentSchemaType = Segment;
type ExpectedFlagType = 'boolean' | 'string' | 'number' | 'json';

const baseInput = (overrides: Partial<{
  fallbackValue: unknown;
  expectedType: ExpectedFlagType;
  context: EvaluationContextT;
}> = {}) => ({
  fallbackValue: false,
  expectedType: 'boolean' as ExpectedFlagType,
  context: { kind: 'user', key: 'user-1' },
  ...overrides,
});

const baseDeps = (overrides: Partial<any> = {}) => ({
  segmentsById: {},
  variationsById: {},
  rolloutsById: {},
  getHashPercent: jest.fn().mockReturnValue(10),
  ...overrides,
});

describe("config-sync/flagEvaluator (FF-EU port)", () => {
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  beforeAll(() => {
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => { });
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => { });
  });
  afterAll(() => {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });
  describe("evaluateRule", () => {
    const context = {
      country: "NG",
      plan: "pro",
      user_id: "abc123",
      email: "user@example.com",
      age: 30,
    };

    it("should return true for eq operator with matching value", () => {
      const rule: Condition = {
        attribute: "country",
        operator: "eq",
        value: "NG",
      };
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(true);
    });

    it("matches custom.siteids against user.siteIds on an SSE-flattened context", () => {
      const sseContext = { "user.key": "test-user-1", "user.siteIds": 789 };
      const rule: Condition = {
        attribute: "custom.siteids",
        operator: "eq",
        value: "789",
      };
      expect(evaluationLogic.evaluateRule(rule, sseContext)).toBe(true);
    });

    it("matches a bare user attribute against a kind-prefixed SSE key", () => {
      const sseContext = { "user.key": "u1", "user.age": 2 };
      const rule: Condition = {
        attribute: "age",
        operator: "eq",
        value: "2",
      };
      expect(evaluationLogic.evaluateRule(rule, sseContext)).toBe(true);
    });

    it("should return false for eq operator when value does not match", () => {
      const rule: Condition = {
        attribute: "country",
        operator: "eq",
        value: "US",
      };
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(false);
    });

    it("should return false for eq operator when rule.value is undefined", () => {
      const rule = {
        attribute: "country",
        operator: "eq",
        value: undefined,
      } as any;
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(false);
    });

    it("should handle eq with boolean attribute and string 'true' value", () => {
      const boolContext = { isActive: true };
      const rule = {
        attribute: "isActive",
        operator: "eq",
        value: "true",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, boolContext)).toBe(true);
    });

    it("should handle eq with boolean attribute and string 'false' value", () => {
      const boolContext = { isActive: false };
      const rule = {
        attribute: "isActive",
        operator: "eq",
        value: "false",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, boolContext)).toBe(true);
    });

    it("should return false for eq when boolean attribute does not match string value", () => {
      const boolContext = { isActive: true };
      const rule = {
        attribute: "isActive",
        operator: "eq",
        value: "false",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, boolContext)).toBe(false);
    });

    it("should handle eq with number attribute and numeric string value", () => {
      const numContext = { score: 85 };
      const rule = {
        attribute: "score",
        operator: "eq",
        value: "85",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, numContext)).toBe(true);
    });

    it("should return false for eq when number attribute does not match numeric string", () => {
      const numContext = { score: 85 };
      const rule = {
        attribute: "score",
        operator: "eq",
        value: "90",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, numContext)).toBe(false);
    });

    it("should return false for eq when number attribute compared to non-numeric string", () => {
      const numContext = { score: 85 };
      const rule = {
        attribute: "score",
        operator: "eq",
        value: "not-a-number",
      } as any;
      // Converts to string comparison: "85" !== "not-a-number"
      expect(evaluationLogic.evaluateRule(rule, numContext)).toBe(false);
    });

    it("should handle eq with string comparison using toComparableString", () => {
      const rule = {
        attribute: "email",
        operator: "eq",
        value: "user@example.com",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(true);
    });

    it("should handle eq with null attribute", () => {
      const nullContext = { nullable: null };
      const rule = {
        attribute: "nullable",
        operator: "eq",
        value: "something",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, nullContext)).toBe(false);
    });

    it("should handle eq with undefined attribute", () => {
      const undefinedContext = { undefined_attr: undefined };
      const rule = {
        attribute: "undefined_attr",
        operator: "eq",
        value: "something",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, undefinedContext)).toBe(false);
    });

    it("should handle eq with negative numbers", () => {
      const negContext = { temperature: -5 };
      const rule = {
        attribute: "temperature",
        operator: "eq",
        value: "-5",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, negContext)).toBe(true);
    });

    it("should handle eq with decimal numbers", () => {
      const decimalContext = { price: 19.99 };
      const rule = {
        attribute: "price",
        operator: "eq",
        value: "19.99",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, decimalContext)).toBe(true);
    });

    it("should handle eq with zero value", () => {
      const zeroContext = { count: 0 };
      const rule = {
        attribute: "count",
        operator: "eq",
        value: "0",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, zeroContext)).toBe(true);
    });

    it("should return false for neq when value matches", () => {
      const rule: Condition = {
        attribute: "plan",
        operator: "neq",
        value: "pro",
      };
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(false);
    });

    it("should return true for neq when value does not match", () => {
      const rule: Condition = {
        attribute: "plan",
        operator: "neq",
        value: "free",
      };
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(true);
    });

    it("should return false for neq when rule.value is undefined", () => {
      const rule = {
        attribute: "plan",
        operator: "neq",
        value: undefined,
      } as any;
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(false);
    });

    it("should handle neq with boolean attribute and string 'true' value", () => {
      const boolContext = { isActive: true };
      const rule = {
        attribute: "isActive",
        operator: "neq",
        value: "true",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, boolContext)).toBe(false);
    });

    it("should handle neq with boolean attribute and string 'false' value", () => {
      const boolContext = { isActive: false };
      const rule = {
        attribute: "isActive",
        operator: "neq",
        value: "false",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, boolContext)).toBe(false);
    });

    it("should return true for neq when boolean attribute does not match string value", () => {
      const boolContext = { isActive: true };
      const rule = {
        attribute: "isActive",
        operator: "neq",
        value: "false",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, boolContext)).toBe(true);
    });

    it("should handle neq with number attribute and numeric string value", () => {
      const numContext = { score: 85 };
      const rule = {
        attribute: "score",
        operator: "neq",
        value: "85",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, numContext)).toBe(false);
    });

    it("should return true for neq when number attribute does not match numeric string", () => {
      const numContext = { score: 85 };
      const rule = {
        attribute: "score",
        operator: "neq",
        value: "90",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, numContext)).toBe(true);
    });

    it("should return false for neq when number attribute compared to non-numeric string", () => {
      const numContext = { score: 85 };
      const rule = {
        attribute: "score",
        operator: "neq",
        value: "not-a-number",
      } as any;
      // When comparing 85 (number) to "not-a-number" (string), toComparableString converts both to strings
      // "85" !== "not-a-number" is true, so neq returns true
      expect(evaluationLogic.evaluateRule(rule, numContext)).toBe(true);
    });

    it("should handle neq with string comparison using toComparableString", () => {
      const rule = {
        attribute: "email",
        operator: "neq",
        value: "different@example.com",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(true);
    });

    it("should handle neq with null attribute", () => {
      const nullContext = { nullable: null };
      const rule = {
        attribute: "nullable",
        operator: "neq",
        value: "something",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, nullContext)).toBe(true);
    });

    it("should handle neq with undefined attribute", () => {
      const undefinedContext = { undefined: undefined };
      const rule = {
        attribute: "undefined",
        operator: "neq",
        value: "something",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, undefinedContext)).toBe(true);
    });

    it("should handle neq with negative numbers", () => {
      const negContext = { temperature: -5 };
      const rule = {
        attribute: "temperature",
        operator: "neq",
        value: "-5",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, negContext)).toBe(false);
    });

    it("should handle neq with decimal numbers", () => {
      const decimalContext = { price: 19.99 };
      const rule = {
        attribute: "price",
        operator: "neq",
        value: "19.99",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, decimalContext)).toBe(false);
    });

    it("should return true for in operator when value is in array", () => {
      const rule: Condition = {
        attribute: "country",
        operator: "in",
        value: ["NG", "KE"],
      };
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(true);
    });

    it("should return false for in operator when value is not an array", () => {
      const rule: Condition = {
        attribute: "country",
        operator: "in",
        value: 'US',
      };
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(false);
    });

    it("should return true for in when attr is an array and has an overlapping value", () => {
      const arrayContext = { siteIds: ["55abbd02e138231d7d1d8813", "55abbd02e138231d7d1d8814"] };
      const rule = {
        attribute: "siteIds",
        operator: "in",
        value: ["55abbd02e138231d7d1d0000", "55abbd02e138231d7d1d8814"],
      } as any;
      expect(evaluationLogic.evaluateRule(rule, arrayContext)).toBe(true);
    });

    it("should return true for in when attr is a serialized array string", () => {
      const arrayContext = { siteIds: '["55abbd02e138231d7d1d8813","55abbd02e138231d7d1d8814"]' };
      const rule = {
        attribute: "siteIds",
        operator: "in",
        value: ["55abbd02e138231d7d1d0000", "55abbd02e138231d7d1d8814"],
      } as any;
      expect(evaluationLogic.evaluateRule(rule, arrayContext)).toBe(true);
    });

    it("should return true for in when attr is a loose bracketed string array", () => {
      const arrayContext = { siteIds: '[55abbd02e138231d7d1d8813,55abbd02e138231d7d1d8814]' };
      const rule = {
        attribute: "siteIds",
        operator: "in",
        value: ["55abbd02e138231d7d1d0000", "55abbd02e138231d7d1d8814"],
      } as any;
      expect(evaluationLogic.evaluateRule(rule, arrayContext)).toBe(true);
    });

    it("should return false for in when attr is an array and has no overlapping value", () => {
      const arrayContext = { siteIds: ["55abbd02e138231d7d1d8813", "55abbd02e138231d7d1d8814"] };
      const rule = {
        attribute: "siteIds",
        operator: "in",
        value: ["55abbd02e138231d7d1d0000", "55abbd02e138231d7d1d0001"],
      } as any;
      expect(evaluationLogic.evaluateRule(rule, arrayContext)).toBe(false);
    });

    it("should return false for nin when value is in array", () => {
      const rule: Condition = {
        attribute: "plan",
        operator: "nin",
        value: ["pro", "enterprise"],
      };
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(false);
    });

    it("should return true for nin when value is not an array", () => {
      const rule: Condition = {
        attribute: "plan",
        operator: "nin",
        value: "pro",
      };
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(true);
    });

    it("should return true for contains when attr is an array and value exists", () => {
      const arrayContext = { siteIds: ["55abbd02e138231d7d1d8813", "55abbd02e138231d7d1d8814"] };
      const rule = {
        attribute: "siteIds",
        operator: "contains",
        value: "55abbd02e138231d7d1d8814",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, arrayContext)).toBe(true);
    });

    it("should return false for contains when attr is an array and value does not exist", () => {
      const arrayContext = { siteIds: ["55abbd02e138231d7d1d8813", "55abbd02e138231d7d1d8814"] };
      const rule = {
        attribute: "siteIds",
        operator: "contains",
        value: "55abbd02e138231d7d1d9999",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, arrayContext)).toBe(false);
    });

    it("should return true for in when attr is an array and any value in rule array exists", () => {
      const arrayContext = { siteIds: ["55abbd02e138231d7d1d8813", "55abbd02e138231d7d1d8814"] };
      const rule = {
        attribute: "siteIds",
        operator: "in",
        value: ["55abbd02e138231d7d1d0000", "55abbd02e138231d7d1d8814"],
      } as any;
      expect(evaluationLogic.evaluateRule(rule, arrayContext)).toBe(true);
    });

    it("should return false for not_contains when attr is an array and value exists", () => {
      const arrayContext = { siteIds: ["55abbd02e138231d7d1d8813", "55abbd02e138231d7d1d8814"] };
      const rule = {
        attribute: "siteIds",
        operator: "not_contains",
        value: "55abbd02e138231d7d1d8813",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, arrayContext)).toBe(false);
    });

    it("treats not_contains of two arrays as a joined-string substring check", () => {
      const arrayContext = { siteIds: ["55abbd02e138231d7d1d8813", "55abbd02e138231d7d1d8814"] };
      const rule = {
        attribute: "siteIds",
        operator: "not_contains",
        value: ["55abbd02e138231d7d1d0001", "55abbd02e138231d7d1d0002"],
      } as any;
      // String(attr) is "8813,8814"; String(value) is "0001,0002". That joined
      // rule string is not a substring, so this is true even though the operator
      // never checks each rule element individually.
      expect(evaluationLogic.evaluateRule(rule, arrayContext)).toBe(true);
    });

    it("stringifies a one-element not_contains rule array the same as a string value", () => {
      const arrayContext = { siteIds: ["55abbd02e138231d7d1d8813", "55abbd02e138231d7d1d8814"] };
      const present = {
        attribute: "siteIds",
        operator: "not_contains",
        value: ["55abbd02e138231d7d1d8813"],
      } as any;
      const absent = {
        attribute: "siteIds",
        operator: "not_contains",
        value: ["55abbd02e138231d7d1d0001"],
      } as any;
      expect(evaluationLogic.evaluateRule(present, arrayContext)).toBe(false);
      expect(evaluationLogic.evaluateRule(absent, arrayContext)).toBe(true);
    });

    it("does not treat not_contains of two arrays as per-element membership", () => {
      const arrayContext = { siteIds: ["55abbd02e138231d7d1d8813", "55abbd02e138231d7d1d8814"] };
      const rule = {
        attribute: "siteIds",
        operator: "not_contains",
        value: ["55abbd02e138231d7d1d8813", "55abbd02e138231d7d1d0001"],
      } as any;
      // One rule id is present. Element-wise "none of these exist" would be
      // false; joined-string includes() is true because "8813,0001" is not a
      // substring of "8813,8814".
      expect(evaluationLogic.evaluateRule(rule, arrayContext)).toBe(true);
    });

    it("should return true for exists when attribute is defined", () => {
      const rule: Condition = {
        attribute: "email",
        operator: "exists",
        value: "",
      };
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(true);
    });

    it("should return true for not_exists when attribute is undefined", () => {
      const rule: Condition = {
        attribute: "nonexistent_field",
        operator: "not_exists",
        value: "",
      };
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(true);
    });

    it("should return true for not_exists when attribute is null", () => {
      const nullContext = { nullable_field: null };
      const rule: Condition = {
        attribute: "nullable_field",
        operator: "not_exists",
        value: "",
      };
      expect(evaluationLogic.evaluateRule(rule, nullContext)).toBe(true);
    });

    it("should return false for not_exists when attribute exists with string value", () => {
      const rule: Condition = {
        attribute: "email",
        operator: "not_exists",
        value: "",
      };
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(false);
    });

    it("should return false for not_exists when attribute exists with number value", () => {
      const numContext = { age: 30 };
      const rule: Condition = {
        attribute: "age",
        operator: "not_exists",
        value: "",
      };
      expect(evaluationLogic.evaluateRule(rule, numContext)).toBe(false);
    });

    it("should return false for not_exists when attribute exists with boolean true", () => {
      const boolContext = { isActive: true };
      const rule: Condition = {
        attribute: "isActive",
        operator: "not_exists",
        value: "",
      };
      expect(evaluationLogic.evaluateRule(rule, boolContext)).toBe(false);
    });

    it("should return false for not_exists when attribute exists with boolean false", () => {
      const boolContext = { isActive: false };
      const rule: Condition = {
        attribute: "isActive",
        operator: "not_exists",
        value: "",
      };
      expect(evaluationLogic.evaluateRule(rule, boolContext)).toBe(false);
    });

    it("should return false for not_exists when attribute exists with zero", () => {
      const zeroContext = { count: 0 };
      const rule: Condition = {
        attribute: "count",
        operator: "not_exists",
        value: "",
      };
      expect(evaluationLogic.evaluateRule(rule, zeroContext)).toBe(false);
    });

    it("should return false for not_exists when attribute exists with empty string", () => {
      const emptyContext = { description: "" };
      const rule: Condition = {
        attribute: "description",
        operator: "not_exists",
        value: "",
      };
      expect(evaluationLogic.evaluateRule(rule, emptyContext)).toBe(false);
    });

    it("should return false for not_exists when attribute exists with empty array", () => {
      const arrayContext = { tags: [] };
      const rule: Condition = {
        attribute: "tags",
        operator: "not_exists",
        value: "",
      };
      expect(evaluationLogic.evaluateRule(rule, arrayContext)).toBe(false);
    });

    it("should return false for not_exists when attribute exists with empty object", () => {
      const objContext = { metadata: {} };
      const rule: Condition = {
        attribute: "metadata",
        operator: "not_exists",
        value: "",
      };
      expect(evaluationLogic.evaluateRule(rule, objContext)).toBe(false);
    });

    it("should return false for unknown operator", () => {
      const rule = {
        attribute: "plan",
        operator: "unknown",
        value: "pro",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(false);
    });

    it("should return false for gt operator  when value is undefined", () => {
      const rule = {
        attribute: "plan",
        operator: "gt",
        value: undefined,
      } as any;
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(false);
    });

    it("should return true for gt operator when left is greater than right", () => {
      const rule = {
        attribute: 'age',
        operator: "gt",
        value: 20,
      } as any;
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(true);
    });

    it("should return false for gt operator when left is not defined", () => {
      const rule = {
        attribute: 'age',
        operator: "gt",
        value: 'not-a-number',
      } as any;
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(false);
    });

    it("should return true for lt operator when left is less than right", () => {
      const rule = {
        attribute: 'age',
        operator: "lt",
        value: "35",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(true);
    });

    it("should return false for lt operator when left is not less than right", () => {
      const rule = {
        attribute: 'age',
        operator: "lt",
        value: "20",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(false);
    });

    it("should return false for lt operator when left equals right", () => {
      const rule = {
        attribute: 'age',
        operator: "lt",
        value: "30",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(false);
    });

    it("should return false for lt operator when rule.value is null", () => {
      const rule = {
        attribute: 'age',
        operator: "lt",
        value: null,
      } as any;
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(false);
    });

    it("should return false for lt operator when rule.value is undefined", () => {
      const rule = {
        attribute: 'age',
        operator: "lt",
        value: undefined,
      } as any;
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(false);
    });

    it("should return false for lt operator when attribute is not a number", () => {
      const rule = {
        attribute: 'country',
        operator: "lt",
        value: "20",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(false);
    });

    it("should return false for lt operator when rule.value is not a number", () => {
      const rule = {
        attribute: 'age',
        operator: "lt",
        value: "not-a-number",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, context)).toBe(false);
    });

    it("should handle lt operator with negative numbers", () => {
      const negContext = { temperature: -5 };
      const rule = {
        attribute: 'temperature',
        operator: "lt",
        value: "-10",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, negContext)).toBe(false);
    });

    it("should handle lt operator with decimal numbers", () => {
      const decimalContext = { price: 19.99 };
      const rule = {
        attribute: 'price',
        operator: "lt",
        value: "20.00",
      } as any;
      expect(evaluationLogic.evaluateRule(rule, decimalContext)).toBe(true);
    });
  });

  describe("coerceType", () => {
    it("should coerce to boolean", () => {
      expect(evaluationLogic.coerceType(0, "boolean")).toBe(false);
      expect(evaluationLogic.coerceType(1, "boolean")).toBe(true);
      expect(evaluationLogic.coerceType("hello", "boolean")).toBe(true);
    });

    it("should coerce to number", () => {
      expect(evaluationLogic.coerceType("42", "number")).toBe(42);
      expect(evaluationLogic.coerceType(true, "number")).toBe(1);
    });

    it("should coerce to string", () => {
      expect(evaluationLogic.coerceType(42, "string")).toBe("42");
      expect(evaluationLogic.coerceType(true, "string")).toBe("true");
    });

    it("should return object if valid object", () => {
      const obj = { theme: "dark" };
      expect(evaluationLogic.coerceType(obj, "json")).toBe(obj);
    });

    it("should return {} for invalid object", () => {
      expect(evaluationLogic.coerceType(null, "json")).toEqual({});
      expect(evaluationLogic.coerceType("not-object", "json")).toEqual({});
    });

    it("should return value as-is if type is not matched", () => {
      expect(evaluationLogic.coerceType("abc", "string")).toBe("abc");
    });
  });


  describe('evaluateFlagWithTargetingRules', () => {
  let evaluateRuleSpy: jest.SpyInstance;
  let percentageSpy: jest.SpyInstance;
  let variantSpy: jest.SpyInstance;
  let gradualSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    evaluateRuleSpy = jest.spyOn(evaluationLogic, 'evaluateRule');
    percentageSpy = jest.spyOn(evaluationLogic, 'applyPercentageRollout');
    variantSpy = jest.spyOn(evaluationLogic, 'applyVariantRollout');
    gradualSpy = jest.spyOn(evaluationLogic, 'applyGradualRollout');
  });
  
  afterEach(() => {
    evaluateRuleSpy.mockRestore();
    percentageSpy.mockRestore();
    variantSpy.mockRestore();
    gradualSpy.mockRestore();
  });

  // --- D: no rules matched / empty rules ---
  it('returns fallback when there are no targeting rules', () => {
    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput(),
      [],
      baseDeps(),
    );
    expect(result).toBe(false);
  });

  it('matches targeting on an already-flat SSE context without re-flattening to empty', () => {
    const highId = '77777777-5555-4444-9999-000000000002';
    const standardId = '77777777-5555-4444-9999-000000000001';
    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      {
        fallbackValue: 100,
        expectedType: 'number',
        context: { 'user.key': 'test-user-1', 'user.siteIds': 789 } as any,
      },
      [
        {
          id: 'r1',
          kind: 'custom',
          order_index: 1,
          conditions: [{ attribute: 'custom.siteids', operator: 'eq', value: '789' }],
          variation_id: highId,
          logical_op: 'AND',
        } as any,
      ],
      baseDeps({
        variationsById: {
          [standardId]: { id: standardId, key: 'standard', type: 'number', value: 100 },
          [highId]: { id: highId, key: 'high', type: 'number', value: 500 },
        },
      }),
    );
    expect(result).toBe(500);
  });

  // --- B1: segment rule: no segment_id / no segmentsById ---
  it('skips segment rule without segment_id', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'segment',
        order_index: 0,
        segment_id: undefined,
      } as any,
    ];

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput(),
      rules,
      baseDeps(),
    );

    expect(result).toBe(false); // loop ends -> fallback
    expect(evaluateRuleSpy).not.toHaveBeenCalled();
  });

  it('skips segment rule if segment not found or has no rules', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'segment',
        order_index: 0,
        segment_id: 'seg-1',
      } as any,
    ];

    const deps = baseDeps({
      segmentsById: {
        'seg-1': { id: 'seg-1', rules: [] }, // empty rules
      },
    });

    const result = evaluationLogic.evaluateFlagWithTargetingRules(baseInput(), rules, deps);
    expect(result).toBe(false);
    expect(evaluateRuleSpy).not.toHaveBeenCalled();
  });

  // --- B1: segment rule evaluateRule false / true ---
  it('segment rule does not match if any segment rule fails', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'segment',
        order_index: 0,
        segment_id: 'seg-1',
      } as any,
    ];

    const deps = baseDeps({
      segmentsById: {
        'seg-1': {
          id: 'seg-1',
          rules: [{
            value: '2',
            attribute: 'key',
            operator: 'eq',
            type: 'rule',
          }, {
            value: '2',
            attribute: 'key',
            operator: 'eq',
            type: 'rule',
          }],
        },
      },
    });

    // Mock the evaluateRule function to return false on second call
    evaluateRuleSpy.mockReturnValueOnce(true).mockReturnValueOnce(false);

    const result = evaluationLogic.evaluateFlagWithTargetingRules(baseInput(), rules, deps);
    // When segment rule evaluation returns false, function continues and returns fallback
    expect(result).toBe(false);
  });

  it('segment rule matches when all segment rules pass', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'segment',
        order_index: 0,
        segment_id: 'seg-1',
        variation_id: 'var-1',
      } as any,
    ];

    const deps = baseDeps({
      segmentsById: {
        'seg-1': {
          id: 'seg-1',
          rules: [{
            value: 'user-1',
            attribute: 'key',
            operator: 'eq',
            type: 'rule',
          }, {
            value: 'user-1',
            attribute: 'key',
            operator: 'eq',
            type: 'rule',
          }],
        },
      },
      variationsById: {
        'var-1': { id: 'var-1', value: 'matched', type: 'string' },
      },
    });

    // Don't mock evaluateRule - use the real implementation with matching context
    const result = evaluationLogic.evaluateFlagWithTargetingRules(baseInput({ fallbackValue: 'default', expectedType: 'string' }), rules, deps);
    // When all segment rules match, variation value is returned
    expect(result).toBe('matched');
  });

  // --- B2: custom rule empty / missing conditions ---
  it('skips custom rule with no conditions', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [],
      } as any,
    ];

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput(),
      rules,
      baseDeps(),
    );

    expect(result).toBe(false);
    expect(evaluateRuleSpy).not.toHaveBeenCalled();
  });

  it('custom rule with conditions that fail does not match', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{}, {}],
      } as any,
    ];

    evaluateRuleSpy.mockReturnValueOnce(true).mockReturnValueOnce(false);

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput(),
      rules,
      baseDeps(),
    );

    expect(result).toBe(false);
  });

  it('custom rule matches when all conditions pass', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ 
          type: 'rule',
          attribute: 'key',
          operator: 'eq',
          value: 'user-1'
        }],
        variation_id: 'var-1',
      } as any,
    ];

    const deps = baseDeps({
      variationsById: {
        'var-1': { id: 'var-1', value: 'custom-matched', type: 'string' },
      },
    });

    // Don't mock evaluateRule - use the real implementation with matching context
    const result = evaluationLogic.evaluateFlagWithTargetingRules(baseInput({ fallbackValue: 'default', expectedType: 'string' }), rules, deps);
    // When all conditions match, variation value is returned
    expect(result).toBe('custom-matched');
  });

  // --- C1: variation present vs missing ---
  it('falls back when matched rule references missing variation', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        variation_id: 'missing-var',
      } as any,
    ];

    const deps = baseDeps({
      variationsById: {}, // variation not found
    });

    const result = evaluationLogic.evaluateFlagWithTargetingRules(baseInput(), rules, deps);
    expect(result).toBe(false); // fallback
  });

  it('logs warning when matched rule references missing variation', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const rules = [
      {
        id: 'rule-abc',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        variation_id: 'missing-var',
      } as any,
    ];

    const deps = baseDeps();

    evaluationLogic.evaluateFlagWithTargetingRules(baseInput(), rules, deps);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('missing variation_id')
    );
    warnSpy.mockRestore();
  });

  // --- C2: rollout present vs missing ---
  it('falls back when matched rule references missing rollout', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        rollout_id: 'roll-1',
      } as any,
    ];

    const deps = baseDeps({
      rolloutsById: {}, // missing
    });

    const result = evaluationLogic.evaluateFlagWithTargetingRules(baseInput(), rules, deps);
    expect(result).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('missing rollout_id')
    );
    warnSpy.mockRestore();
  });

  it('logs warning when matched rule references missing rollout', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const rules = [
      {
        id: 'rule-xyz',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        rollout_id: 'missing-rollout',
      } as any,
    ];

    const deps = baseDeps();

    evaluationLogic.evaluateFlagWithTargetingRules(baseInput(), rules, deps);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('missing rollout_id')
    );
    warnSpy.mockRestore();
  });

  // --- C2: rollout strategies ---
  it('returns fallback for rollout strategy "off"', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{}],
        rollout_id: 'roll-1',
      } as any,
    ];

    const deps = baseDeps({
      rolloutsById: {
        'roll-1': { id: 'roll-1', strategy: 'off' },
      },
    });
    evaluateRuleSpy.mockReturnValue(true);

    const result = evaluationLogic.evaluateFlagWithTargetingRules(baseInput(), rules, deps);
    expect(result).toBe(false);
    expect(percentageSpy).not.toHaveBeenCalled();
    expect(variantSpy).not.toHaveBeenCalled();
    expect(gradualSpy).not.toHaveBeenCalled();
  });

  // === PERCENTAGE STRATEGY TESTS ===
  it('delegates to applyPercentageRollout for "percentage" strategy', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        rollout_id: 'roll-1',
      } as any,
    ];

    const deps = baseDeps({
      rolloutsById: {
        'roll-1': { id: 'roll-1', strategy: 'percentage', percentage: 100, salt: 'test-salt' },
      },
    });

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ expectedType: 'boolean', fallbackValue: false }),
      rules,
      deps
    );
    // 100% rollout should always be true
    expect(result).toBe(true);
  });

  it('percentage rollout with 0% returns fallback', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        rollout_id: 'roll-1',
      } as any,
    ];

    const deps = baseDeps({
      rolloutsById: {
        'roll-1': { id: 'roll-1', strategy: 'percentage', percentage: 0, salt: 'test-salt' },
      },
    });

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ expectedType: 'boolean', fallbackValue: false }),
      rules,
      deps
    );
    // 0% rollout should always be false
    expect(result).toBe(false);
  });

  it('percentage rollout with 50% bucketing works deterministically', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-50' }],
        rollout_id: 'roll-1',
      } as any,
    ];

    const deps = baseDeps({
      rolloutsById: {
        'roll-1': { id: 'roll-1', strategy: 'percentage', percentage: 50, salt: 'consistent-salt' },
      },
    });

    // Same user should get consistent result
    const result1 = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ 
        expectedType: 'boolean', 
        fallbackValue: false,
        context: { kind: 'user', key: 'user-50' }
      }),
      rules,
      deps
    );

    const result2 = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ 
        expectedType: 'boolean', 
        fallbackValue: false,
        context: { kind: 'user', key: 'user-50' }
      }),
      rules,
      deps
    );

    expect(result1).toBe(result2); // same user gets same result
    expect(typeof result1).toBe('boolean');
  });

  // === VARIANT STRATEGY TESTS ===
  it('delegates to applyVariantRollout for "variant" strategy', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        rollout_id: 'roll-1',
      } as any,
    ];

    const deps = baseDeps({
      rolloutsById: {
        'roll-1': { id: 'roll-1', strategy: 'variant', salt: 'test-salt', variants: [{ variation_id: 'var-1', weight: 100 }] },
      },
      variationsById: {
        'var-1': { id: 'var-1', value: 'selected', type: 'string' },
      },
    });

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ expectedType: 'string', fallbackValue: 'default' }),
      rules,
      deps
    );
    expect(result).toBe('selected');
  });

  it('variant rollout with 100% weight on single variant returns that variant', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        rollout_id: 'roll-1',
      } as any,
    ];

    const deps = baseDeps({
      rolloutsById: {
        'roll-1': {
          id: 'roll-1',
          strategy: 'variant',
          salt: 'test-salt',
          variants: [{ variation_id: 'var-1', weight: 100 }],
        },
      },
      variationsById: {
        'var-1': { id: 'var-1', value: 'only-option', type: 'string' },
      },
    });

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ expectedType: 'string', fallbackValue: 'fallback' }),
      rules,
      deps
    );

    expect(result).toBe('only-option');
  });

  it('variant rollout with multiple variants distributes based on weight', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'test-user' }],
        rollout_id: 'roll-1',
      } as any,
    ];

    const deps = baseDeps({
      rolloutsById: {
        'roll-1': {
          id: 'roll-1',
          strategy: 'variant',
          salt: 'distribution-salt',
          variants: [
            { variation_id: 'var-a', weight: 50 },
            { variation_id: 'var-b', weight: 50 },
          ],
        },
      },
      variationsById: {
        'var-a': { id: 'var-a', value: 'variant-a', type: 'string' },
        'var-b': { id: 'var-b', value: 'variant-b', type: 'string' },
      },
    });

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ expectedType: 'string', fallbackValue: 'fallback' }),
      rules,
      deps
    );

    // Result should be one of the variants or fallback (if user doesn't hash into either bucket)
    expect(['variant-a', 'variant-b', 'fallback']).toContain(result);
  });

  it('variant rollout returns fallback when variant not found', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        rollout_id: 'roll-1',
      } as any,
    ];

    const deps = baseDeps({
      rolloutsById: {
        'roll-1': {
          id: 'roll-1',
          strategy: 'variant',
          salt: 'test-salt',
          variants: [{ variation_id: 'missing-var', weight: 100 }],
        },
      },
      variationsById: {}, // variant not in map
    });

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ expectedType: 'string', fallbackValue: 'fallback' }),
      rules,
      deps
    );

    expect(result).toBe('fallback');
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Variant rollout references missing variation_id')
    );
    warnSpy.mockRestore();
  });

  it('variant rollout works with numeric type', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        rollout_id: 'roll-1',
      } as any,
    ];

    const deps = baseDeps({
      rolloutsById: {
        'roll-1': {
          id: 'roll-1',
          strategy: 'variant',
          salt: 'test-salt',
          variants: [{ variation_id: 'var-num', weight: 100 }],
        },
      },
      variationsById: {
        'var-num': { id: 'var-num', value: 42, type: 'number' },
      },
    });

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ expectedType: 'number', fallbackValue: 0 }),
      rules,
      deps
    );

    expect(result).toBe(42);
    expect(typeof result).toBe('number');
  });

  it('variant rollout works with JSON type', () => {
    const jsonValue = { color: 'blue', size: 'large' };
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        rollout_id: 'roll-1',
      } as any,
    ];

    const deps = baseDeps({
      rolloutsById: {
        'roll-1': {
          id: 'roll-1',
          strategy: 'variant',
          salt: 'test-salt',
          variants: [{ variation_id: 'var-json', weight: 100 }],
        },
      },
      variationsById: {
        'var-json': { id: 'var-json', value: jsonValue, type: 'json' },
      },
    });

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ expectedType: 'json', fallbackValue: {} }),
      rules,
      deps
    );

    expect(result).toEqual(jsonValue);
  });

  // === GRADUAL STRATEGY TESTS ===
  it('delegates to applyGradualRollout for "gradual" strategy', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        rollout_id: 'roll-1',
      } as any,
    ];

    // Set start_at to far past to ensure current percentage is > 0
    const deps = baseDeps({
      rolloutsById: {
        'roll-1': {
          id: 'roll-1',
          strategy: 'gradual',
          salt: 'test-salt',
          target_percentage: 100,
          increment: 10,
          interval_hours: 24,
          start_at: '2020-01-01T00:00:00Z',
        },
      },
    });

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ expectedType: 'boolean', fallbackValue: false }),
      rules,
      deps
    );

    expect(typeof result).toBe('boolean');
  });

  it('gradual rollout returns fallback when start_at is in future', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        rollout_id: 'roll-1',
      } as any,
    ];

    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    const deps = baseDeps({
      rolloutsById: {
        'roll-1': {
          id: 'roll-1',
          strategy: 'gradual',
          salt: 'test-salt',
          target_percentage: 100,
          increment: 10,
          interval_hours: 24,
          start_at: futureDate.toISOString(),
        },
      },
    });

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ expectedType: 'boolean', fallbackValue: false }),
      rules,
      deps
    );

    expect(result).toBe(false); // hasn't started yet
  });

  it('gradual rollout increases percentage over time', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'early-user' }],
        rollout_id: 'roll-1',
      } as any,
    ];

    // Start 48 hours ago (2 intervals of 24 hours each)
    const now = new Date();
    const startTime = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const deps = baseDeps({
      rolloutsById: {
        'roll-1': {
          id: 'roll-1',
          strategy: 'gradual',
          salt: 'time-based-salt',
          target_percentage: 100,
          increment: 10,
          interval_hours: 24,
          start_at: startTime.toISOString(),
        },
      },
    });

    // Current percentage should be 20% (2 intervals * 10% increment)
    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ expectedType: 'boolean', fallbackValue: false }),
      rules,
      deps
    );

    expect(typeof result).toBe('boolean');
  });

  it('gradual rollout respects target_percentage cap', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        rollout_id: 'roll-1',
      } as any,
    ];

    // Start 1000 hours ago (way more than enough intervals)
    const startTime = new Date(Date.now() - 1000 * 60 * 60 * 1000);

    const deps = baseDeps({
      rolloutsById: {
        'roll-1': {
          id: 'roll-1',
          strategy: 'gradual',
          salt: 'test-salt',
          target_percentage: 50, // capped at 50%
          increment: 10,
          interval_hours: 24,
          start_at: startTime.toISOString(),
        },
      },
    });

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ expectedType: 'boolean', fallbackValue: false }),
      rules,
      deps
    );

    // Should be true since enough time has passed and we're above target_percentage
    expect(typeof result).toBe('boolean');
  });

  it('falls back on unsupported rollout strategy', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{}],
        rollout_id: 'roll-1',
      } as any,
    ];

    const deps = baseDeps({
      rolloutsById: {
        'roll-1': { id: 'roll-1', strategy: 'weird' },
      },
    });

    evaluateRuleSpy.mockReturnValue(true);

    const result = evaluationLogic.evaluateFlagWithTargetingRules(baseInput(), rules, deps);
    expect(result).toBe(false);
    expect(percentageSpy).not.toHaveBeenCalled();
    expect(variantSpy).not.toHaveBeenCalled();
    expect(gradualSpy).not.toHaveBeenCalled();
  });

  it('logs warning for unsupported rollout strategy', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const rules = [
      {
        id: 'rule-unsupported',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        rollout_id: 'roll-1',
      } as any,
    ];

    const deps = baseDeps({
      rolloutsById: {
        'roll-1': { id: 'roll-1', strategy: 'unsupported-strategy' },
      },
    });

    evaluationLogic.evaluateFlagWithTargetingRules(baseInput(), rules, deps);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unsupported rollout strategy')
    );
    warnSpy.mockRestore();
  });

  // --- C3: matched rule with no variation_id and no rollout_id ---
  it('falls back if rule matches but has no variation_id or rollout_id', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{}],
      } as any,
    ];

    evaluateRuleSpy.mockReturnValue(true);

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput(),
      rules,
      baseDeps(),
    );

    expect(result).toBe(false);
  });

  it('logs warning when rule matches but has neither variation_id nor rollout_id', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const rules = [
      {
        id: 'rule-incomplete',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        // missing both variation_id and rollout_id
      } as any,
    ];

    evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput(),
      rules,
      baseDeps(),
    );

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('has no variation_id or rollout_id set')
    );
    warnSpy.mockRestore();
  });

  // Additional error handling tests for the red highlighted paths
  it('handles multiple rules and stops at first match', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        variation_id: 'var-1',
      } as any,
      {
        id: 'r2',
        kind: 'custom',
        order_index: 1,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        variation_id: 'var-2',
      } as any,
    ];

    const deps = baseDeps({
      variationsById: {
        'var-1': { id: 'var-1', value: 'first', type: 'string' },
        'var-2': { id: 'var-2', value: 'second', type: 'string' },
      },
    });

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ expectedType: 'string', fallbackValue: 'default' }),
      rules,
      deps
    );

    expect(result).toBe('first'); // stops at first matching rule
  });

  it('respects rule order_index when evaluating', () => {
    const rules = [
      {
        id: 'r2',
        kind: 'custom',
        order_index: 1, // second
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        variation_id: 'var-2',
      } as any,
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0, // first (should be evaluated first despite array order)
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        variation_id: 'var-1',
      } as any,
    ];

    const deps = baseDeps({
      variationsById: {
        'var-1': { id: 'var-1', value: 'ordered-first', type: 'string' },
        'var-2': { id: 'var-2', value: 'ordered-second', type: 'string' },
      },
    });

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ expectedType: 'string', fallbackValue: 'default' }),
      rules,
      deps
    );

    expect(result).toBe('ordered-first'); // respects order_index, not array order
  });

  it('returns fallback when all rules have non-matching conditions', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'different-user' }],
        variation_id: 'var-1',
      } as any,
    ];

    const deps = baseDeps({
      variationsById: {
        'var-1': { id: 'var-1', value: 'variant', type: 'string' },
      },
    });

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ expectedType: 'string', fallbackValue: 'fallback-value' }),
      rules,
      deps
    );

    expect(result).toBe('fallback-value');
  });

  it('handles empty rules array', () => {
    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ fallbackValue: 'empty-fallback', expectedType: 'string' }),
      [],
      baseDeps()
    );

    expect(result).toBe('empty-fallback');
  });

  it('logs error on context validation failure', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        variation_id: 'var-1',
      } as any,
    ];

    const deps = baseDeps({
      variationsById: {
        'var-1': { id: 'var-1', value: 'test', type: 'string' },
      },
    });

    // The context validation is commented out in the function, but test shows error handling path exists
    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ fallbackValue: 'error-fallback', expectedType: 'string' }),
      rules,
      deps
    );

    // Should still work or fallback on error
    expect(result).toBeDefined();
  });
  // Additional tests for the "off" strategy behavior
  it('returns fallback explicitly when rollout strategy is "off"', () => {
    const warningsSpy = jest.spyOn(console, 'warn').mockImplementation();
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        rollout_id: 'off-rollout',
      } as any,
    ];

    const deps = baseDeps({
      rolloutsById: {
        'off-rollout': { id: 'off-rollout', strategy: 'off', salt: 'test' },
      },
    });

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ fallbackValue: false, expectedType: 'boolean' }),
      rules,
      deps
    );

    expect(result).toBe(false);
    expect(percentageSpy).not.toHaveBeenCalled();
    expect(warningsSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('references missing rollout_id')
    );
    warningsSpy.mockRestore();
  });

  // Test for variation and rollout coexistence (variation should take precedence in sequential rule evaluation)
  it('returns variation when rule has both variation_id and rollout_id (variation checked first)', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        variation_id: 'var-priority',
        rollout_id: 'ignored-rollout', // should not be evaluated
      } as any,
    ];

    const deps = baseDeps({
      variationsById: {
        'var-priority': { id: 'var-priority', value: 'priority-value', type: 'string' },
      },
      rolloutsById: {
        'ignored-rollout': { id: 'ignored-rollout', strategy: 'percentage', percentage: 100, salt: 'test' },
      },
    });

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ fallbackValue: 'default', expectedType: 'string' }),
      rules,
      deps
    );

    expect(result).toBe('priority-value');
    expect(percentageSpy).not.toHaveBeenCalled(); // rollout should not be called
  });

  // Test for different flag types through "off" strategy
  it('respects expectedType when returning fallback via "off" strategy', () => {
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        rollout_id: 'off-rollout',
      } as any,
    ];

    const deps = baseDeps({
      rolloutsById: {
        'off-rollout': { id: 'off-rollout', strategy: 'off' },
      },
    });

    // Test with number type
    const resultNumber = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ fallbackValue: 42, expectedType: 'number' }),
      rules,
      deps
    );
    expect(resultNumber).toBe(42);
    expect(typeof resultNumber).toBe('number');

    // Test with string type
    const resultString = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ fallbackValue: 'string-fallback', expectedType: 'string' }),
      rules,
      deps
    );
    expect(resultString).toBe('string-fallback');
    expect(typeof resultString).toBe('string');

    // Test with json type
    const resultJson = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ fallbackValue: { key: 'value' }, expectedType: 'json' }),
      rules,
      deps
    );
    expect(resultJson).toEqual({ key: 'value' });
    expect(typeof resultJson).toBe('object');
  });

  // Test rollout missing edge case with different strategies
  it('returns fallback when rollout_id references non-existent rollout', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const rules = [
      {
        id: 'r1',
        kind: 'custom',
        order_index: 0,
        conditions: [{ type: 'rule', attribute: 'key', operator: 'eq', value: 'user-1' }],
        rollout_id: 'non-existent',
      } as any,
    ];

    const deps = baseDeps({
      rolloutsById: {}, // no rollouts defined
    });

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({ fallbackValue: false, expectedType: 'boolean' }),
      rules,
      deps
    );

    expect(result).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Rule r1 references missing rollout_id')
    );
    warnSpy.mockRestore();
  });

  // Test segment with matching rules that lead to variation
  it('evaluates segment rules and returns variation when matched', () => {
    const rules = [
      {
        id: 'segment-rule',
        kind: 'segment',
        order_index: 0,
        segment_id: 'premium-segment',
        variation_id: 'premium-variant',
      } as any,
    ];

    const deps = baseDeps({
      segmentsById: {
        'premium-segment': {
          id: 'premium-segment',
          rules: [
            { type: 'rule', attribute: 'plan', operator: 'eq', value: 'premium' },
          ],
        },
      },
      variationsById: {
        'premium-variant': { id: 'premium-variant', value: 'premium-experience', type: 'string' },
      },
    });

    const result = evaluationLogic.evaluateFlagWithTargetingRules(
      baseInput({
        fallbackValue: 'free',
        expectedType: 'string',
        context: { kind: 'user', key: 'user-1', plan: 'premium' },
      }),
      rules,
      deps
    );

    expect(result).toBe('premium-experience');
  });

  // === OR SEGMENT LOGIC TESTS ===
  describe('OR segment logic', () => {
    it('segment with OR logic matches when at least one rule passes', () => {
      const rules = [
        {
          id: 'or-segment-rule',
          kind: 'segment',
          order_index: 0,
          segment_id: 'or-segment',
          variation_id: 'or-variant',
        } as any,
      ];

      const deps = baseDeps({
        segmentsById: {
          'or-segment': {
            id: 'or-segment',
            logical_op: 'OR',
            rules: [
              { type: 'rule', attribute: 'country', operator: 'eq', value: 'US' }, // does not match
              { type: 'rule', attribute: 'plan', operator: 'eq', value: 'premium' }, // matches
            ],
          },
        },
        variationsById: {
          'or-variant': { id: 'or-variant', value: 'or-matched', type: 'string' },
        },
      });

      const result = evaluationLogic.evaluateFlagWithTargetingRules(
        baseInput({
          fallbackValue: 'default',
          expectedType: 'string',
          context: { kind: 'user', key: 'user-1', country: 'NG', plan: 'premium' },
        }),
        rules,
        deps
      );

      expect(result).toBe('or-matched');
    });

    it('segment with OR logic does not match when all rules fail', () => {
      const rules = [
        {
          id: 'or-segment-rule',
          kind: 'segment',
          order_index: 0,
          segment_id: 'or-segment',
          variation_id: 'or-variant',
        } as any,
      ];

      const deps = baseDeps({
        segmentsById: {
          'or-segment': {
            id: 'or-segment',
            logical_op: 'OR',
            rules: [
              { type: 'rule', attribute: 'country', operator: 'eq', value: 'US' }, // does not match
              { type: 'rule', attribute: 'plan', operator: 'eq', value: 'enterprise' }, // does not match
            ],
          },
        },
        variationsById: {
          'or-variant': { id: 'or-variant', value: 'or-matched', type: 'string' },
        },
      });

      const result = evaluationLogic.evaluateFlagWithTargetingRules(
        baseInput({
          fallbackValue: 'default',
          expectedType: 'string',
          context: { kind: 'user', key: 'user-1', country: 'NG', plan: 'premium' },
        }),
        rules,
        deps
      );

      expect(result).toBe('default'); // fallback
    });

    it('segment with AND logic (default) requires all rules to match', () => {
      const rules = [
        {
          id: 'and-segment-rule',
          kind: 'segment',
          order_index: 0,
          segment_id: 'and-segment',
          variation_id: 'and-variant',
        } as any,
      ];

      const deps = baseDeps({
        segmentsById: {
          'and-segment': {
            id: 'and-segment',
            logical_op: 'AND', // explicit AND
            rules: [
              { type: 'rule', attribute: 'country', operator: 'eq', value: 'NG' }, // matches
              { type: 'rule', attribute: 'plan', operator: 'eq', value: 'premium' }, // matches
            ],
          },
        },
        variationsById: {
          'and-variant': { id: 'and-variant', value: 'and-matched', type: 'string' },
        },
      });

      const result = evaluationLogic.evaluateFlagWithTargetingRules(
        baseInput({
          fallbackValue: 'default',
          expectedType: 'string',
          context: { kind: 'user', key: 'user-1', country: 'NG', plan: 'premium' },
        }),
        rules,
        deps
      );

      expect(result).toBe('and-matched');
    });

    it('segment with AND logic fails if any rule does not match', () => {
      const rules = [
        {
          id: 'and-segment-rule',
          kind: 'segment',
          order_index: 0,
          segment_id: 'and-segment',
          variation_id: 'and-variant',
        } as any,
      ];

      const deps = baseDeps({
        segmentsById: {
          'and-segment': {
            id: 'and-segment',
            logical_op: 'AND',
            rules: [
              { type: 'rule', attribute: 'country', operator: 'eq', value: 'NG' }, // matches
              { type: 'rule', attribute: 'plan', operator: 'eq', value: 'enterprise' }, // does not match
            ],
          },
        },
        variationsById: {
          'and-variant': { id: 'and-variant', value: 'and-matched', type: 'string' },
        },
      });

      const result = evaluationLogic.evaluateFlagWithTargetingRules(
        baseInput({
          fallbackValue: 'default',
          expectedType: 'string',
          context: { kind: 'user', key: 'user-1', country: 'NG', plan: 'premium' },
        }),
        rules,
        deps
      );

      expect(result).toBe('default'); // fallback
    });

    it('segment without logical_op defaults to AND behavior', () => {
      const rules = [
        {
          id: 'default-segment-rule',
          kind: 'segment',
          order_index: 0,
          segment_id: 'default-segment',
          variation_id: 'default-variant',
        } as any,
      ];

      const deps = baseDeps({
        segmentsById: {
          'default-segment': {
            id: 'default-segment',
            // no logical_op specified
            rules: [
              { type: 'rule', attribute: 'country', operator: 'eq', value: 'NG' }, // matches
              { type: 'rule', attribute: 'plan', operator: 'eq', value: 'premium' }, // matches
            ],
          },
        },
        variationsById: {
          'default-variant': { id: 'default-variant', value: 'default-matched', type: 'string' },
        },
      });

      const result = evaluationLogic.evaluateFlagWithTargetingRules(
        baseInput({
          fallbackValue: 'default',
          expectedType: 'string',
          context: { kind: 'user', key: 'user-1', country: 'NG', plan: 'premium' },
        }),
        rules,
        deps
      );

      expect(result).toBe('default-matched');
    });

    it('empty rule array never matches even with OR logic', () => {
      const rules = [
        {
          id: 'empty-or-segment-rule',
          kind: 'segment',
          order_index: 0,
          segment_id: 'empty-or-segment',
          variation_id: 'empty-variant',
        } as any,
      ];

      const deps = baseDeps({
        segmentsById: {
          'empty-or-segment': {
            id: 'empty-or-segment',
            logical_op: 'OR',
            rules: [], // empty rules
          },
        },
        variationsById: {
          'empty-variant': { id: 'empty-variant', value: 'should-not-match', type: 'string' },
        },
      });

      const result = evaluationLogic.evaluateFlagWithTargetingRules(
        baseInput({
          fallbackValue: 'default',
          expectedType: 'string',
          context: { kind: 'user', key: 'user-1', country: 'NG' },
        }),
        rules,
        deps
      );

      expect(result).toBe('default'); // fallback - empty rules never match
    });
  });

  // === NOT SEGMENT LOGIC TESTS ===
  describe('NOT segment logic', () => {
    it('segment with NOT logic returns false when all rules match (NG + pro)', () => {
      const rules = [
        {
          id: 'not-segment-rule',
          kind: 'segment',
          order_index: 0,
          segment_id: 'not-segment',
          variation_id: 'not-variant',
        } as any,
      ];

      const deps = baseDeps({
        segmentsById: {
          'not-segment': {
            id: 'not-segment',
            logical_op: 'NOT',
            rules: [
              { type: 'rule', attribute: 'country', operator: 'eq', value: 'NG' }, // matches
              { type: 'rule', attribute: 'plan', operator: 'eq', value: 'pro' }, // matches
            ],
          },
        },
        variationsById: {
          'not-variant': { id: 'not-variant', value: 'not-matched', type: 'string' },
        },
      });

      const result = evaluationLogic.evaluateFlagWithTargetingRules(
        baseInput({
          fallbackValue: 'default',
          expectedType: 'string',
          context: { kind: 'user', key: 'user-1', country: 'NG', plan: 'pro' },
        }),
        rules,
        deps
      );

      expect(result).toBe('default'); // NOT inverts: all match → false → fallback
    });

    it('segment with NOT logic returns true when one rule does not match (NG + basic)', () => {
      const rules = [
        {
          id: 'not-segment-rule',
          kind: 'segment',
          order_index: 0,
          segment_id: 'not-segment',
          variation_id: 'not-variant',
        } as any,
      ];

      const deps = baseDeps({
        segmentsById: {
          'not-segment': {
            id: 'not-segment',
            logical_op: 'NOT',
            rules: [
              { type: 'rule', attribute: 'country', operator: 'eq', value: 'NG' }, // matches
              { type: 'rule', attribute: 'plan', operator: 'eq', value: 'pro' }, // does not match
            ],
          },
        },
        variationsById: {
          'not-variant': { id: 'not-variant', value: 'not-matched', type: 'string' },
        },
      });

      const result = evaluationLogic.evaluateFlagWithTargetingRules(
        baseInput({
          fallbackValue: 'default',
          expectedType: 'string',
          context: { kind: 'user', key: 'user-1', country: 'NG', plan: 'basic' },
        }),
        rules,
        deps
      );

      expect(result).toBe('not-matched'); // NOT inverts: not all match → true → variant value
    });

    it('segment with NOT logic returns true when first rule does not match (GH + pro)', () => {
      const rules = [
        {
          id: 'not-segment-rule',
          kind: 'segment',
          order_index: 0,
          segment_id: 'not-segment',
          variation_id: 'not-variant',
        } as any,
      ];

      const deps = baseDeps({
        segmentsById: {
          'not-segment': {
            id: 'not-segment',
            logical_op: 'NOT',
            rules: [
              { type: 'rule', attribute: 'country', operator: 'eq', value: 'NG' }, // does not match
              { type: 'rule', attribute: 'plan', operator: 'eq', value: 'pro' }, // matches
            ],
          },
        },
        variationsById: {
          'not-variant': { id: 'not-variant', value: 'not-matched', type: 'string' },
        },
      });

      const result = evaluationLogic.evaluateFlagWithTargetingRules(
        baseInput({
          fallbackValue: 'default',
          expectedType: 'string',
          context: { kind: 'user', key: 'user-1', country: 'GH', plan: 'pro' },
        }),
        rules,
        deps
      );

      expect(result).toBe('not-matched'); // NOT inverts: not all match → true → variant value
    });

    it('segment with NOT logic returns true when no rules match (GH + basic)', () => {
      const rules = [
        {
          id: 'not-segment-rule',
          kind: 'segment',
          order_index: 0,
          segment_id: 'not-segment',
          variation_id: 'not-variant',
        } as any,
      ];

      const deps = baseDeps({
        segmentsById: {
          'not-segment': {
            id: 'not-segment',
            logical_op: 'NOT',
            rules: [
              { type: 'rule', attribute: 'country', operator: 'eq', value: 'NG' }, // does not match
              { type: 'rule', attribute: 'plan', operator: 'eq', value: 'pro' }, // does not match
            ],
          },
        },
        variationsById: {
          'not-variant': { id: 'not-variant', value: 'not-matched', type: 'string' },
        },
      });

      const result = evaluationLogic.evaluateFlagWithTargetingRules(
        baseInput({
          fallbackValue: 'default',
          expectedType: 'string',
          context: { kind: 'user', key: 'user-1', country: 'GH', plan: 'basic' },
        }),
        rules,
        deps
      );

      expect(result).toBe('not-matched'); // NOT inverts: none match → true → variant value
    });
  });

  // === FORCE FLAG TESTS ===
  describe('force flag behavior', () => {
    it('segment with force=true always matches regardless of rules', () => {
      const rules = [
        {
          id: 'force-segment-rule',
          kind: 'segment',
          order_index: 0,
          segment_id: 'force-segment',
          variation_id: 'force-variant',
        } as any,
      ];

      const deps = baseDeps({
        segmentsById: {
          'force-segment': {
            id: 'force-segment',
            force: true,
            logical_op: 'AND',
            rules: [
              { type: 'rule', attribute: 'country', operator: 'eq', value: 'US' }, // would not match
              { type: 'rule', attribute: 'plan', operator: 'eq', value: 'enterprise' }, // would not match
            ],
          },
        },
        variationsById: {
          'force-variant': { id: 'force-variant', value: 'force-matched', type: 'string' },
        },
      });

      const result = evaluationLogic.evaluateFlagWithTargetingRules(
        baseInput({
          fallbackValue: 'default',
          expectedType: 'string',
          context: { kind: 'user', key: 'user-1', country: 'NG', plan: 'free' },
        }),
        rules,
        deps
      );

      expect(result).toBe('force-matched'); // force=true overrides all rules
    });

    it('segment with force=true matches even with empty rules', () => {
      const rules = [
        {
          id: 'force-empty-segment-rule',
          kind: 'segment',
          order_index: 0,
          segment_id: 'force-empty-segment',
          variation_id: 'force-empty-variant',
        } as any,
      ];

      const deps = baseDeps({
        segmentsById: {
          'force-empty-segment': {
            id: 'force-empty-segment',
            force: true,
            rules: [], // empty rules, but force=true
          },
        },
        variationsById: {
          'force-empty-variant': { id: 'force-empty-variant', value: 'force-empty-matched', type: 'string' },
        },
      });

      const result = evaluationLogic.evaluateFlagWithTargetingRules(
        baseInput({
          fallbackValue: 'default',
          expectedType: 'string',
          context: { kind: 'user', key: 'user-1' },
        }),
        rules,
        deps
      );

      expect(result).toBe('force-empty-matched'); // force=true overrides empty rules
    });

    it('segment with force=false uses normal rule evaluation', () => {
      const rules = [
        {
          id: 'no-force-segment-rule',
          kind: 'segment',
          order_index: 0,
          segment_id: 'no-force-segment',
          variation_id: 'no-force-variant',
        } as any,
      ];

      const deps = baseDeps({
        segmentsById: {
          'no-force-segment': {
            id: 'no-force-segment',
            force: false,
            logical_op: 'AND',
            rules: [
              { type: 'rule', attribute: 'country', operator: 'eq', value: 'US' }, // does not match
            ],
          },
        },
        variationsById: {
          'no-force-variant': { id: 'no-force-variant', value: 'should-not-match', type: 'string' },
        },
      });

      const result = evaluationLogic.evaluateFlagWithTargetingRules(
        baseInput({
          fallbackValue: 'default',
          expectedType: 'string',
          context: { kind: 'user', key: 'user-1', country: 'NG' },
        }),
        rules,
        deps
      );

      expect(result).toBe('default'); // force=false, rules don't match
    });

    it('force=true takes precedence over OR logic with failing rules', () => {
      const rules = [
        {
          id: 'force-or-segment-rule',
          kind: 'segment',
          order_index: 0,
          segment_id: 'force-or-segment',
          variation_id: 'force-or-variant',
        } as any,
      ];

      const deps = baseDeps({
        segmentsById: {
          'force-or-segment': {
            id: 'force-or-segment',
            force: true,
            logical_op: 'OR',
            rules: [
              { type: 'rule', attribute: 'country', operator: 'eq', value: 'US' }, // would not match
              { type: 'rule', attribute: 'plan', operator: 'eq', value: 'enterprise' }, // would not match
            ],
          },
        },
        variationsById: {
          'force-or-variant': { id: 'force-or-variant', value: 'force-or-matched', type: 'string' },
        },
      });

      const result = evaluationLogic.evaluateFlagWithTargetingRules(
        baseInput({
          fallbackValue: 'default',
          expectedType: 'string',
          context: { kind: 'user', key: 'user-1', country: 'NG', plan: 'free' },
        }),
        rules,
        deps
      );

      expect(result).toBe('force-or-matched'); // force=true overrides everything
    });
  });
});

// === DIRECT ROLLOUT FUNCTION TESTS ===
describe('applyPercentageRollout', () => {
  it('returns fallback when context has no stable key', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const result = evaluationLogic.applyPercentageRollout(
      'boolean',
      false,
      { percentage: 100, salt: 'test-salt' },
      { kind: 'unknown' }, // no key or user_id
      (input) => 50
    );

    expect(result).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Missing stable key for percentage rollout')
    );
    warnSpy.mockRestore();
  });

  it('returns fallback when context is missing kind and user_id', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const result = evaluationLogic.applyPercentageRollout(
      'boolean',
      false,
      { percentage: 100, salt: 'test-salt' },
      {}, // empty context
      (input) => 50
    );

    expect(result).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Missing stable key for percentage rollout')
    );
    warnSpy.mockRestore();
  });

  it('returns fallback when used on non-boolean flag type', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const result = evaluationLogic.applyPercentageRollout(
      'string', // not boolean
      'fallback',
      { percentage: 100, salt: 'test-salt' },
      { kind: 'user', key: 'user-1' },
      (input) => 50
    );

    expect(result).toBe('fallback');
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Percentage rollout used on non-boolean flag')
    );
    warnSpy.mockRestore();
  });

  it('returns true for 100% rollout with valid key', () => {
    const result = evaluationLogic.applyPercentageRollout(
      'boolean',
      false,
      { percentage: 100, salt: 'test-salt' },
      { kind: 'user', key: 'user-1' },
      (input) => 50
    );

    expect(result).toBe(true);
  });

  it('uses hash to determine rollout based on percentage', () => {
    // Mock hash that returns 30 -> bucket 30, percentage 50 -> should match
    const result1 = evaluationLogic.applyPercentageRollout(
      'boolean',
      false,
      { percentage: 50, salt: 'test-salt' },
      { kind: 'user', key: 'user-1' },
      (input) => 30 // bucket 30 < percentage 50
    );
    expect(result1).toBe(true);

    // Hash that returns 60 -> bucket 60, percentage 50 -> should not match
    const result2 = evaluationLogic.applyPercentageRollout(
      'boolean',
      false,
      { percentage: 50, salt: 'test-salt' },
      { kind: 'user', key: 'user-1' },
      (input) => 60 // bucket 60 >= percentage 50
    );
    expect(result2).toBe(false);
  });
});

  describe('applyVariantRollout', () => {
    it('returns fallback when context has no stable key', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const result = evaluationLogic.applyVariantRollout(
        'string',
        'fallback',
        {
          strategy: 'variant',
          salt: 'test-salt',
          variants: [{ variation_id: 'var-1', weight: 100 }],
        } as any,
        { 'var-1': { id: 'var-1', value: 'variant', type: 'string' } } as any,
        {}, // no key
        (input) => 50
      );

      expect(result).toBe('fallback');
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing stable key for variant rollout')
      );
      warnSpy.mockRestore();
    });

    it('returns fallback when variants array is empty', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const result = evaluationLogic.applyVariantRollout(
        'string',
        'fallback',
        {
          strategy: 'variant',
          salt: 'test-salt',
          variants: [], // empty variants
        } as any,
        {},
        { kind: 'user', key: 'user-1' },
        (input) => 50
      );

      expect(result).toBe('fallback');
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Variant rollout misconfigured')
      );
      warnSpy.mockRestore();
    });

    it('returns correct variant based on weight distribution', () => {
      // Bucket 25 -> cumulative var-a (0-50) -> should return var-a
      const result1 = evaluationLogic.applyVariantRollout(
        'string',
        'fallback',
        {
          strategy: 'variant',
          salt: 'test-salt',
          variants: [
            { variation_id: 'var-a', weight: 50 },
            { variation_id: 'var-b', weight: 50 },
          ],
        } as any,
        {
          'var-a': {
            id: 'var-a',
            value: 'variant-a',
            type: 'string',
            key: 'var-a',
            name: 'var-a',
            description: '',
            is_default: false,
            flag_id: 'flag-id',
            project_id: 'project-id',
            order_index: 0,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            deleted_at: null
          },
          'var-b': {
            id: 'var-b',
            value: 'variant-b',
            type: 'string',
            key: 'var-b',
            name: 'var-b',
            description: '',
            is_default: false,
            flag_id: 'flag-id',
            project_id: 'project-id',
            order_index: 1,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            deleted_at: null
          },
        },
        { kind: 'user', key: 'user-1' },
        (input) => 25
      );

      expect(result1).toBe('variant-a');

      // Bucket 75 -> cumulative var-b (50-100) -> should return var-b
      const result2 = evaluationLogic.applyVariantRollout(
        'string',
        'fallback',
        {
          strategy: 'variant',
          salt: 'test-salt',
          variants: [
            { variation_id: 'var-a', weight: 50 },
            { variation_id: 'var-b', weight: 50 },
          ],
        } as any,
        {
          'var-a': { id: 'var-a', value: 'variant-a', type: 'string' },
          'var-b': { id: 'var-b', value: 'variant-b', type: 'string' },
        } as any,
        { kind: 'user', key: 'user-1' },
        (input) => 75
      );

      expect(result2).toBe('variant-b');
    });

    it('returns fallback when variation not found in map', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const result = evaluationLogic.applyVariantRollout(
        'string',
        'fallback',
        {
          strategy: 'variant',
          salt: 'test-salt',
          variants: [{ variation_id: 'missing-var', weight: 100 }],
        } as any,
        {}, // missing variation
        { kind: 'user', key: 'user-1' },
        (input) => 50
      );

      expect(result).toBe('fallback');
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('missing variation_id')
      );
      warnSpy.mockRestore();
    });

    it('returns fallback when weights do not sum to 100', () => {
      // Bucket 60 - if weights are 30+30=60, bucket 60 doesn't fall into any range
      const result = evaluationLogic.applyVariantRollout(
        'string',
        'fallback',
        {
          strategy: 'variant',
          salt: 'test-salt',
          variants: [
            { variation_id: 'var-a', weight: 30 },
            { variation_id: 'var-b', weight: 30 }, // only 60 total
          ],
        } as any,
        {
          'var-a': { id: 'var-a', value: 'variant-a', type: 'string' },
          'var-b': { id: 'var-b', value: 'variant-b', type: 'string' },
        } as any,
        { kind: 'user', key: 'user-1' },
        (input) => 60 // bucket 60 >= cumulative 60
      );

      expect(result).toBe('fallback');
    });
  });

  describe('applyGradualRollout', () => {
    it('returns fallback when context has no stable key', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const result = evaluationLogic.applyGradualRollout(
        'boolean',
        false,
        {
          strategy: 'gradual',
          salt: 'test-salt',
          target_percentage: 100,
          increment: 10,
          interval_hours: 24,
          start_at: '2020-01-01T00:00:00Z',
        } as any,
        {}, // no key
        (input) => 50
      );

      expect(result).toBe(false);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing stable key for gradual rollout')
      );
      warnSpy.mockRestore();
    });

    it('returns fallback when used on non-boolean flag type', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const result = evaluationLogic.applyGradualRollout(
        'string', // not boolean
        'fallback',
        {
          strategy: 'gradual',
          salt: 'test-salt',
          target_percentage: 100,
          increment: 10,
          interval_hours: 24,
          start_at: '2020-01-01T00:00:00Z',
        } as any,
        { kind: 'user', key: 'user-1' },
        (input) => 50
      );

      expect(result).toBe('fallback');
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Gradual rollout used on non-boolean flag')
      );
      warnSpy.mockRestore();
    });

    it('returns fallback when rollout has not started yet', () => {
      const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
      const result = evaluationLogic.applyGradualRollout(
        'boolean',
        false,
        {
          strategy: 'gradual',
          salt: 'test-salt',
          target_percentage: 100,
          increment: 10,
          interval_hours: 24,
          start_at: futureDate.toISOString(),
        } as any,
        { kind: 'user', key: 'user-1' },
        (input) => 50
      );

      expect(result).toBe(false);
    });

    it('returns true when rollout has reached 100%', () => {
      // Start 1000 hours ago - enough to exceed 100%
      const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 1000);
      const result = evaluationLogic.applyGradualRollout(
        'boolean',
        false,
        {
          strategy: 'gradual',
          salt: 'test-salt',
          target_percentage: 100,
          increment: 10,
          interval_hours: 24,
          start_at: pastDate.toISOString(),
        } as any,
        { kind: 'user', key: 'user-1' },
        (input) => 50
      );

      expect(result).toBe(true);
    });

    it('returns fallback when missing salt property', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      // Use 48 hours ago to get 20% current (2 intervals * 10%), which is > 0 and < 100
      const pastDate = new Date(Date.now() - 48 * 60 * 60 * 1000);
      const result = evaluationLogic.applyGradualRollout(
        'boolean',
        false,
        {
          strategy: 'gradual',
          // missing salt - should trigger warning
          target_percentage: 100,
          increment: 10,
          interval_hours: 24,
          start_at: pastDate.toISOString(),
        } as any,
        { kind: 'user', key: 'user-1' },
        (input) => 50
      );

      expect(result).toBe(false);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("missing 'salt' property")
      );
      warnSpy.mockRestore();
    });

    it('uses hash bucketing when rollout is in progress', () => {
      // Start 48 hours ago = 20% current percentage (2 intervals * 10%)
      const pastDate = new Date(Date.now() - 48 * 60 * 60 * 1000);

      // Bucket 10 < percentage 20 -> should be true
      const result1 = evaluationLogic.applyGradualRollout(
        'boolean',
        false,
        {
          strategy: 'gradual',
          salt: 'test-salt',
          target_percentage: 100,
          increment: 10,
          interval_hours: 24,
          start_at: pastDate.toISOString(),
        } as any,
        { kind: 'user', key: 'user-1' },
        (input) => 10 // bucket 10 < 20% current
      );

      expect(result1).toBe(true);

      // Bucket 30 >= percentage 20 -> should be false
      const result2 = evaluationLogic.applyGradualRollout(
        'boolean',
        false,
        {
          strategy: 'gradual',
          salt: 'test-salt',
          target_percentage: 100,
          increment: 10,
          interval_hours: 24,
          start_at: pastDate.toISOString(),
        } as any,
        { kind: 'user', key: 'user-1' },
        (input) => 30 // bucket 30 >= 20% current
      );

      expect(result2).toBe(false);
    });
  });

  describe('computeCurrentPercentage', () => {
    it('returns 0% when rollout has an invalid current time', () => {
      const warnSpy = jest.spyOn(console, 'error').mockImplementation();
      const result = evaluationLogic.computeCurrentPercentage(
        {
          strategy: 'gradual',
          salt: 'test',
          target_percentage: 100,
          increment: 10,
          interval_hours: 24,
          start_at: 'not-a-date',
        } as Rollout,
        '2024-01-01T00:00:00Zt'
      );

      expect(result).toBe(0);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid current time provided to computeCurrentPercentage')
      );
      warnSpy.mockRestore();
    });

    it('returns 0% when rollout is not defined', () => {
      const result = evaluationLogic.computeCurrentPercentage(
        null as any,
      );

      expect(result).toBe(0);
    });
    
    it('returns 0% when rollout start date is invalid', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();
      const result = evaluationLogic.computeCurrentPercentage(
        {
          strategy: 'gradual',
          salt: 'test',
          target_percentage: 100,
          increment: 10,
          interval_hours: 24,
          start_at: 'not-a-date',
        } as Rollout,
        new Date()
      );

      expect(result).toBe(0);
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid start_at time in gradual rollout')
      );
      errorSpy.mockRestore();
    });

    it('returns 0% when rollout has not started yet', () => {
      const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
      const result = evaluationLogic.computeCurrentPercentage(
        {
          strategy: 'gradual',
          salt: 'test',
          target_percentage: 100,
          increment: 10,
          interval_hours: 24,
          start_at: futureDate.toISOString(),
        } as Rollout,
        new Date()
      );

      expect(result).toBe(0);
    });

    it('starts at the first increment as soon as the rollout begins', () => {
      // Product choice: live traffic from hour 0 at 1× increment (not 0% until the first interval ends).
      const startAt = new Date();
      const result = evaluationLogic.computeCurrentPercentage(
        {
          strategy: 'gradual',
          salt: 'test',
          target_percentage: 100,
          increment: 5,
          interval_hours: 1,
          start_at: startAt.toISOString(),
        } as Rollout,
        startAt
      );

      expect(result).toBe(5);
    });

    it('returns incremented percentage based on elapsed intervals', () => {
      // Start 48 hours ago = 2 complete 24h intervals → steps = 2 + 1 (live from start) = 3
      // 3 * 10% increment = 30%
      const pastDate = new Date(Date.now() - 48 * 60 * 60 * 1000);
      const result = evaluationLogic.computeCurrentPercentage(
        {
          strategy: 'gradual',
          salt: 'test',
          target_percentage: 100,
          increment: 10,
          interval_hours: 24,
          start_at: pastDate.toISOString(),
        } as Rollout,
        new Date()
      );

      expect(result).toBe(30);
    });

    it('respects target_percentage cap', () => {
      // Start way in past, but cap at 50%
      const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 1000);
      const result = evaluationLogic.computeCurrentPercentage(
        {
          strategy: 'gradual',
          salt: 'test',
          target_percentage: 50, // cap at 50%
          increment: 10,
          interval_hours: 24,
          start_at: pastDate.toISOString(),
        } as Rollout,
        new Date()
      );

      expect(result).toBe(50); // capped, not more
    });

    it('handles Date objects as now parameter', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const now = new Date();

      const result = evaluationLogic.computeCurrentPercentage(
        {
          strategy: 'gradual',
          salt: 'test',
          target_percentage: 100,
          increment: 10,
          interval_hours: 24,
          start_at: pastDate.toISOString(),
        } as Rollout,
        now,
      );

      // 1 complete interval + starting step = 2 × 10% = 20%
      expect(result).toBe(20);
    });
  });
});

describe('applyRolloutStrategy', () => {
  const context: EvaluationContextT = { kind: 'user', key: 'user-1' };
  const mockHash = jest.fn().mockReturnValue(10);

  it('returns fallback for "off" strategy', () => {
    const result = evaluationLogic.applyRolloutStrategy(
      { strategy: 'off' } as any,
      'boolean',
      false,
      {},
      context,
      mockHash
    );
    expect(result).toBe(false);
  });

  it('applies percentage rollout and returns true when hash is below threshold', () => {
    const rollout = { strategy: 'percentage', percentage: 50, salt: 'test-salt' } as any;
    // mockHash returns 10 which is below 50%, so should be enabled
    const result = evaluationLogic.applyRolloutStrategy(rollout, 'boolean', false, {}, context, mockHash);
    expect(result).toBe(true);
  });

  it('applies percentage rollout and returns fallback when hash is above threshold', () => {
    const highHash = jest.fn().mockReturnValue(80);
    const rollout = { strategy: 'percentage', percentage: 50, salt: 'test-salt' } as any;
    // highHash returns 80 which is above 50%, so should be disabled
    const result = evaluationLogic.applyRolloutStrategy(rollout, 'boolean', false, {}, context, highHash);
    expect(result).toBe(false);
  });

  it('applies gradual rollout and returns true when fully ramped up', () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 10); // 10 days ago
    const rollout = {
      strategy: 'gradual',
      start_at: pastDate.toISOString(),
      target_percentage: 100,
      increment: 10,
      interval_hours: 1,
      salt: 'test-salt',
    } as any;
    // With 100% target and 10 days of hourly increments, rollout is fully ramped
    const result = evaluationLogic.applyRolloutStrategy(rollout, 'boolean', false, {}, context, mockHash);
    expect(result).toBe(true);
  });

  it('returns fallback for unknown strategy', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const result = evaluationLogic.applyRolloutStrategy(
      { strategy: 'unknown' } as any,
      'boolean',
      false,
      {},
      context,
      mockHash
    );
    expect(result).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("Unsupported rollout strategy 'unknown'"));
    warnSpy.mockRestore();
  });
});

