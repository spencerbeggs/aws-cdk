import { transformAttributeValueMap } from './private/utils';

/**
 * Determines the level of detail about provisioned throughput consumption that is returned.
 */
export enum DynamoConsumedCapacity {
  /**
   * The response includes the aggregate ConsumedCapacity for the operation,
   * together with ConsumedCapacity for each table and secondary index that was accessed
   */
  INDEXES = 'INDEXES',

  /**
   * The response includes only the aggregate ConsumedCapacity for the operation.
   */
  TOTAL = 'TOTAL',

  /**
   * No ConsumedCapacity details are included in the response.
   */
  NONE = 'NONE',
}

/**
 * Determines whether item collection metrics are returned.
 */
export enum DynamoItemCollectionMetrics {
  /**
   * If set to SIZE, the response includes statistics about item collections,
   * if any, that were modified during the operation.
   */
  SIZE = 'SIZE',

  /**
   * If set to NONE, no statistics are returned.
   */
  NONE = 'NONE',
}

/**
 * Use ReturnValues if you want to get the item attributes as they appear before or after they are changed
 */
export enum DynamoReturnValues {
  /**
   * Nothing is returned
   */
  NONE = 'NONE',

  /**
   * Returns all of the attributes of the item
   */
  ALL_OLD = 'ALL_OLD',

  /**
   * Returns only the updated attributes
   */
  UPDATED_OLD = 'UPDATED_OLD',

  /**
   * Returns all of the attributes of the item
   */
  ALL_NEW = 'ALL_NEW',

  /**
   * Returns only the updated attributes
   */
  UPDATED_NEW = 'UPDATED_NEW',
}

/**
 * Class to generate projection expression
 */
export class DynamoProjectionExpression {
  private expression: string[] = [];

  /**
   * Adds the passed attribute to the chain
   *
   * @param attr Attribute name
   */
  public withAttribute(attr: string): DynamoProjectionExpression {
    if (this.expression.length) {
      this.expression.push(`.${attr}`);
    } else {
      this.expression.push(attr);
    }
    return this;
  }

  /**
   * Adds the array literal access for passed index
   *
   * @param index array index
   */
  public atIndex(index: number): DynamoProjectionExpression {
    if (!this.expression.length) {
      throw new Error('Expression must start with an attribute');
    }

    this.expression.push(`[${index}]`);
    return this;
  }

  /**
   * converts and return the string expression
   */
  public toString(): string {
    return this.expression.join('');
  }
}

/**
 * Map of string to AttributeValue
 */
export interface DynamoAttributeValueMap {
  [key: string]: DynamoAttributeValue;
}

/**
 * Represents the data for an attribute.
 * Each attribute value is described as a name-value pair.
 * The name is the data type, and the value is the data itself.
 *
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValue.html
 */
export class DynamoAttributeValue {
  /**
   * Sets an attribute of type String. For example:  "S": "Hello"
   * Strings may be literal values or as JsonPath
   */
  public static wrapString(s: string) {
    return new DynamoAttributeValue({ S: s });
  }

  /**
   * Sets a literal number. For example: 1234
   * Numbers are sent across the network to DynamoDB as strings,
   * to maximize compatibility across languages and libraries.
   * However, DynamoDB treats them as number type attributes for mathematical operations.
   */
  public static wrapNumber(n: number) {
    return new DynamoAttributeValue({ N: n.toString() });
  }

  /**
   * Sets an attribute of type Number. For example:  "N": "123.45"
   * Numbers are sent across the network to DynamoDB as strings,
   * to maximize compatibility across languages and libraries.
   * However, DynamoDB treats them as number type attributes for mathematical operations.
   *
   * Numbers may be expressed as literal strings or as JsonPath
   */
  public static wrapNumberFromString(n: string) {
    return new DynamoAttributeValue({ N: n.toString() });
  }

  /**
   * Sets an attribute of type Binary. For example:  "B": "dGhpcyB0ZXh0IGlzIGJhc2U2NC1lbmNvZGVk"
   */
  public static wrapBinary(b: string) {
    return new DynamoAttributeValue({ B: b });
  }

  /**
   * Sets an attribute of type String Set. For example:  "SS": ["Giraffe", "Hippo" ,"Zebra"]
   */
  public static wrapStringSet(ss: string[]) {
    return new DynamoAttributeValue({ SS: ss });
  }

  /**
   * Sets an attribute of type Number Set. For example:  "NS": ["42.2", "-19", "7.5", "3.14"]
   * Numbers are sent across the network to DynamoDB as strings,
   * to maximize compatibility across languages and libraries.
   * However, DynamoDB treats them as number type attributes for mathematical operations.
   */
  public static wrapNumberSet(ns: number[]) {
    return new DynamoAttributeValue({ NS: ns.toString() });
  }

  /**
   * Sets an attribute of type Number Set. For example:  "NS": ["42.2", "-19", "7.5", "3.14"]
   * Numbers are sent across the network to DynamoDB as strings,
   * to maximize compatibility across languages and libraries.
   * However, DynamoDB treats them as number type attributes for mathematical operations.
   *
   * Numbers may be expressed as literal strings or as JsonPath
   */
  public static wrapNumberSetFromString(ns: string[]) {
    return new DynamoAttributeValue({ NS: ns });
  }

  /**
   * Sets an attribute of type Binary Set. For example:  "BS": ["U3Vubnk=", "UmFpbnk=", "U25vd3k="]
   */
  public static wrapBinarySet(bs: string[]) {
    return new DynamoAttributeValue({ BS: bs });
  }

  /**
   * Sets an attribute of type Map. For example:  "M": {"Name": {"S": "Joe"}, "Age": {"N": "35"}}
   */
  public static wrapMap(m: { [key: string]: DynamoAttributeValue }) {
    return new DynamoAttributeValue({ M: transformAttributeValueMap(m) });
  }

  /**
   * Sets an attribute of type List. For example:  "L": [ {"S": "Cookies"} , {"S": "Coffee"}, {"N", "3.14159"}]
   */
  public static wrapList(l: DynamoAttributeValue[]) {
    return new DynamoAttributeValue({ L: l.map((val) => val.toObject()) });
  }

  /**
   * Sets an attribute of type Null. For example:  "NULL": true
   */
  public static wrapNull(isNull: boolean) {
    return new DynamoAttributeValue({ NULL: isNull });
  }

  /**
   * Sets an attribute of type Boolean. For example:  "BOOL": true
   */
  public static wrapBoolean(isBoolean: boolean) {
    return new DynamoAttributeValue({ BOOL: isBoolean });
  }

  public readonly attributeValue: any;

  private constructor(value: any) {
    this.attributeValue = value;
  }

  /**
   * Returns the DynamoDB attribute value
   */
  public toObject() {
    return this.attributeValue;
  }
}
